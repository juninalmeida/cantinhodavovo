import { createHmac, randomBytes } from 'node:crypto'
import jwt from 'jsonwebtoken'
import type { AuthenticatedUser } from '../../../shared/contracts/app.js'
import { env } from '../../../server/config/env.js'
import { AppError } from '../../../server/http/app-error.js'

export class JwtService {
  createAccessToken(user: AuthenticatedUser): string {
    return jwt.sign(
      {
        sub: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      env.JWT_ACCESS_SECRET,
      {
        expiresIn: `${env.ACCESS_TOKEN_TTL_MINUTES}m`,
      },
    )
  }

  verifyAccessToken(token: string): AuthenticatedUser {
    try {
      const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as jwt.JwtPayload

      return {
        id: String(payload.sub),
        name: String(payload.name),
        email: String(payload.email),
        phone: payload.phone ? String(payload.phone) : null,
        role: String(payload.role) as AuthenticatedUser['role'],
      }
    } catch {
      throw new AppError(401, 'Token de acesso inválido ou expirado.')
    }
  }

  createRefreshToken(): string {
    return randomBytes(48).toString('hex')
  }

  hashRefreshToken(token: string): string {
    return createHmac('sha256', env.JWT_REFRESH_SECRET).update(token).digest('hex')
  }
}
