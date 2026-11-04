
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { BrowserRouter } from 'react-router-dom'

import './index.scss'
import App from './App.tsx'
import { applyThemeCssVariables, createPuntosTheme } from './theme/puntosTheme'

const mode = "light";

applyThemeCssVariables(mode)

const theme = createPuntosTheme(mode)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
