import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import AppProviders from './app/providers'
import Router from './app/router'
import ScrollToTop from './components/layout/ScrollToTop'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProviders>
        <ScrollToTop />
        <Router />
      </AppProviders>
    </BrowserRouter>
  </React.StrictMode>
)
