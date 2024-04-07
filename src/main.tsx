import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import Report from './Report.tsx'
import './index.css'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/report",
    element: <Report />,
  }
], {basename: "/unipv-aule"});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
