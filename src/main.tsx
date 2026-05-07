import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import { AppProvider } from './context/AppContext.tsx'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <AppProvider>
        <App />
      </AppProvider>
    </AuthProvider>
  </React.StrictMode>,
)
