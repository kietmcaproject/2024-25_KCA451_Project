import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter } from 'react-router-dom'
import VerifyEmailPage from './components/VerifyEmailPage.jsx'
import Dashboard from './components/Dashboard.jsx'
import { RouterProvider } from 'react-router'
import Home from './components/Home.jsx'
import Navbar from './components/Navbar.jsx'
import About from './components/About.jsx'
import Contact from './components/Contact.jsx'
import UserProfile from './components/UserProfile.jsx'
import CommunityForm from './components/community/CommunityForm.jsx'
import CommunityPage from './components/community/CommunityPage.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
 
  {
    path: 'VerifyEmailPage',
    element:<VerifyEmailPage/>
    
  },
  {
    path:"Navbar",
    element:<Navbar/>,
    children:[
      {
        path: '',
        element: <Dashboard />
      },
      {
        path: 'Home',
        element: <Dashboard />
      },
      {
        path: 'About',
        element: <About/>
      },
      {
        path: 'Contact',
        element: <Contact/>
      },
      {
        path: 'UserProfile',
        element: <UserProfile/>
      },
      {
        path:'CommunityForm',
        element:<CommunityForm/>
      }
    ],

    
  },
 
  {
    path: 'Community/:name',
    element: <CommunityPage />
  }

])

createRoot(document.getElementById('root')).render(
 <RouterProvider router={router}></RouterProvider>
)
