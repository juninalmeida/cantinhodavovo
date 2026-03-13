let csrfTokenCache: string | null = null
let csrfRequestInFlight: Promise<string> | null = null

interface CsrfResponse {
  csrfToken: string
}

export function clearCsrfTokenCache() {
  csrfTokenCache = null
}

export async function getCsrfToken(forceRefresh = false) {
  if (!forceRefresh && csrfTokenCache) {
    return csrfTokenCache
  }

  if (csrfRequestInFlight) {
    return csrfRequestInFlight
  }

  csrfRequestInFlight = fetch('/api/auth/csrf', {
    method: 'GET',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
    },
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error('Nao foi possivel obter o token CSRF.')
      }

      const payload = (await response.json()) as Partial<CsrfResponse>

      if (typeof payload.csrfToken !== 'string' || payload.csrfToken.length < 32) {
        throw new Error('Resposta CSRF invalida.')
      }

      csrfTokenCache = payload.csrfToken
      return payload.csrfToken
    })
    .finally(() => {
      csrfRequestInFlight = null
    })

  return csrfRequestInFlight
}
