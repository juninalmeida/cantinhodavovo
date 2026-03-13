import type { NextFunction, Request, Response } from 'express'
import type { UserRole } from '../../../shared/contracts/app.js'
import { AppError } from '../http/app-error.js'
import { cookieNames, readCookieValue } from '../security/cookies.js'
import type { JwtService } from '../../modules/auth/infrastructure/token-service.js'

export function requireAuth(jwtService: JwtService) {
  return (request: Request, _response: Response, next: NextFunction) => {
    const token = readCookieValue(request.cookies, cookieNames.accessToken)

    if (!token) {
      next(new AppError(401, 'Autenticacao obrigatoria.'))
      return
    }

    request.user = jwtService.verifyAccessToken(token)
    next()
  }
}

export function requireRole(roles: UserRole[]) {
  return (request: Request, _response: Response, next: NextFunction) => {
    if (!request.user) {
      next(new AppError(401, 'Autenticacao obrigatoria.'))
      return
    }

    if (!roles.includes(request.user.role)) {
      next(new AppError(403, 'Voce nao tem permissao para acessar este recurso.'))
      return
    }

    next()
  }
}
