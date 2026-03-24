import { useState, useEffect } from 'react'

const BREAKPOINTS = {
  mobile: 767,
  tablet: 1023,
}

export function useBreakpoint() {
  const [largura, setLargura] = useState(window.innerWidth)

  useEffect(() => {
    function handleResize() {
      setLargura(window.innerWidth)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return {
    isMobile: largura <= BREAKPOINTS.mobile,
    isTablet: largura > BREAKPOINTS.mobile && largura <= BREAKPOINTS.tablet,
    isDesktop: largura > BREAKPOINTS.tablet,
    largura,
  }
}
