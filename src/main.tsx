import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
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
import './photos-app.css'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element #root was not found')
}

createRoot(rootElement).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/journey" element={<App />} />
          <Route path="/archive" element={<App />} />
          <Route path="/archive/records" element={<App />} />
          <Route path="/legacy" element={<App />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </MotionConfig>
  </StrictMode>,
)