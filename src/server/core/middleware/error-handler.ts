import type { ErrorRequestHandler } from 'express'
import { ZodError } from 'zod'
import { AppError } from '../http/app-error.js'

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error instanceof ZodError) {
    response.status(400).json({
      message: 'Dados invalidos enviados na requisicao.',
      issues: error.issues,
    })
    return
  }

  if (error instanceof AppError) {
    response.status(error.statusCode).json({ message: error.message })
    return
  }

  console.error(error)
  response.status(500).json({ message: 'Erro interno do servidor.' })
}
