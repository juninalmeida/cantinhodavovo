import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getHashFromHomeSection, getHomeSectionFromHash, type HomeSectionId } from '@client/modules/home/model/homeSections'

export function useSectionNav() {
  const location = useLocation()
  const navigate = useNavigate()

  const activeSection = location.pathname === '/' ? getHomeSectionFromHash(location.hash) : null

  const goToSection = useCallback(
    (section: HomeSectionId) => {
      const hash = getHashFromHomeSection(section)

      navigate(hash ? { pathname: '/', hash } : '/')
    },
    [navigate],
  )

  const toggleSection = useCallback(
    (section: HomeSectionId) => {
      if (activeSection === section) {
        navigate('/')
        return
      }

      goToSection(section)
    },
    [activeSection, goToSection, navigate],
  )

  return {
    activeSection,
    goToSection,
    toggleSection,
  }
}
