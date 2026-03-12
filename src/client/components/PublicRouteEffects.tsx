import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { LoadingScreen } from '../brand/LoadingScreen'

const PUBLIC_INTRO_KEY = 'cv_public_intro_seen'

function isPublicRoute(pathname: string) {
  return pathname === '/' || pathname === '/login' || pathname === '/cadastro' || pathname.startsWith('/acompanhar')
}

function scrollToHash(hash: string) {
  const targetId = hash.replace('#', '')

  window.setTimeout(() => {
    const element = document.getElementById(targetId)
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, 120)
}

export function PublicRouteEffects() {
  const location = useLocation()
  const [introSeen, setIntroSeen] = useState(() => {
    if (typeof window === 'undefined') {
      return true
    }

    return window.sessionStorage.getItem(PUBLIC_INTRO_KEY) === '1'
  })
  const publicRoute = useMemo(() => isPublicRoute(location.pathname), [location.pathname])
  const showIntro = publicRoute && !introSeen

  useEffect(() => {
    if (!publicRoute || showIntro || !location.hash) {
      return
    }

    scrollToHash(location.hash)
  }, [location.hash, location.pathname, publicRoute, showIntro])

  useEffect(() => {
    if (!publicRoute || location.hash) {
      return
    }

    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [location.hash, location.pathname, publicRoute])

  const handleComplete = useCallback(() => {
    window.sessionStorage.setItem(PUBLIC_INTRO_KEY, '1')
    setIntroSeen(true)

    if (location.hash) {
      scrollToHash(location.hash)
    }
  }, [location.hash])

  if (!showIntro) {
    return null
  }

  return <LoadingScreen onComplete={handleComplete} />
}
