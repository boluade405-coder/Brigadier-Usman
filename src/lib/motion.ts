import type { Transition, Variants } from 'framer-motion'

const standardEase = [0.22, 1, 0.36, 1] as const

export const spring: Transition = {
  type: 'spring',
  stiffness: 260,
  damping: 26,
  mass: 0.8,
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.45, ease: standardEase } },
}

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: standardEase } },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: spring },
}

export const slideIn: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: standardEase } },
}

export const photoReveal: Variants = {
  hidden: { opacity: 0, scale: 1.04, clipPath: 'inset(7% 0 7% 0)' },
  visible: { opacity: 1, scale: 1, clipPath: 'inset(0% 0 0% 0)', transition: { duration: 0.8, ease: standardEase } },
}

export const modalReveal: Variants = {
  hidden: { opacity: 0, y: 14, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: spring },
  exit: { opacity: 0, y: 8, scale: 0.985, transition: { duration: 0.16, ease: 'easeIn' } },
}

export const pageTransition: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.48, ease: standardEase } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2, ease: 'easeIn' } },
}

export const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.075, delayChildren: 0.08 } },
}