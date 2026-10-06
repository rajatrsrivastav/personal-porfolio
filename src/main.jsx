import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import DogpoolPet from './components/DogpoolPet.tsx'
import "./App.css"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    {window.location.pathname.replace(/\/+$/, '') !== '/admin' && <DogpoolPet />}
  </StrictMode>,
)
