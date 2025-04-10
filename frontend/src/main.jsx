import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RoutesProvider } from './routerProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RoutesProvider/>
  </StrictMode>,
)
