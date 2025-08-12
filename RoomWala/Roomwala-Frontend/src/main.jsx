import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
// import Header from './components/Header.jsx'
// import Footer from './components/Footer.jsx'
import './index.css'
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <Header /> */}
    <Toaster
  position="top-center"
  reverseOrder={false}
/>    
    <App />
    {/* <Footer /> */}
  </StrictMode>,
)
