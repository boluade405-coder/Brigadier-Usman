import { useEffect, useRef, useState } from 'react'

const journeyPhotos = [
  '/archive/1.webp',
  '/archive/2.webp',
  '/archive/3.webp',
  '/archive/4.webp',
  '/archive/5.webp',
]

const journeyItems = [
  { year: '1940', kicker: 'Origins', title: 'The beginning of a life in service.', summary: 'Family, place and early influences shaped the man before the uniform.', copy: 'Born in Enugu on 3 February 1940, Musa Usman’s story begins before the uniform: with family, early influences and a generation coming of age alongside a changing Nigeria.', image: '/archive/mu5.jpg', alt: 'Portrait from the Musa Usman archive', note: 'Family history, early photographs and school records help complete this chapter.' },
  { year: 'Early years', kicker: 'Childhood & education', title: 'Before the General, there was the student.', summary: 'Education in Kaduna built the discipline and curiosity that guided his career.', copy: 'His early education and years in Kaduna developed the discipline, curiosity and sense of responsibility that would guide his career. At Military School, Zaria, he took on leadership as Senior Prefect.', image: '/archive/mu11.jpg', alt: 'Brigadier Musa Usman in a meeting', note: 'A space for school photographs, certificates, mentors and classmates.' },
  { year: 'Training', kicker: 'Becoming an officer', title: 'A formation across four countries.', summary: 'International training turned promise into professional command.', copy: 'Professional training took him from Nigeria to the Regular Officers Training School in Teshie, Ghana; Mons Officers Cadet School at Aldershot; the Royal Military Academy Sandhurst; and the U.S. Army Infantry School at Fort Benning.', image: '/archive/mu13.jpg', alt: 'Brigadier Musa Usman in ceremonial uniform', note: 'Nigeria → Ghana → United Kingdom → United States → Nigeria' },
  { year: '1960s', kicker: 'International service', title: 'Leadership beyond Nigeria’s borders.', summary: 'Peacekeeping in the Congo widened his experience of command and cooperation.', copy: 'Service during Nigeria’s participation in United Nations peacekeeping in the Congo widened his experience of command, international cooperation and responsibility in a turbulent moment.', image: '/archive/mu12.jpg', alt: 'Brigadier Musa Usman at an international occasion', note: 'Photographs, correspondence, maps and press reports are preserved as evidence of this chapter.' },
  { year: '1960s', kicker: 'Founding years', title: 'The birth of the Nigerian Air Force.', summary: 'Early aviation work connected his service to a new national institution.', copy: 'He was among Army officers connected to the early development of the Nigerian Air Force, including training and work around Kaduna’s emerging aviation infrastructure.', image: '/archive/mu7.jpg', alt: 'Brigadier Musa Usman at an official engagement', note: 'The Founding Years collection brings together aircraft, station and officer records.' },
  { year: '1967', kicker: 'A pivotal appointment', title: 'Governor at 27.', summary: 'A young officer assumed responsibility for a region in transition.', copy: 'At 27, Musa Usman was appointed Military Governor of the North-Eastern State. The role placed him at the centre of administration across a vast region during a period of national transition.', image: '/archive/mu6.jpg', alt: 'Brigadier Musa Usman presenting beside a map of Nigeria', note: 'The former North-Eastern State later became Borno, Yobe, Adamawa, Taraba, Bauchi and Gombe.' },
  { year: '1967–1970', kicker: 'Governing during war', title: 'Keeping government moving.', summary: 'Administration continued through conflict, scarcity and public responsibility.', copy: 'His administration worked through the civil-war period amid questions of security, movement, food supply, public services and continuity across the region.', image: '/archive/mu9.jpg', alt: 'Brigadier Musa Usman during a public engagement', note: 'This chapter privileges photographs, maps, reports and newspaper records over retrospective claims.' },
  { year: '1970–1975', kicker: 'Building institutions', title: 'From administration to a development agenda.', summary: 'Public institutions became the foundation for a long-term regional vision.', copy: 'Government departments, public institutions, education, agriculture, industry and infrastructure became connected parts of a long-term regional development vision.', image: '/archive/mu6.jpg', alt: 'Brigadier Musa Usman presenting beside a map of Nigeria', note: 'The story continues in the Legacy project atlas.' },
].map((item, index) => ({
  ...item,
  image: journeyPhotos[index % journeyPhotos.length],
  alt: index % 2 === 0
    ? 'Military officers shaking hands at an official engagement'
    : 'Military officer preparing to speak at an outdoor ceremony',
}))

const archiveItems = [
  { src: '/archive/70.webp', title: 'A shared occasion', collection: 'Public service', meta: 'Official gathering · Archive collection' },
  { src: '/archive/60.webp', title: 'An official arrival', collection: 'Governor', meta: 'Public engagement · Archive collection' },
  { src: '/archive/50.webp', title: 'A moment of reflection', collection: 'Portraits', meta: 'Personal portrait · Archive collection' },
  { src: '/archive/30.webp', title: 'At the podium', collection: 'Military service', meta: 'Ceremonial address · Archive collection' },
  { src: '/archive/20.webp', title: 'A meeting of officers', collection: 'Military service', meta: 'Official engagement · Archive collection' },
  { src: '/archive/40.webp', title: 'Quiet confidence', collection: 'Portraits', meta: 'Personal portrait · Archive collection' },
]

const collections = [['Childhood', 'Family, school and early photographs'], ['Military', 'Uniform, training and fellow officers'], ['Congo', 'Peacekeeping and international assignment'], ['Air Force', 'Kaduna, aircraft and founding years'], ['Governor', 'Government House, cabinet and official visits'], ['Development', 'Roads, schools, hospitals and industry'], ['Family', 'Private life and personal memory'], ['Later years', 'Post-government and corporate life']]
const evidenceTypes = [
  { title: 'Documents', body: 'Military records, government directives, project plans, correspondence and personal papers are catalogued with a date, source and transcription whenever available.' },
  { title: 'Newspapers', body: 'A historical newspaper wall can bring together publications, dates, headlines, scans and contextual notes from 1960 through the present.' },
  { title: 'Speeches', body: 'Statements can be preserved with original audio where available, transcript, scan, occasion and historical context for researchers.' },
  { title: 'Maps', body: 'Layers can trace the North-Eastern State in 1967, administrative divisions, present-day states and major development projects.' },
  { title: 'Oral histories', body: '“Those Who Remember” records the voices of family, former colleagues, civil servants, community members and historians.' },
]
const legacyThemes = [
  { number: '01', title: 'Infrastructure & connection', text: 'Road development, inter-town links and the Maiduguri Airport project addressed the challenges of governing a geographically expansive region. Their intended purpose was practical connection: administration, commerce, agriculture and mobility.', projects: ['Regional roads', 'Maiduguri Airport', 'Government offices & housing'] },
  { number: '02', title: 'Education & human capital', text: 'The North-East College of Arts and Science and Government Technical College, Maiduguri represent an approach that connected schools and technical training to the region’s future workforce.', projects: ['North-East College of Arts and Science', 'Government Technical College, Maiduguri', 'Technical & vocational training'] },
  { number: '03', title: 'Agriculture & water', text: 'Agriculture, irrigation, water resources and rural development were central to the region’s economy. The Chad Basin Development Authority belongs to this longer institutional story of food production and water management.', projects: ['Chad Basin development', 'Irrigation & water resources', 'Rural agricultural schemes'] },
  { number: '04', title: 'Industry & enterprise', text: 'Industrial planning joined agricultural production to processing, construction and employment. Savannah Sugar at Numan and Ashaka Cement form important parts of this history, while small-scale credit was intended to support local enterprise.', projects: ['Savannah Sugar, Numan', 'Ashaka Cement', 'Small-scale industries credit scheme'], caution: 'Ashaka Cement was commissioned in 1979, after his tenure. The archive distinguishes initiatives and planning during the administration from facilities completed later.' },
  { number: '05', title: 'Institution building', text: 'The enduring story is not only one of individual projects. Public administration, education, agriculture, industry and infrastructure were conceived as connected institutions capable of supporting long-term regional development.', projects: ['Public administration', 'Healthcare & public services', 'Urban planning & tourism'] },
]

function PageHeader({ page, onNavigate }) {
  return <header className="page-nav"><button className="page-wordmark" onClick={() => onNavigate('')}><span>MU</span><b>MEMORIAL</b></button><nav aria-label="Memorial sections"><button onClick={() => onNavigate('')}>Home</button><button className={page === 'journey' ? 'active' : ''} onClick={() => onNavigate('journey')}>Journey</button><button className={page === 'archive' ? 'active' : ''} onClick={() => onNavigate('archive')}>Archive</button><button className={page === 'legacy' ? 'active' : ''} onClick={() => onNavigate('legacy')}>Legacy</button></nav><button className="back-home" onClick={() => onNavigate('')}>← Home</button></header>
}

function JourneyPageLegacy({ onNavigate }) {
  const [selected, setSelected] = useState(0); const item = journeyItems[selected]
  return <><PageHeader page="journey" onNavigate={onNavigate} /><main className="detail-page journey-page"><section className="page-hero journey-page-hero"><div><p className="eyebrow">THE JOURNEY · 1940—1975</p><h1>A life in<br /><em>chapters.</em></h1><p>A chronological account of the man, the officer and the administrator — told through the people, places and records that shaped his life.</p></div><figure className="journey-hero-portrait"><img src="/portraits/musa-usman-uniform.webp" alt="Brigadier Musa Usman in ceremonial uniform" /></figure></section><section className="journey-detail"><div className="journey-list" role="tablist" aria-label="Life chapters">{journeyItems.map((chapter, index) => <button key={chapter.title} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)} role="tab" aria-selected={selected === index}><span>{String(index + 1).padStart(2, '0')}</span><b>{chapter.year}</b><i>{chapter.kicker}</i></button>)}</div><article className="journey-focus"><div className="journey-focus-copy"><p className="eyebrow">{item.year} · {item.kicker}</p><h2>{item.title}</h2><p>{item.copy}</p><aside>{item.note}</aside><button className="text-link" onClick={() => onNavigate('archive')}>View related archive <span className="arrow">→</span></button></div><img key={`${item.image}-${selected}`} src={item.image} alt={item.alt} /></article></section><section className="journey-markers"><p className="eyebrow">THE PATH OF SERVICE</p><div><span>Cadet</span><i>→</i><span>Officer</span><i>→</i><span>Command</span><i>→</i><span>Governor</span><i>→</i><span>Brigadier</span></div></section></main></>
}

function ArchivePageLegacy({ onNavigate }) {
  const [filter, setFilter] = useState('All'); const [selected, setSelected] = useState(null); const filters = ['All', 'Military service', 'Congo & international service', 'Governor', 'Development era', 'Family & private life']; const visible = filter === 'All' ? archiveItems : archiveItems.filter(item => item.collection === filter)
  return <><PageHeader page="archive" onNavigate={onNavigate} /><main className="detail-page archive-page"><section className="page-hero archive-page-hero"><p className="eyebrow">THE ARCHIVE · PRESERVING THE EVIDENCE</p><h1>A living<br /><em>record.</em></h1><p>A digital museum of the man, the era and the evidence: photographs, documents, maps, newspapers and the memories of those who knew the work.</p></section><section className="archive-collections"><div><p className="eyebrow">PHOTOGRAPH COLLECTIONS</p><h2>Eight ways into<br />the archive.</h2></div><div className="collection-list">{collections.map(([title, description], index) => <article key={title}><span>{String(index + 1).padStart(2, '0')}</span><b>{title}</b><p>{description}</p></article>)}</div></section><div className="archive-toolbar" role="toolbar" aria-label="Filter archive images">{filters.map(item => <button key={item} className={filter === item ? 'active' : ''} onClick={() => setFilter(item)}>{item}</button>)}</div><section className="archive-page-grid">{visible.map(item => <button className="archive-page-card" key={item.src} onClick={() => setSelected(item)}><img src={item.src} alt={item.title} loading="lazy" /><span><small>{item.collection}</small><b>{item.title}</b><i>{item.meta}</i></span><em>↗</em></button>)}</section><section className="archive-evidence"><div><p className="eyebrow">BEYOND THE PHOTOGRAPH</p><h2>Made useful for<br /><em>memory and research.</em></h2></div><div>{evidenceTypes.map((item, index) => <article key={item.title}><span>{String(index + 1).padStart(2, '0')}</span><h3>{item.title}</h3><p>{item.body}</p></article>)}</div></section></main>{selected && <div className="archive-lightbox" role="dialog" aria-modal="true" aria-label="Archive image viewer" onClick={() => setSelected(null)}><button onClick={() => setSelected(null)} aria-label="Close viewer">×</button><figure onClick={event => event.stopPropagation()}><img src={selected.src} alt={selected.title} /><figcaption><b>{selected.title}</b><span>{selected.meta}</span></figcaption></figure></div>}</>
}

function LegacyPage({ onNavigate }) {
  const [open, setOpen] = useState(0)
  const [termIndex, setTermIndex] = useState(0)
  const legacyTerms = ['long', 'Great']

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTermIndex(current => (current + 1) % legacyTerms.length)
    }, 4000)

    return () => window.clearInterval(interval)
  }, [])

  const isLegacyVisible = termIndex === 1

  return <><PageHeader page="legacy" onNavigate={onNavigate} /><main className="detail-page legacy-page"><section className="page-hero legacy-page-hero"><img className="legacy-page-hero-image" src="/archive/1.webp" alt="" aria-hidden="true" fetchPriority="high" /><p className="eyebrow">LEGACY · WHAT HIS ADMINISTRATION SET IN MOTION</p><h1>Building for<br /><span className="legacy-term-line"><span className="legacy-term-static">the </span><span className="legacy-term-swap"><span className={termIndex === 0 ? 'legacy-term-word is-visible' : 'legacy-term-word'}>long</span><span className={termIndex === 1 ? 'legacy-term-word legacy-term-word-alt is-visible' : 'legacy-term-word legacy-term-word-alt'}>Great</span></span><span className={isLegacyVisible ? 'legacy-term-static legacy-term-legacy is-visible' : 'legacy-term-static legacy-term-term'}>{isLegacyVisible ? ' legacy.' : ' term.'}</span></span></h1><p>The legacy is best understood as a development story: linked investments in institutions, people, services and the systems that support a region.</p></section><section className="legacy-intro"><p className="eyebrow">AN INTERPRETIVE FRAMEWORK</p><div><h2>Not a list of buildings.<br /><em>A connected vision.</em></h2><p>Education, agriculture, industry, infrastructure and public administration formed mutually reinforcing parts of a regional development philosophy. This framework interprets that connection; archival records remain the source for individual projects.</p></div></section><section className="legacy-explorer"><div className="legacy-explorer-image"><img src="/archive/mu9.jpg" alt="Brigadier Musa Usman walking during a public engagement" /><div><span>Five pillars</span><b>Institution<br />building</b></div></div><div className="legacy-accordions">{legacyThemes.map((theme, index) => <article className={open === index ? 'open' : ''} key={theme.title}><button onClick={() => setOpen(open === index ? -1 : index)} aria-expanded={open === index}><span>{theme.number}</span><b>{theme.title}</b><strong>{open === index ? '−' : '+'}</strong></button><div className="legacy-panel"><div><p>{theme.text}</p><ul>{theme.projects.map(project => <li key={project}>{project}</li>)}</ul>{theme.caution && <small>{theme.caution}</small>}</div></div></article>)}<button className="round-button" onClick={() => onNavigate('archive')}>Explore the evidence <span className="arrow">→</span></button></div></section><section className="legacy-footprint"><p className="eyebrow">THE DEVELOPMENT FOOTPRINT</p><h2>Land <i>→</i> water <i>→</i> farming <i>→</i> processing <i>→</i> markets <i>→</i> opportunity.</h2><p>From the Chad Basin to Numan, Ashaka, Maiduguri and communities across the former North-Eastern State, the project atlas locates initiatives within the larger development story.</p></section></main></>
}

function JourneyPage({ onNavigate }) {
  const getStoryFromUrl = () => {
    const rawParam = new URLSearchParams(window.location.search).get('story')
    if (rawParam === null || rawParam.trim() === '') return null
    const param = Number(rawParam)
    return Number.isInteger(param) && param >= 0 && param < journeyItems.length ? param : null
  }

  const [selected, setSelected] = useState(0)
  const [openStory, setOpenStory] = useState(() => getStoryFromUrl())
  const carouselRef = useRef(null)
  const cardRefs = useRef([])
  const dragRef = useRef({ active: false, startX: 0, startScroll: 0, moved: false, suppressClick: false })
  const item = journeyItems[selected]
  const selectCard = index => {
    setSelected(index)
    cardRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
  }
  const goToPrevious = () => selectCard((selected + journeyItems.length - 1) % journeyItems.length)
  const goToNext = () => selectCard((selected + 1) % journeyItems.length)

  const syncStoryUrl = storyIndex => {
    const nextUrl = new URL(window.location.href)
    nextUrl.pathname = '/journey'
    if (storyIndex === null || storyIndex === undefined) nextUrl.searchParams.delete('story')
    else nextUrl.searchParams.set('story', String(storyIndex))
    window.history.pushState({}, '', nextUrl)
  }

  const openChapter = index => {
    setSelected(index)
    setOpenStory(index)
    syncStoryUrl(index)
  }

  const closeStory = () => {
    setOpenStory(null)
    syncStoryUrl(null)
  }

  const handleChapterClick = index => {
    if (dragRef.current.suppressClick) {
      dragRef.current.suppressClick = false
      return
    }
    openChapter(index)
  }

  useEffect(() => {
    const syncFromUrl = () => {
      const storyIndex = getStoryFromUrl()
      if (storyIndex !== null) {
        setSelected(storyIndex)
        setOpenStory(storyIndex)
      } else {
        setOpenStory(null)
      }
    }

    window.addEventListener('popstate', syncFromUrl)
    return () => window.removeEventListener('popstate', syncFromUrl)
  }, [])

  useEffect(() => {
    const carousel = carouselRef.current
    if (!carousel) return undefined

    const storyIndex = getStoryFromUrl()
    if (storyIndex === null) {
      carousel.scrollTo({ left: 0, behavior: 'auto' })
      setSelected(0)
    }

    return undefined
  }, [])

  useEffect(() => {
    const carousel = carouselRef.current
    if (!carousel) return undefined
    let frame
    const updateActiveCard = () => {
      frame = undefined
      let nearest = 0
      let nearestDistance = Infinity
      cardRefs.current.forEach((card, index) => {
        if (!card) return
        const distance = Math.abs(card.offsetLeft - carousel.scrollLeft)
        if (distance < nearestDistance) { nearest = index; nearestDistance = distance }
      })
      setSelected(current => current === nearest ? current : nearest)
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(updateActiveCard) }
    carousel.addEventListener('scroll', onScroll, { passive: true })
    return () => { carousel.removeEventListener('scroll', onScroll); if (frame) cancelAnimationFrame(frame) }
  }, [])

  useEffect(() => {
    const carousel = carouselRef.current
    if (!carousel) return undefined
    const drag = dragRef.current
    const onPointerDown = event => {
      if (event.pointerType === 'mouse' && event.button !== 0) return
      drag.active = true
      drag.startX = event.clientX
      drag.startScroll = carousel.scrollLeft
      drag.moved = false
      carousel.classList.add('is-dragging')
      carousel.setPointerCapture?.(event.pointerId)
    }
    const onPointerMove = event => {
      if (!drag.active) return
      const distance = event.clientX - drag.startX
      if (Math.abs(distance) > 5) drag.moved = true
      if (drag.moved) {
        event.preventDefault()
        carousel.scrollLeft = drag.startScroll - distance
      }
    }
    const onPointerUp = event => {
      if (!drag.active) return
      drag.active = false
      drag.suppressClick = drag.moved
      carousel.classList.remove('is-dragging')
      carousel.releasePointerCapture?.(event.pointerId)
    }
    carousel.addEventListener('pointerdown', onPointerDown)
    carousel.addEventListener('pointermove', onPointerMove)
    carousel.addEventListener('pointerup', onPointerUp)
    carousel.addEventListener('pointercancel', onPointerUp)
    return () => {
      carousel.removeEventListener('pointerdown', onPointerDown)
      carousel.removeEventListener('pointermove', onPointerMove)
      carousel.removeEventListener('pointerup', onPointerUp)
      carousel.removeEventListener('pointercancel', onPointerUp)
    }
  }, [])

  if (openStory !== null) return <JourneyStoryDetail chapter={journeyItems[openStory]} index={openStory} onBack={closeStory} onNavigate={onNavigate} />

  return <>
    <PageHeader page="journey" onNavigate={onNavigate} />
    <main className="detail-page journey-page">
      <section className="page-hero journey-page-hero">
        <div><p className="eyebrow">THE JOURNEY · 1940—1975</p><h1>A life in<br /><em>chapters.</em></h1><p>A chronological account of the man, the officer and the administrator — told through the people, places and records that shaped his life.</p></div>
        <figure className="journey-hero-portrait"><img src="/portraits/musa-usman-uniform.webp" alt="Brigadier Musa Usman in ceremonial uniform" /></figure>
      </section>

      <section className="journey-rebuild" aria-labelledby="journey-rebuild-title">
        <div className="journey-rebuild-intro">
          <p className="eyebrow">A LIFE OF SERVICE</p>
          <h2 id="journey-rebuild-title">A legacy that<br /><em>moved a region forward.</em></h2>
          <p>Follow the milestones, places and people that shaped Brigadier Musa Usman’s life in service — from early formation to lasting public leadership.</p>
        </div>

        <div className="journey-stories-heading">
          <h3>Real stories. <em>Real impact.</em></h3>
          <button onClick={() => onNavigate('archive')}>Explore the archive <span aria-hidden="true">›</span></button>
        </div>
        <div className="journey-chapter-window" ref={carouselRef}>
          <div className="journey-chapter-grid" aria-label="Journey chapters">
          {journeyItems.map((chapter, index) => {
            return <article className={`journey-chapter-card ${selected === index ? 'active' : ''}`} key={chapter.title} ref={element => { cardRefs.current[index] = element }}>
            <button className="journey-chapter-media" onClick={() => handleChapterClick(index)} aria-label={`Open story: ${chapter.title}`}>
              <img src={chapter.image} alt="" />
              <div className="journey-chapter-overlay"><p>{chapter.year} · {chapter.kicker}</p><h3>{chapter.title}</h3><span className="journey-chapter-summary">{chapter.summary}</span></div>
              <span className="journey-card-arrow" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6" /></svg></span>
            </button>
          </article>
          })}
          </div>
        </div>
        <div className="journey-stories-controls" aria-label="Story carousel controls">
          <button onClick={goToPrevious} aria-label="Previous story"><svg viewBox="0 0 24 24"><path d="M19 12H6M11 6l-6 6 6 6" /></svg></button>
          <button onClick={goToNext} aria-label="Next story"><svg viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6" /></svg></button>
        </div>

      </section>
    </main>
  </>
}

function JourneyStoryDetail({ chapter, index, onBack, onNavigate }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [chapter, index])

  return <main className="story-detail-page">
    <div className="story-detail-topline" aria-hidden="true"></div>
    <section className="story-detail-intro">
      <p className="eyebrow">CHAPTER {String(index + 1).padStart(2, '0')} · {chapter.year}</p>
      <h1>{chapter.title}</h1>
      <p>{chapter.copy}</p>
    </section>
    <section className="story-detail-context" id="story-detail-context">
      <article><p className="eyebrow">THE FOCUS</p><h2>{chapter.kicker}</h2><p>This chapter traces a formative point in Musa Usman’s public life. It is presented as part of a wider record of service, leadership and the institutions shaped by his work.</p></article>
      <aside><p className="eyebrow">ARCHIVE NOTE</p><p>{chapter.note}</p><button onClick={() => onNavigate('archive')}>Explore related records <span aria-hidden="true">→</span></button></aside>
    </section>
    <section className="story-detail-next"><p>Continue through the record.</p><button onClick={onBack}>Return to the Journey <span aria-hidden="true">→</span></button></section>
  </main>
}

function ArchivePage({ onNavigate }) {
  const [selected, setSelected] = useState(null)
  const [termIndex, setTermIndex] = useState(0)
  const archiveTerms = ['record.', 'legacy.']
  const filmstrip = [...archiveItems, ...archiveItems]

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTermIndex(current => (current + 1) % archiveTerms.length)
    }, 4000)

    return () => window.clearInterval(interval)
  }, [])

  return <>
    <PageHeader page="archive" onNavigate={onNavigate} />
    <main className="detail-page archive-rebuild-page">
      <section className="page-hero legacy-page-hero archive-page-hero">
        <img className="legacy-page-hero-image" src="/archive/70.webp" alt="" aria-hidden="true" fetchPriority="high" />
        <p className="eyebrow">THE ARCHIVE · PRESERVING THE EVIDENCE</p>
        <h1>A living<br /><span className="legacy-term-line"><span className="legacy-term-swap"><span className={termIndex === 0 ? 'legacy-term-word is-visible' : 'legacy-term-word'}>record.</span><span className={termIndex === 1 ? 'legacy-term-word legacy-term-word-alt is-visible legacy-term-legacy' : 'legacy-term-word legacy-term-word-alt'}>legacy.</span></span></span></h1>
        <p>A digital museum of the man, the era and the evidence: photographs, documents, maps, newspapers and the memories of those who knew the work.</p>
      </section>

      <section className="archive-marquee" aria-labelledby="archive-marquee-title">
        <div className="archive-filmstrip" aria-hidden="true"><div className="archive-filmstrip-track">{filmstrip.map((item, index) => <figure key={`${item.src}-${index}`}><img src={item.src} alt="" /></figure>)}</div></div>
        <div className="archive-marquee-copy">
          <p className="eyebrow">THE MUSA USMAN COLLECTION</p>
          <h2 id="archive-marquee-title">Memory made<br />visible.</h2>
          <p>From ceremonial moments to quiet conversations, this collection preserves the photographs and records that give a public life its human detail.</p>
        </div>
      </section>

      <section className="archive-facts" aria-labelledby="archive-facts-title">
        <header><h2 id="archive-facts-title">Every image holds<br /><em>a story.</em></h2><button onClick={() => document.getElementById('archive-evidence')?.scrollIntoView({ behavior: 'smooth' })}>Explore the records <span aria-hidden="true">›</span></button></header>
        <div className="archive-fact-track" role="list">
          {archiveItems.map((item, index) => <article role="listitem" key={item.src} className={`archive-fact-card card-tone-${index % 3}`}>
            <img src={item.src} alt="" />
            <div><p>{item.collection}</p><h3>{item.title}</h3></div>
            <button onClick={() => setSelected(item)} aria-label={`Open ${item.title}`}><span aria-hidden="true">+</span></button>
          </article>)}
        </div>
      </section>

      <section className="archive-evidence-rebuild" id="archive-evidence">
        <div className="archive-evidence-copy"><p className="eyebrow">BEYOND THE PHOTOGRAPH</p><h2>Built for<br /><em>memory and research.</em></h2><p>Every collection is a starting point: an invitation to read the record closely, compare sources and return to the people and places behind each image.</p></div>
        <div className="archive-evidence-portrait"><img src="/portraits/military-officer-background-removed.webp" alt="" aria-hidden="true" /></div>
        <div className="archive-evidence-list">{evidenceTypes.map((item, index) => <article key={item.title}><span>{String(index + 1).padStart(2, '0')}</span><h3>{item.title}</h3><p>{item.body}</p><button type="button" className="archive-evidence-arrow" aria-label={`Open ${item.title}`}><span aria-hidden="true">→</span></button></article>)}</div>
      </section>
    </main>
    {selected && <div className="archive-lightbox" role="dialog" aria-modal="true" aria-label="Archive image viewer" onClick={() => setSelected(null)}><button onClick={() => setSelected(null)} aria-label="Close viewer">×</button><figure onClick={event => event.stopPropagation()}><img src={selected.src} alt={selected.title} /><figcaption><b>{selected.title}</b><span>{selected.meta}</span></figcaption></figure></div>}
  </>
}

export function MemorialPage({ page, onNavigate }) { if (page === 'journey') return <JourneyPage onNavigate={onNavigate} />; if (page === 'archive') return <ArchivePage onNavigate={onNavigate} />; return <LegacyPage onNavigate={onNavigate} /> }
