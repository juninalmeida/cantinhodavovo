import { useEffect, useRef } from 'react'

interface TurnstileWidgetProps {
  onTokenChange: (token: string | null) => void
  resetKey?: number
}

interface TurnstileApi {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string
      theme?: 'light' | 'dark' | 'auto'
      callback?: (token: string) => void
      'expired-callback'?: () => void
      'error-callback'?: () => void
    },
  ) => string
  remove: (widgetId: string) => void
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

let turnstileScriptPromise: Promise<void> | null = null

function loadTurnstileScript() {
  if (window.turnstile) {
    return Promise.resolve()
  }

  if (turnstileScriptPromise) {
    return turnstileScriptPromise
  }

  turnstileScriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-turnstile-script="true"]')

    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true })
      existing.addEventListener('error', () => reject(new Error('Falha ao carregar o Turnstile.')), { once: true })
      return
    }

    const script = document.createElement('script')
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
    script.async = true
    script.defer = true
    script.dataset.turnstileScript = 'true'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Falha ao carregar o Turnstile.'))
    document.head.appendChild(script)
  })

  return turnstileScriptPromise
}

export function TurnstileWidget({ onTokenChange, resetKey = 0 }: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const widgetIdRef = useRef<string | null>(null)
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY

  useEffect(() => {
    onTokenChange(null)

    if (!siteKey || !containerRef.current) {
      return
    }

    let active = true

    void loadTurnstileScript()
      .then(() => {
        if (!active || !containerRef.current || !window.turnstile) {
          return
        }

        containerRef.current.innerHTML = ''

        if (widgetIdRef.current) {
          window.turnstile.remove(widgetIdRef.current)
          widgetIdRef.current = null
        }

        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          theme: 'light',
          callback: (token) => {
            if (active) {
              onTokenChange(token)
            }
          },
          'expired-callback': () => {
            if (active) {
              onTokenChange(null)
            }
          },
          'error-callback': () => {
            if (active) {
              onTokenChange(null)
            }
          },
        })
      })
      .catch(() => {
        if (active) {
          onTokenChange(null)
        }
      })

    return () => {
      active = false

      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current)
        widgetIdRef.current = null
      }
    }
  }, [onTokenChange, resetKey, siteKey])

  if (!siteKey) {
    return null
  }

  return <div className="rounded-2xl border-2 border-cafe/10 bg-creme-manteiga/30 p-4" ref={containerRef} />
}
