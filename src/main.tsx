import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import App from './App.tsx'
import { createHashRouter, RouterProvider  } from 'react-router-dom'
import StartPage from './pages/StartPage.tsx'
import Start from './pages/Start.tsx'
const router = createHashRouter([
  {
    path: "/",
    element: <Start />
  },
  {
    path: "/start",
    element: <StartPage />
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
