import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AppProvider } from './context/AppContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import { ReactionProvider } from './context/ReactionContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <AppProvider>
    <ToastProvider>
      <ReactionProvider>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </ReactionProvider>
    </ToastProvider>
  </AppProvider>
)
