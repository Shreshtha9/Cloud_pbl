import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// With this approach, we don't need to import CSS files
// All styling is done with Tailwind classes directly in components

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)