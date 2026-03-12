import type { AuthenticatedUser, DeliveryAddressInput } from '../../../shared/contracts/app.js'
import { env } from '../../../server/config/env.js'
import { AppError } from '../../../server/http/app-error.js'
import { toAuthenticatedUser } from '../../users/domain/user.js'
import type { AddressRepository } from '../../users/infrastructure/address-repository.js'
import type { UserRepository } from '../../users/infrastructure/user-repository.js'
import type { AuthSession } from '../domain/auth-types.js'
import type { PasswordService } from '../infrastructure/password-service.js'
import type { RefreshTokenRepository } from '../infrastructure/refresh-token-repository.js'
import type { JwtService } from '../infrastructure/token-service.js'

interface RegisterInput {
  name: string
  email: string
  phone?: string
  password: string
  defaultAddress: DeliveryAddressInput
}

interface LoginInput {
  email: string
  password: string
}

export class AuthService {
  constructor(
    private readonly users: UserRepository,
    private readonly addresses: AddressRepository,
    private readonly refreshTokens: RefreshTokenRepository,
    private readonly passwords: PasswordService,
    private readonly jwtService: JwtService,
  ) {}

  async register(input: RegisterInput): Promise<AuthSession> {
    const existing = await this.users.findByEmail(input.email)

    if (existing) {
      throw new AppError(409, 'Já existe uma conta com este e-mail.')
    }

    const passwordHash = await this.passwords.hash(input.password)
    const user = await this.users.create({
      name: input.name,
      email: input.email,
      phone: input.phone,
      passwordHash,
      role: 'CUSTOMER',
    })

    const defaultAddress = await this.addresses.create({
      userId: user.id,
      ...input.defaultAddress,
      label: 'Principal',
      isDefault: true,
    })

    return this.createSession(toAuthenticatedUser(user), defaultAddress)
  }

  async login(input: LoginInput): Promise<AuthSession> {
    const user = await this.users.findByEmail(input.email)

    if (!user) {
      throw new AppError(401, 'Credenciais inválidas.')
    }

    const validPassword = await this.passwords.compare(input.password, user.passwordHash)

    if (!validPassword) {
      throw new AppError(401, 'Credenciais inválidas.')
    }

    const defaultAddress = await this.addresses.findDefaultByUserId(user.id)
    return this.createSession(toAuthenticatedUser(user), defaultAddress)
  }

  async refresh(refreshTokenValue: string | undefined): Promise<AuthSession> {
    if (!refreshTokenValue) {
      throw new AppError(401, 'Refresh token ausente.')
    }

    const tokenHash = this.jwtService.hashRefreshToken(refreshTokenValue)
    const storedToken = await this.refreshTokens.findActiveByTokenHash(tokenHash)

    if (!storedToken) {
      throw new AppError(401, 'Refresh token inválido ou expirado.')
    }

    const user = await this.users.findById(storedToken.userId)

    if (!user) {
      throw new AppError(401, 'Sessão inválida.')
    }

    await this.refreshTokens.revokeByTokenHash(tokenHash)
    const defaultAddress = await this.addresses.findDefaultByUserId(user.id)
    return this.createSession(toAuthenticatedUser(user), defaultAddress)
  }

  async logout(refreshTokenValue: string | undefined): Promise<void> {
    if (!refreshTokenValue) {
      return
    }

    const tokenHash = this.jwtService.hashRefreshToken(refreshTokenValue)
    await this.refreshTokens.revokeByTokenHash(tokenHash)
  }

  getUserFromAccessToken(accessToken: string): AuthenticatedUser {
    return this.jwtService.verifyAccessToken(accessToken)
  }

  async getSessionFromAccessToken(accessToken: string): Promise<AuthSession> {
    const user = this.jwtService.verifyAccessToken(accessToken)
    const defaultAddress = await this.addresses.findDefaultByUserId(user.id)

    return {
      user,
      defaultAddress,
      accessToken,
      refreshToken: '',
    }
  }

  private async createSession(
    user: AuthenticatedUser,
    defaultAddress?: AuthSession['defaultAddress'],
  ): Promise<AuthSession> {
    const accessToken = this.jwtService.createAccessToken(user)
    const refreshToken = this.jwtService.createRefreshToken()
    const tokenHash = this.jwtService.hashRefreshToken(refreshToken)
    const expiresAt = new Date(Date.now() + env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000)

    await this.refreshTokens.create(user.id, tokenHash, expiresAt)

    return {
      user,
      defaultAddress: defaultAddress ?? null,
      accessToken,
      refreshToken,
    }
  }
}
