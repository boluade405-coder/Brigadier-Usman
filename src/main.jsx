import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles.css'
import './hero-transition.css'
import './motion.css'
import './navigation.css'
import './pages.css'
import './palette.css'
import './hero-crop.css'
import './welcome-card.css'
import './journey-rebuild.css'
import './journey-carousel.css'
import './journey-story-detail.css'
import './archive-rebuild.css'

createRoot(document.getElementById('root')).render(
  <StrictMode><App /></StrictMode>,
)
