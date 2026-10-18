import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

// Older installed iOS web apps may expose only Apple's standalone flag.
if ((navigator as Navigator & { standalone?: boolean }).standalone === true) {
  document.documentElement.dataset.iosStandalone = 'true'
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
