import { useEffect, useRef } from 'react'
import Lenis from 'lenis'

type UseLenisOptions = ConstructorParameters<typeof Lenis>[0]
const defaultOptions: UseLenisOptions = {
  autoRaf: true,
  smoothWheel: true,
}

export function useLenis(options: UseLenisOptions = defaultOptions) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const lenis = new Lenis(options)
    lenisRef.current = lenis

    return () => {
      lenis.destroy()
      lenisRef.current = null
    }
  }, [options])

  return lenisRef
}
