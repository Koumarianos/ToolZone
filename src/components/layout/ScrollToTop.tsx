import { useEffect } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

const ScrollToTop: React.FC = () => {
  const location = useLocation()
  const navigationType = useNavigationType()

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'auto'
    }
  }, [])

  useEffect(() => {
    if (navigationType === 'POP') return
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
  }, [location.pathname, location.search, location.hash, navigationType])

  return null
}

export default ScrollToTop