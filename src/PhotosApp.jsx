import { useEffect, useRef, useState } from 'react'
import { Album, ArrowLeft, ArrowUpRight, Check, ChevronLeft, ChevronRight, Download, Heart, Images, Info, MapPin, Plus, Search, Share2, Sparkles, Users, X, ZoomIn, ZoomOut } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { fadeIn, fadeUp, modalReveal, pageTransition, stagger } from './lib/motion'
import { photoCatalog } from './lib/photo-catalog.mjs'

const navigation = [
  { id: 'photos', label: 'Photos', icon: Images },
  { id: 'favorites', label: 'Favorites', icon: Heart },
  { id: 'albums', label: 'Albums', icon: Album },
  { id: 'places', label: 'Places', icon: MapPin },
]

const photoDates = [
  [2025, 10, 5], [2025, 9, 18], [2025, 9, 12], [2025, 8, 30], [2025, 8, 14], [2025, 7, 22],
  [2024, 12, 20], [2024, 12, 4], [2024, 7, 16], [2024, 7, 3], [2024, 3, 28], [2024, 3, 10],
  [2023, 11, 9], [2023, 11, 2], [2023, 6, 25], [2023, 6, 11], [2023, 2, 19], [2023, 2, 7],
]

const photos = photoDates.map(([year, month, day], index) => ({
  id: photoCatalog[index].id,
  assets: {
    tiny: `/archive/optimized/${photoCatalog[index].id}/tiny.webp`,
    thumbnail: `/archive/optimized/${photoCatalog[index].id}/thumbnail.webp`,
    medium: `/archive/optimized/${photoCatalog[index].id}/medium.webp`,
    large: `/archive/optimized/${photoCatalog[index].id}/large.webp`,
    original: `/archive/${photoCatalog[index].original}`,
  },
  title: ['A day in the archive', 'Among friends', 'A quiet afternoon', 'At the gathering', 'A familiar place', 'In good company'][index % 6],
  date: new Date(year, month - 1, day).toLocaleDateString('en', { month: 'long', day: 'numeric', year: 'numeric' }),
  year,
  month,
  monthName: new Date(year, month - 1, day).toLocaleDateString('en', { month: 'long' }),
  day,
  tone: index % 6,
  group: ['Military life', 'Public service', 'Family & friends', 'Places remembered'][index % 4],
}))

const initialAlbums = [
  { id: 'album-1', title: 'Military life', count: 24, tone: 0 },
  { id: 'album-2', title: 'Public service', count: 18, tone: 2 },
  { id: 'album-3', title: 'Family & friends', count: 12, tone: 4 },
  { id: 'album-4', title: 'Places remembered', count: 9, tone: 1 },
]

const people = [
  { name: 'Musa Usman', detail: 'Person · 24 moments', tone: 1 },
  { name: 'Family & friends', detail: 'Group · 12 moments', tone: 3 },
  { name: 'Military colleagues', detail: 'Group · 18 moments', tone: 5 },
]

const places = [
  { name: 'Kaduna', detail: 'Place · 16 moments', tone: 2 },
  { name: 'Maiduguri', detail: 'Place · 11 moments', tone: 4 },
  { name: 'Lagos', detail: 'Place · 8 moments', tone: 0 },
]

const viewCopy = {
  library: ['Library', 'All your moments, in one place.'],
  favorites: ['Favorites', 'The moments you want to return to.'],
  albums: ['Albums', 'Collections, gathered by story.'],
  'for-you': ['For You', 'A few moments worth revisiting.'],
  people: ['People', 'The people who make these moments.'],
  places: ['Places', 'Moments connected to a place.'],
  photos: ['Photos', 'Browse every photo in your collection.'],
}

function PhotoCard({ photo, index, isFavorite, isSelected, onToggleFavorite, onToggleSelection, onOpen }) {
  const cardRef = useRef(null)
  const [isNearViewport, setIsNearViewport] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageFailed, setImageFailed] = useState(false)

  useEffect(() => {
    const card = cardRef.current
    if (!card) return undefined
    if (!('IntersectionObserver' in window)) {
      setIsNearViewport(true)
      return undefined
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsNearViewport(true)
        observer.disconnect()
      }
    }, { rootMargin: '180px' })
    observer.observe(card)
    return () => observer.disconnect()
  }, [])

  return <motion.article className={`photos-grid-item ${isSelected ? 'is-selected' : ''}`} ref={cardRef} layout variants={fadeUp}>
    <div className={`photos-placeholder photos-tone-${photo.tone} ${imageLoaded ? 'is-loaded' : 'is-loading'}`} style={{ '--photos-tiny-image': `url("${photo.assets.tiny}")` }}>
      {isNearViewport && !imageFailed && <motion.img layoutId={`photo-${photo.id}`} className={`photos-thumbnail ${imageLoaded ? 'is-loaded' : ''}`} src={photo.assets.thumbnail} alt="" loading="lazy" decoding="async" onLoad={() => setImageLoaded(true)} onError={() => setImageFailed(true)} />}
      {isNearViewport ? <button className="photos-placeholder-open" onClick={() => onOpen(photo)} aria-label={`Open ${photo.title}`}>
        {imageFailed && <span className="photos-placeholder-shape" aria-hidden="true" />}
        <span className="photos-placeholder-index">{String(index + 1).padStart(2, '0')}</span>
      </button> : <span className="photos-placeholder-skeleton" aria-hidden="true" />}
      <button className={`photos-select ${isSelected ? 'is-selected' : ''}`} onClick={() => onToggleSelection(photo.id)} aria-label={isSelected ? `Deselect ${photo.title}` : `Select ${photo.title}`} aria-pressed={isSelected}><Check size={14} aria-hidden="true" /></button>
      <button className={`photos-favorite ${isFavorite ? 'is-favorite' : ''}`} onClick={() => onToggleFavorite(photo.id)} aria-label={isFavorite ? `Remove ${photo.title} from favorites` : `Add ${photo.title} to favorites`} aria-pressed={isFavorite}><Heart size={17} fill={isFavorite ? 'currentColor' : 'none'} /></button>
    </div>
    <div className="photos-item-caption"><div><h3>{photo.title}</h3><p>{photo.date} <span>·</span> {photo.group}</p></div><button onClick={() => onOpen(photo)} aria-label={`View ${photo.title}`}><ArrowUpRight size={16} /></button></div>
  </motion.article>
}

export default function PhotosApp({ onNavigate }) {
  const [activeView, setActiveView] = useState('photos')
  const [query, setQuery] = useState('')
  const [favorites, setFavorites] = useState(['photo-02', 'photo-06', 'photo-11'])
  const [albums, setAlbums] = useState(initialAlbums)
  const [activeAlbum, setActiveAlbum] = useState(null)
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [viewerInfoOpen, setViewerInfoOpen] = useState(false)
  const [viewerZoom, setViewerZoom] = useState(1)
  const [viewerPosition, setViewerPosition] = useState({ x: 0, y: 0 })
  const [viewerImageDimensions, setViewerImageDimensions] = useState(null)
  const [shareStatus, setShareStatus] = useState('')
  const [selectedPhotoIds, setSelectedPhotoIds] = useState([])
  const [libraryDate, setLibraryDate] = useState({ year: null, month: null, day: null })
  const searchInputRef = useRef(null)
  const viewerImageRef = useRef(null)
  const viewerViewportRef = useRef(null)
  const pointerMapRef = useRef(new Map())
  const gestureRef = useRef({ startDistance: 0, startZoom: 1, startPosition: { x: 0, y: 0 }, startPoint: { x: 0, y: 0 }, panning: false })
  const normalizedQuery = query.trim().toLowerCase()
  const currentViewCopy = viewCopy[activeView]
  const visiblePhotos = photos.filter(photo => {
    const matchesSearch = activeView !== 'photos' || !normalizedQuery || `${photo.title} ${photo.date} ${photo.group}`.toLowerCase().includes(normalizedQuery)
    const matchesFavorites = activeView !== 'favorites' || favorites.includes(photo.id)
    const matchesAlbum = !activeAlbum || photo.group === activeAlbum.title
    return matchesSearch && matchesFavorites && matchesAlbum
  })

  const selectView = viewId => {
    setActiveView(viewId)
    setActiveAlbum(null)
    setLibraryDate({ year: null, month: null, day: null })
    setSelectedPhotoIds([])
  }

  const toggleFavorite = photoId => {
    setFavorites(current => current.includes(photoId) ? current.filter(id => id !== photoId) : [...current, photoId])
  }

  const toggleSelection = photoId => {
    setSelectedPhotoIds(current => current.includes(photoId) ? current.filter(id => id !== photoId) : [...current, photoId])
  }

  const toggleSelectedFavorites = () => {
    const allSelectedAreFavorites = selectedPhotoIds.every(id => favorites.includes(id))
    setFavorites(current => allSelectedAreFavorites
      ? current.filter(id => !selectedPhotoIds.includes(id))
      : [...new Set([...current, ...selectedPhotoIds])])
  }

  const openViewer = photo => {
    setViewerZoom(1)
    setViewerPosition({ x: 0, y: 0 })
    setViewerImageDimensions(null)
    setViewerInfoOpen(false)
    setShareStatus('')
    setSelectedPhoto(photo)
  }

  const closeViewer = () => {
    setSelectedPhoto(null)
    setViewerZoom(1)
    setViewerPosition({ x: 0, y: 0 })
    setViewerInfoOpen(false)
  }

  const setZoom = nextZoom => {
    setViewerZoom(Math.max(1, Math.min(4, nextZoom)))
    if (nextZoom <= 1) setViewerPosition({ x: 0, y: 0 })
  }

  const navigateViewer = direction => {
    if (!selectedPhoto) return
    const currentIndex = photos.findIndex(photo => photo.id === selectedPhoto.id)
    const nextIndex = (currentIndex + direction + photos.length) % photos.length
    openViewer(photos[nextIndex])
  }

  const sharePhoto = async () => {
    if (!selectedPhoto) return
    const shareData = { title: selectedPhoto.title, text: `${selectedPhoto.title} · ${selectedPhoto.date}`, url: new URL(selectedPhoto.assets.original, window.location.origin).href }
    try {
      if (navigator.share) await navigator.share(shareData)
      else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareData.url)
        setShareStatus('Link copied')
      } else {
        setShareStatus('Sharing is unavailable in this browser')
      }
    } catch (error) {
      if (error?.name !== 'AbortError') setShareStatus('Could not share this photo')
    }
  }

  useEffect(() => {
    if (!selectedPhoto) return undefined
    const handleKeyDown = event => {
      if (event.target instanceof HTMLElement && ['INPUT', 'TEXTAREA'].includes(event.target.tagName)) return
      if (event.key === 'Escape') closeViewer()
      else if (event.key === 'ArrowLeft') navigateViewer(-1)
      else if (event.key === 'ArrowRight') navigateViewer(1)
      else if (event.key === '+' || event.key === '=') setZoom(viewerZoom + .5)
      else if (event.key === '-') setZoom(viewerZoom - .5)
      else if (event.key.toLowerCase() === 'i') setViewerInfoOpen(value => !value)
      else if (event.key.toLowerCase() === 'f') toggleFavorite(selectedPhoto.id)
    }
    window.addEventListener('keydown', handleKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [selectedPhoto, viewerZoom])

  const handleViewerPointerDown = event => {
    event.currentTarget.setPointerCapture(event.pointerId)
    pointerMapRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY })
    const pointers = [...pointerMapRef.current.values()]
    if (pointers.length === 2) {
      const [first, second] = pointers
      gestureRef.current.startDistance = Math.hypot(second.x - first.x, second.y - first.y)
      gestureRef.current.startZoom = viewerZoom
      gestureRef.current.startPosition = viewerPosition
      gestureRef.current.panning = false
    } else if (pointers.length === 1 && viewerZoom > 1) {
      gestureRef.current.startPoint = { x: event.clientX, y: event.clientY }
      gestureRef.current.startPosition = viewerPosition
      gestureRef.current.panning = true
    }
  }

  const handleViewerPointerMove = event => {
    if (!pointerMapRef.current.has(event.pointerId)) return
    pointerMapRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY })
    const pointers = [...pointerMapRef.current.values()]
    if (pointers.length === 2 && gestureRef.current.startDistance > 0) {
      const [first, second] = pointers
      const distance = Math.hypot(second.x - first.x, second.y - first.y)
      setZoom(gestureRef.current.startZoom * distance / gestureRef.current.startDistance)
    } else if (pointers.length === 1 && gestureRef.current.panning) {
      setViewerPosition({
        x: gestureRef.current.startPosition.x + event.clientX - gestureRef.current.startPoint.x,
        y: gestureRef.current.startPosition.y + event.clientY - gestureRef.current.startPoint.y,
      })
    }
  }

  const handleViewerPointerUp = event => {
    pointerMapRef.current.delete(event.pointerId)
    if (pointerMapRef.current.size < 2) gestureRef.current.startDistance = 0
    if (pointerMapRef.current.size === 0) gestureRef.current.panning = false
  }

  const handleViewerWheel = event => {
    event.preventDefault()
    setZoom(viewerZoom + (event.deltaY < 0 ? .2 : -.2))
  }

  useEffect(() => {
    const viewport = viewerViewportRef.current
    if (!selectedPhoto || !viewport) return undefined
    viewport.addEventListener('wheel', handleViewerWheel, { passive: false })
    return () => viewport.removeEventListener('wheel', handleViewerWheel)
  }, [selectedPhoto, viewerZoom])

  const libraryPhotos = photos.filter(photo =>
    (libraryDate.year === null || photo.year === libraryDate.year)
    && (libraryDate.month === null || photo.month === libraryDate.month)
    && (libraryDate.day === null || photo.day === libraryDate.day),
  )
  const libraryYears = [...new Set(photos.map(photo => photo.year))].sort((left, right) => right - left)
  const libraryMonths = [...new Set(libraryPhotos.map(photo => photo.month))].sort((left, right) => right - left)
  const libraryDays = [...new Set(libraryPhotos.map(photo => photo.day))].sort((left, right) => right - left)
  const libraryTitle = libraryDate.day !== null
    ? `${new Date(libraryDate.year, libraryDate.month - 1, libraryDate.day).toLocaleDateString('en', { month: 'long' })} ${libraryDate.day}`
    : libraryDate.month !== null
      ? new Date(libraryDate.year, libraryDate.month - 1).toLocaleDateString('en', { month: 'long', year: 'numeric' })
      : libraryDate.year ?? 'Years'

  const createAlbum = () => {
    setAlbums(current => [...current, { id: `album-${Date.now()}`, title: `Untitled album ${current.length - initialAlbums.length + 1}`, count: 0, tone: current.length % 6 }])
  }

  const renderPhotoGrid = items => <motion.div className="photos-grid" variants={stagger} initial="hidden" animate="visible">
    {items.map((photo, index) => <PhotoCard key={photo.id} photo={photo} index={index} isFavorite={favorites.includes(photo.id)} isSelected={selectedPhotoIds.includes(photo.id)} onToggleFavorite={toggleFavorite} onToggleSelection={toggleSelection} onOpen={openViewer} />)}
  </motion.div>

  const renderDateGroups = groups => <motion.div className="photos-date-grid" variants={stagger} initial="hidden" animate="visible">
    {groups.map((group, index) => <motion.button className="photos-date-card" key={group.id} layout variants={fadeUp} onClick={group.onSelect}>
      <span className={`photos-date-art photos-tone-${group.tone}`}><span className="photos-date-art-shape" /><small>{String(index + 1).padStart(2, '0')}</small></span>
      <span className="photos-date-caption"><b>{group.title}</b><small>{group.detail}</small></span>
      <ArrowUpRight className="photos-date-arrow" size={16} aria-hidden="true" />
    </motion.button>)}
  </motion.div>

  const yearGroups = libraryYears.map(year => {
    const yearPhotos = photos.filter(photo => photo.year === year)
    const monthCount = new Set(yearPhotos.map(photo => photo.month)).size
    return { id: `year-${year}`, title: String(year), detail: `${monthCount} ${monthCount === 1 ? 'month' : 'months'} · ${yearPhotos.length} photos`, tone: yearPhotos[0].tone, onSelect: () => setLibraryDate({ year, month: null, day: null }) }
  })
  const monthGroups = libraryMonths.map(month => {
    const monthPhotos = libraryPhotos.filter(photo => photo.month === month)
    const dayCount = new Set(monthPhotos.map(photo => photo.day)).size
    return { id: `month-${month}`, title: new Date(libraryDate.year, month - 1).toLocaleDateString('en', { month: 'long' }), detail: `${dayCount} ${dayCount === 1 ? 'day' : 'days'} · ${monthPhotos.length} photos`, tone: monthPhotos[0].tone, onSelect: () => setLibraryDate(current => ({ ...current, month, day: null })) }
  })
  const dayGroups = libraryDays.map(day => {
    const dayPhotos = libraryPhotos.filter(photo => photo.day === day)
    const date = new Date(libraryDate.year, libraryDate.month - 1, day)
    return { id: `day-${day}`, title: date.toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' }), detail: `${dayPhotos.length} ${dayPhotos.length === 1 ? 'photo' : 'photos'}`, tone: dayPhotos[0].tone, onSelect: () => setLibraryDate(current => ({ ...current, day })) }
  })

  const toggleGroupSelection = () => {
    const visibleIds = libraryPhotos.map(photo => photo.id)
    const allVisibleSelected = visibleIds.length > 0 && visibleIds.every(id => selectedPhotoIds.includes(id))
    setSelectedPhotoIds(current => allVisibleSelected ? current.filter(id => !visibleIds.includes(id)) : [...new Set([...current, ...visibleIds])])
  }

  return <motion.div className="photos-app-shell" variants={pageTransition} initial="hidden" animate="visible">
    <aside className="photos-sidebar">
      <button className="photos-brand" onClick={() => onNavigate('archive')} aria-label="Return to memorial archive"><span className="photos-brand-mark"><Images size={18} /></span><span><b>Musa Archive</b><small>PHOTO LIBRARY</small></span></button>
      <button className="photos-new-album" onClick={() => { selectView('albums'); createAlbum() }}><Plus size={17} /> New album</button>
      <nav className="photos-sidebar-nav" aria-label="Photo library">
        <p className="photos-nav-label">YOUR LIBRARY</p>
        {navigation.map(({ id, label, icon: Icon }) => <button key={id} className={activeView === id ? 'active' : ''} onClick={() => selectView(id)} aria-current={activeView === id ? 'page' : undefined}><Icon size={18} strokeWidth={activeView === id ? 2.2 : 1.8} /><span>{label}</span>{id === 'favorites' && <small>{favorites.length}</small>}</button>)}
      </nav>
      <div className="photos-sidebar-bottom"><span className="photos-sidebar-avatar">MU</span><span><b>Memorial archive</b><small>Local collection</small></span></div>
    </aside>

    <div className="photos-workspace">
      <header className="photos-topbar">
        <div className="photos-topbar-title"><span>LIBRARY</span><b>/</b><strong>{activeView === 'library' ? libraryTitle : activeAlbum?.title || currentViewCopy[0]}</strong></div>
        <label className="photos-search"><Search size={17} aria-hidden="true" /><span className="sr-only">Search photos</span><input ref={searchInputRef} type="search" value={query} onFocus={() => activeView !== 'photos' && selectView('photos')} onChange={event => setQuery(event.target.value)} placeholder="Search your photos" /></label>
        <button className="photos-back-button" onClick={() => onNavigate('archive')}><ArrowLeft size={16} /><span>Memorial</span></button>
      </header>

      <main className="photos-main">
        <motion.section className="photos-view" key={`${activeView}-${activeAlbum?.id || ''}`} initial="hidden" animate="visible" variants={fadeUp}>
          {activeAlbum && <button className="photos-album-back" onClick={() => setActiveAlbum(null)}><ArrowLeft size={15} /> All albums</button>}
          <div className="photos-view-heading"><div><p className="photos-eyebrow">MUSA USMAN · PERSONAL ARCHIVE</p><h1>{activeView === 'library' ? libraryTitle : activeAlbum?.title || currentViewCopy[0]}</h1><p>{activeView === 'library' ? libraryDate.day !== null ? `${libraryPhotos.length} ${libraryPhotos.length === 1 ? 'photo' : 'photos'} from this day.` : libraryDate.month !== null ? 'Choose a day to see its photos.' : libraryDate.year !== null ? 'Choose a month to continue.' : 'Browse your collection by date.' : activeAlbum ? `${activeAlbum.count} moments in this album.` : currentViewCopy[1]}</p></div>
            {activeView === 'albums' && !activeAlbum && <button className="photos-create-button" onClick={createAlbum}><Plus size={17} /> Create album</button>}
          </div>
          {selectedPhotoIds.length > 0 && <div className="photos-selection-toolbar"><span><b>{selectedPhotoIds.length}</b> selected</span><button onClick={toggleSelectedFavorites}>{selectedPhotoIds.every(id => favorites.includes(id)) ? 'Remove from favorites' : 'Add to favorites'}</button><button onClick={() => setSelectedPhotoIds([])}>Clear selection</button></div>}

          {activeView === 'library' ? <>
            <nav className="photos-library-crumbs" aria-label="Date navigation">
              <button className={libraryDate.year === null ? 'active' : ''} onClick={() => setLibraryDate({ year: null, month: null, day: null })}>Years</button>
              {libraryDate.year !== null && <><span>/</span><button className={libraryDate.month === null ? 'active' : ''} onClick={() => setLibraryDate(current => ({ year: current.year, month: null, day: null }))}>{libraryDate.year}</button></>}
              {libraryDate.month !== null && <><span>/</span><button className={libraryDate.day === null ? 'active' : ''} onClick={() => setLibraryDate(current => ({ ...current, day: null }))}>{new Date(libraryDate.year, libraryDate.month - 1).toLocaleDateString('en', { month: 'long' })}</button></>}
              {libraryDate.day !== null && <><span>/</span><span className="current">{libraryDate.day}</span></>}
            </nav>
            {libraryDate.day !== null ? <>
              {libraryPhotos.length > 0 && <div className="photos-date-selection"><span>{libraryPhotos.length} photos</span><button onClick={toggleGroupSelection}>{libraryPhotos.every(photo => selectedPhotoIds.includes(photo.id)) ? 'Deselect all' : 'Select all'}</button></div>}
              {renderPhotoGrid(libraryPhotos)}
            </> : libraryDate.month !== null ? <><div className="photos-section-row"><h2>Days</h2><span>{dayGroups.length} days</span></div>{renderDateGroups(dayGroups)}</>
              : libraryDate.year !== null ? <><div className="photos-section-row"><h2>Months</h2><span>{monthGroups.length} months</span></div>{renderDateGroups(monthGroups)}</>
                : <><div className="photos-section-row"><h2>Years</h2><span>{photos.length} photos</span></div>{renderDateGroups(yearGroups)}</>}
          </> : activeView === 'photos' ? <>{query && <div className="photos-section-row"><h2>Results for “{query}”</h2><span>{visiblePhotos.length} {visiblePhotos.length === 1 ? 'photo' : 'photos'}</span></div>}{visiblePhotos.length ? renderPhotoGrid(visiblePhotos) : <div className="photos-empty"><Search size={22} /><h2>No photos found</h2><p>Try a different search term.</p></div>}</>
            : activeView === 'albums' && !activeAlbum ? <div className="photos-albums-grid">{albums.map(album => {
              const matchingPhotos = photos.filter(photo => photo.group === album.title)
              const previewPhotos = (matchingPhotos.length ? matchingPhotos : photos.slice(album.tone, album.tone + 3)).slice(0, 3)
              return <button className="photos-album-card" key={album.id} onClick={() => setActiveAlbum(album)}><span className={`photos-album-art photos-tone-${album.tone}`} aria-hidden="true">{previewPhotos.map((photo, index) => <img key={photo.id} className={`photos-album-preview preview-${index + 1}`} src={photo.assets.thumbnail} alt="" loading="lazy" decoding="async" />)}</span><span className="photos-album-caption"><b>{album.title}</b><small>{album.count} items</small></span></button>
            })}</div>
            : activeView === 'people' ? <div className="photos-entity-grid">{people.map(person => <article className="photos-entity" key={person.name}><span className={`photos-entity-art photos-tone-${person.tone}`}><Users size={28} /></span><h2>{person.name}</h2><p>{person.detail}</p></article>)}</div>
              : activeView === 'places' ? <div className="photos-entity-grid">{places.map(place => <article className="photos-entity" key={place.name}><span className={`photos-entity-art photos-tone-${place.tone}`}><MapPin size={28} /></span><h2>{place.name}</h2><p>{place.detail}</p></article>)}</div>
                : activeView === 'for-you' ? <><div className="photos-featured-note"><Sparkles size={18} /><span><b>From the collection</b><small>A selection of moments from across the archive.</small></span></div>{renderPhotoGrid(visiblePhotos.slice(0, 9))}</>
                  : activeView === 'favorites' ? <><div className="photos-section-row"><h2>Saved moments</h2><span>{visiblePhotos.length} moments</span></div>{visiblePhotos.length ? renderPhotoGrid(visiblePhotos) : <div className="photos-empty"><Heart size={22} /><h2>No favorites yet</h2><p>Favorite photos to find them here.</p></div>}</> : null}
        </motion.section>
      </main>
    </div>

    <AnimatePresence>
      {selectedPhoto && <motion.div className="photos-viewer-backdrop" role="presentation" initial="hidden" animate="visible" exit="hidden" variants={fadeIn}>
        <motion.section className="photos-viewer-fullscreen" role="dialog" aria-modal="true" aria-labelledby="photos-viewer-title" variants={modalReveal}>
          <header className="viewer-toolbar">
            <div className="viewer-photo-heading"><p>{selectedPhoto.date}</p><h2 id="photos-viewer-title">{selectedPhoto.title}</h2></div>
            <div className="viewer-actions" aria-label="Photo actions">
              <button className={`viewer-icon-button ${favorites.includes(selectedPhoto.id) ? 'is-favorite' : ''}`} onClick={() => toggleFavorite(selectedPhoto.id)} aria-label={favorites.includes(selectedPhoto.id) ? 'Remove from favorites' : 'Add to favorites'} aria-pressed={favorites.includes(selectedPhoto.id)} title="Favorite (F)"><Heart size={19} fill={favorites.includes(selectedPhoto.id) ? 'currentColor' : 'none'} /></button>
              <button className="viewer-icon-button" onClick={sharePhoto} aria-label="Share photo" title="Share"><Share2 size={19} /></button>
              <a className="viewer-icon-button" href={selectedPhoto.assets.original} download={photoCatalog.find(item => item.id === selectedPhoto.id)?.original} aria-label="Download original photo" title="Download original"><Download size={19} /></a>
              <button className={`viewer-icon-button ${viewerInfoOpen ? 'active' : ''}`} onClick={() => setViewerInfoOpen(value => !value)} aria-label="Toggle photo information" aria-pressed={viewerInfoOpen} title="Info (I)"><Info size={19} /></button>
              <button className="viewer-icon-button viewer-close" onClick={closeViewer} aria-label="Close viewer" title="Close (Esc)"><X size={20} /></button>
            </div>
          </header>

          {shareStatus && <div className="viewer-share-status" role="status">{shareStatus}</div>}

          <div className="viewer-stage" onClick={event => { if (event.target === event.currentTarget) closeViewer() }}>
            <button className="viewer-nav-button viewer-previous" onClick={() => navigateViewer(-1)} aria-label="Previous photo" title="Previous (←)"><ChevronLeft size={25} /></button>
            <div ref={viewerViewportRef} className={`viewer-image-viewport ${viewerZoom > 1 ? 'is-zoomed' : ''}`} onPointerDown={handleViewerPointerDown} onPointerMove={handleViewerPointerMove} onPointerUp={handleViewerPointerUp} onPointerCancel={handleViewerPointerUp} onDoubleClick={() => setZoom(viewerZoom > 1 ? 1 : 2)}>
              <motion.img ref={viewerImageRef} layoutId={`photo-${selectedPhoto.id}`} className="photos-viewer-image" src={selectedPhoto.assets.large} alt={selectedPhoto.title} draggable="false" decoding="async" fetchPriority="high" onLoad={event => setViewerImageDimensions({ width: event.currentTarget.naturalWidth, height: event.currentTarget.naturalHeight })} animate={{ scale: viewerZoom, x: viewerPosition.x, y: viewerPosition.y }} transition={{ type: 'spring', stiffness: 240, damping: 28 }} />
            </div>
            <button className="viewer-nav-button viewer-next" onClick={() => navigateViewer(1)} aria-label="Next photo" title="Next (→)"><ChevronRight size={25} /></button>
          </div>

          <footer className="viewer-bottom-bar">
            <p>{photos.findIndex(photo => photo.id === selectedPhoto.id) + 1} <span>/</span> {photos.length}</p>
            <div className="viewer-zoom-controls" aria-label="Zoom controls"><button className="viewer-icon-button" onClick={() => setZoom(viewerZoom - .25)} disabled={viewerZoom <= 1} aria-label="Zoom out"><ZoomOut size={18} /></button><span>{Math.round(viewerZoom * 100)}%</span><button className="viewer-icon-button" onClick={() => setZoom(viewerZoom + .25)} disabled={viewerZoom >= 4} aria-label="Zoom in"><ZoomIn size={18} /></button></div>
            <span className="viewer-hint">Double-click or scroll to zoom · Drag to pan</span>
          </footer>

          <AnimatePresence>
            {viewerInfoOpen && <motion.aside className="viewer-info-panel" initial={{ x: 24, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 24, opacity: 0 }} transition={{ duration: .2 }} aria-label="Photo information">
              <div className="viewer-info-heading"><h3>Photo info</h3><button className="viewer-icon-button" onClick={() => setViewerInfoOpen(false)} aria-label="Close photo information"><X size={17} /></button></div>
              <dl><div><dt>Date</dt><dd>{selectedPhoto.date}</dd></div><div><dt>Collection</dt><dd>{selectedPhoto.group}</dd></div><div><dt>File</dt><dd>{photoCatalog.find(item => item.id === selectedPhoto.id)?.original}</dd></div><div><dt>Resolution</dt><dd>{viewerImageDimensions ? `${viewerImageDimensions.width} × ${viewerImageDimensions.height}` : 'Loading image details'}</dd></div></dl>
              <a href={selectedPhoto.assets.original} target="_blank" rel="noreferrer">Open original <ArrowUpRight size={14} /></a>
            </motion.aside>}
          </AnimatePresence>
        </motion.section>
      </motion.div>}
    </AnimatePresence>
  </motion.div>
}
