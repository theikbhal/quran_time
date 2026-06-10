import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Register Service Worker for offline capabilities (PWA)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => {
        console.log('Quran Time: Service Worker registered successfully!', reg.scope);
      })
      .catch(err => {
        console.error('Quran Time: Service Worker registration failed!', err);
      });
  });
}

// Detect Chrome Extension context and apply styling class
const isExtension = typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id;
if (isExtension) {
  document.documentElement.classList.add('is-extension');
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
