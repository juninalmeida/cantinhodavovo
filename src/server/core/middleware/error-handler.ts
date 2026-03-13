import type { ErrorRequestHandler } from 'express'
import { ZodError } from 'zod'
import { AppError } from '../http/app-error.js'
import { buildSafeRequestLog } from '../security/redact.js'

export const errorHandler: ErrorRequestHandler = (error, request, response, _next) => {
  if (error instanceof ZodError) {
    response.status(400).json({
      message: 'Dados invalidos enviados na requisicao.',
      code: 'VALIDATION_ERROR',
      issues: error.issues,
    })
    return
  }

  if (error instanceof AppError) {
    response.status(error.statusCode).json({
      message: error.message,
      code: error.code,
    })
    return
  }

  console.error('Unhandled application error', {
    request: buildSafeRequestLog(request),
    error,
  })
  response.status(500).json({ message: 'Erro interno do servidor.', code: 'INTERNAL_SERVER_ERROR' })
}
