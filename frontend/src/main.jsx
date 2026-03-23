import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { AtualizacaoProvider } from './contexts/AtualizacaoContext'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AtualizacaoProvider>
          <App />
        </AtualizacaoProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
