import { useEffect, useLayoutEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useLenis } from './useLenis'
import { MemorialPage } from './MemorialPages'

const archive = [
  { src: '/archive/mu5.jpg', title: 'A private moment', meta: 'Portrait • Archive collection', position: '50% 34%' },
  { src: '/archive/mu6.jpg', title: 'A lesson in public service', meta: 'Addressing a gathering • Archive collection', position: '50% 45%' },
  { src: '/archive/mu7.jpg', title: 'A ceremonial welcome', meta: 'Official engagement • Archive collection', position: '50% 45%' },
  { src: '/archive/mu9.jpg', title: 'Among the people', meta: 'Public engagement • Archive collection', position: '50% 45%' },
  { src: '/archive/mu11.jpg', title: 'In council', meta: 'Meeting of minds • Archive collection', position: '50% 45%' },
  { src: '/archive/mu12.jpg', title: 'Across borders, in friendship', meta: 'Diplomatic occasion • Archive collection', position: '50% 42%' },
  { src: '/archive/mu13.jpg', title: 'On a day of honour', meta: 'Ceremonial occasion • Archive collection', position: '50% 40%' },
]

const navFeatures = [
  { id: 'story', label: 'His story', number: '01', title: 'The man behind the title.', description: 'A considered introduction to Brigadier Musa Usman’s character, public presence and the values that shaped the life remembered here.', action: 'Read his story' },
  { id: 'journey', label: 'The journey', number: '02', title: 'A life in chapters.', description: 'A clear, chronological pathway through the formative milestones of service, leadership and the enduring legacy that followed.', action: 'Follow the journey' },
  { id: 'gallery', label: 'Archive', number: '03', title: 'Life in pictures.', description: 'A preserved visual collection of public engagements, ceremonial occasions and personal moments. Select any image for a focused, full-screen viewing experience.', action: 'Open the archive' },
  { id: 'legacy', label: 'Legacy', number: '04', title: 'What remains is the example.', description: 'A reflective closing space that brings the memorial together and invites visitors to carry forward the qualities revealed throughout the collection.', action: 'Explore the legacy' },
]

const milestones = [
  ['1940', 'A beginning', 'Born into a generation that would help shape a new nation.'],
  ['Service', 'A life in uniform', 'Military discipline and a lifelong commitment to duty became defining principles.'],
  ['Leadership', 'Called to govern', 'He carried the responsibilities of public office with purpose and composure.'],
  ['Legacy', 'Remembered still', 'His example endures in the family, communities and institutions he served.'],
]

const welcomeStorageKey = 'musa-usman-welcome-shown-at'
const welcomeDuration = 24 * 60 * 60 * 1000

function Arrow() { return <span aria-hidden="true" className="arrow">→</span> }

function WelcomeCard({ onClose }) {
  return <div className="welcome-overlay" role="dialog" aria-modal="true" aria-labelledby="welcome-title">
    <section className="welcome-card">
      <button className="welcome-close" onClick={onClose} aria-label="Close welcome message">×</button>
      <div className="welcome-copy">
        <p className="eyebrow">WELCOME</p>
        <h2 id="welcome-title">Welcome to the<br />Musa Usman Memorial.</h2>
        <p>Discover the life, service and enduring legacy of Brigadier Musa Usman through this digital memorial.</p>
        <button className="welcome-action" onClick={onClose}>Enter the memorial <span aria-hidden="true">›</span></button>
      </div>
      <div className="welcome-image"><img src="/hero/musa-usman-handshake.webp" alt="Military officers shaking hands at an official engagement" /></div>
    </section>
  </div>
}

export default function App() {
  useLenis()
  const location = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const [scrolled, setScrolled] = useState(false)
  const [heroEntered, setHeroEntered] = useState(false)
  const [welcomeOpen, setWelcomeOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('story')
  const route = location.pathname.split('/').filter(Boolean).at(-1)
  const page = location.pathname === '/archive/records' ? 'archive/records' : ['journey', 'archive', 'legacy'].includes(route) ? route : ''

  // Each route is a new page view, so never carry its predecessor's scroll position over.
  useLayoutEffect(() => {
    window.history.scrollRestoration = 'manual'
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [page])

  useEffect(() => {
    try {
      localStorage.setItem(welcomeStorageKey, String(Date.now()))
    } catch {
      // ignore storage issues
    }
  }, [])

  useEffect(() => {
    document.documentElement.classList.remove('welcome-open')
    document.body.classList.remove('welcome-open')
  }, [])

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 18)
    }
    onScroll(); window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const hero = document.getElementById('top')
    if (!hero) return undefined
    const revealIfVisible = () => {
      const bounds = hero.getBoundingClientRect()
      if (bounds.top < window.innerHeight && bounds.bottom > 0) setHeroEntered(true)
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setHeroEntered(true)
        observer.disconnect()
      }
    }, { threshold: .15 })
    observer.observe(hero)
    revealIfVisible()
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (page) return undefined
    const sections = navFeatures.map(feature => document.getElementById(feature.id)).filter(Boolean)
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visible) setActiveSection(visible.target.id)
    }, { rootMargin: '-30% 0px -52% 0px', threshold: [.05, .3, .6] })
    sections.forEach(section => observer.observe(section))
    return () => observer.disconnect()
  }, [page])

  useEffect(() => {
    if (page) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const images = [...document.querySelectorAll('[data-parallax]')]
    let frame
    const updateParallax = () => {
      frame = undefined
      images.forEach(image => {
        const bounds = image.getBoundingClientRect()
        const distanceFromCenter = (window.innerHeight * .5) - (bounds.top + bounds.height * .5)
        const amount = Math.max(-30, Math.min(30, distanceFromCenter * Number(image.dataset.parallax || .16)))
        image.style.setProperty('--parallax-y', `${amount.toFixed(1)}px`)
      })
    }
    const requestUpdate = () => {
      if (!frame) frame = requestAnimationFrame(updateParallax)
    }
    updateParallax()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
    }
  }, [page])

  useEffect(() => {
    if (page) return undefined
    const observer = new IntersectionObserver(
      entries => entries.forEach(entry => entry.isIntersecting && entry.target.classList.add('is-visible')),
      { threshold: .13 },
    )
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [page])


  const navigateTo = (destination) => {
    setMenuOpen(false)
    const nextPath = destination ? `/${destination}` : '/'
    if (location.pathname !== nextPath) navigate(nextPath)
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }

  const goTo = (id) => {
    setMenuOpen(false)

    if (id === 'top') {
      navigateTo('')
      return
    }

    if (id === 'journey') return navigateTo('journey')
    if (id === 'gallery') return navigateTo('archive')
    if (id === 'legacy') return navigateTo('legacy')

    if (page) {
      navigate('/')
      window.setTimeout(() => {
        const target = document.getElementById(id) || document.getElementById('top')
        target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 60)
      return
    }

    const target = document.getElementById(id)
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  if (page) return <><MemorialPage page={page} onNavigate={navigateTo} />{welcomeOpen && <WelcomeCard onClose={() => setWelcomeOpen(false)} />}</>

  return <><main>
    <header className={`nav ${scrolled ? 'nav-solid' : ''}`}>
      <button className="wordmark" onClick={() => goTo('top')} aria-label="Back to top">
        <span>MU</span><i></i><b>MEMORIAL</b>
      </button>
      <nav className="desktop-nav" aria-label="Primary navigation">
        {navFeatures.map(feature => <button key={feature.id} className={activeSection === feature.id ? 'active' : ''} onClick={() => goTo(feature.id)} aria-current={activeSection === feature.id ? 'page' : undefined}>{feature.label}</button>)}
      </nav>
      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="Open menu">
        <span></span><span></span>
      </button>
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        {navFeatures.map(feature => <button key={feature.id} className={activeSection === feature.id ? 'active' : ''} onClick={() => goTo(feature.id)} aria-current={activeSection === feature.id ? 'page' : undefined}>{feature.label} <Arrow /></button>)}
      </div>
    </header>

    <section id="top" className={`hero ${heroEntered ? 'hero-loaded' : ''}`} aria-labelledby="hero-title">
      <div className="hero-image-wrap">
        <picture className="hero-picture" aria-hidden="true">
          <img className="hero-image" src="/hero/musa-usman-ceremony.webp" alt="" />
          <img className="hero-image hero-image-secondary" src="/hero/musa-usman-handshake.webp" alt="" />
        </picture>
      </div>
      <div className="hero-copy">
        <p className="eyebrow">IN MEMORY</p>
        <h1 id="hero-title">Brigadier<br />Musa Usman</h1>
        <p className="hero-role">A life of <span>service</span>, leadership and legacy</p>
        <p className="hero-intro">The archive honours the duty, discipline and quiet conviction that shaped a remarkable public life.</p>
        <div className="hero-actions">
          <button className="text-link" onClick={() => goTo('journey')}>Follow the journey <Arrow /></button>
          <button className="text-link secondary-action" onClick={() => goTo('gallery')}>View archive <Arrow /></button>
        </div>
      </div>
      <span className="hero-caption">Public service • leadership • legacy</span>
    </section>

    <section className="intro reveal" id="story">
      <p className="eyebrow">IN REMEMBRANCE</p>
      <h2>A statesman of<br /><em>quiet conviction.</em></h2>
      <div className="intro-detail">
        <p>Brigadier Musa Usman’s life was shaped by duty, leadership and an unwavering belief in the public good. This living archive honours the man behind the office and the example he left for generations to come.</p>
        <button className="text-link" onClick={() => goTo('journey')}>Follow the journey <Arrow /></button>
      </div>
      <img className="intro-officer" src="/portraits/military-officer-background-removed.webp" alt="" aria-hidden="true" />
    </section>

    <section className="memorial-guide" aria-labelledby="guide-title">
      <div className="guide-heading reveal"><p className="eyebrow">EXPLORE THE MEMORIAL</p><h2 id="guide-title">Every section has<br /><em>a purpose.</em></h2><p>Move through the archive in any order. Each area has been designed as a distinct way to understand, remember and return to this life.</p></div>
      <div className="guide-grid">
        {navFeatures.map(feature => <article className="guide-card reveal" key={feature.id}>
          <span className="guide-number">{feature.number}</span><p className="eyebrow">{feature.label}</p><h3>{feature.title}</h3><p>{feature.description}</p><button className="text-link" onClick={() => goTo(feature.id)}>{feature.action} <Arrow /></button>
        </article>)}
      </div>
    </section>

    <section className="portrait-feature reveal">
      <div className="feature-photo image-frame reveal media-reveal"><img className="parallax-image" data-parallax=".16" src="/archive/11.webp" alt="Brigadier Musa Usman speaking at a ceremony" /></div>
      <div className="feature-copy">
        <p className="eyebrow">THE MAN</p>
        <h2>Grace in every<br />chapter.</h2>
        <p>Beyond rank and office was a man remembered for warmth, presence and a deep regard for the people around him.</p>
        <blockquote>“A legacy is not only what we build, but how we make others feel seen.”</blockquote>
      </div>
    </section>

    <section className="service-feature reveal">
      <div className="service-content"><p className="eyebrow light">PUBLIC SERVICE</p><h2>Leadership<br />with <em>purpose.</em></h2><p>The photographs in this collection trace a public life lived in conversation — at the podium, in council and among fellow citizens.</p><button className="text-link light-link" onClick={() => goTo('gallery')}>Explore the archive <Arrow /></button></div>
      <div className="service-media reveal media-reveal"><img className="parallax-image" data-parallax=".2" src="/hero/musa-usman-handshake.webp" alt="Brigadier Musa Usman greeting another officer" /></div>
    </section>

    <section className="legacy-section" id="legacy">
      <div className="legacy-image reveal media-reveal"><img className="parallax-image" data-parallax=".18" src="/hero/musa-usman-ceremony.webp" alt="Brigadier Musa Usman at a public ceremony" /></div>
      <div className="legacy-copy reveal"><p className="eyebrow">A LASTING LEGACY</p><h2>What remains<br />is <em>the example.</em></h2><p>We preserve these memories not only to look back, but to carry forward the qualities they reveal: courage, humility and service.</p><div className="legacy-line"></div><p className="dates">BRIGADIER MUSA USMAN<br /><span>1940—1991</span></p></div>
    </section>

    <section className="memory-cta reveal"><p className="eyebrow">THE MEMORIAL</p><h2>Keep his story<br />close.</h2><p>This archive is a place to remember, reflect and return to the moments that shaped a remarkable life.</p><button className="round-button" onClick={() => goTo('gallery')}>Visit the archive <Arrow /></button></section>

    <footer><div className="footer-mark"><span>MU</span><p>Brigadier Musa Usman<br /><small>Digital Memorial</small></p></div><nav className="footer-nav" aria-label="Memorial navigation">{navFeatures.map(feature => <button key={feature.id} onClick={() => goTo(feature.id)}>{feature.label}</button>)}</nav><p>Remembering a life of service and legacy.</p><p>© {new Date().getFullYear()} Musa Usman Memorial</p></footer>

    {selected !== null && <div className="modal" role="dialog" aria-modal="true" aria-label="Archive image viewer" onClick={() => setSelected(null)}>
      <button className="modal-close" onClick={() => setSelected(null)} aria-label="Close image viewer">×</button>
      <button className="modal-arrow prev" onClick={(e) => { e.stopPropagation(); setSelected((selected + archive.length - 1) % archive.length) }} aria-label="Previous image">←</button>
      <figure onClick={e => e.stopPropagation()}><img src={archive[selected].src} alt={archive[selected].title} /><figcaption><b>{archive[selected].title}</b><span>{archive[selected].meta}</span></figcaption></figure>
      <button className="modal-arrow next" onClick={(e) => { e.stopPropagation(); setSelected((selected + 1) % archive.length) }} aria-label="Next image">→</button>
    </div>}
  </main>{welcomeOpen && <WelcomeCard onClose={() => setWelcomeOpen(false)} />}</>
}
