import React from 'react'
import {   createBrowserRouter, RouterProvider } from 'react-router-dom'
import Root from './routes/Root'
import Home from './routes/Home'
import Protected from './components/Protected'
import Organizations from './routes/Organizations'
import NewOrganization from './routes/NewOrganization'
import Profile from './routes/Profile'

export default function App() {
  const BrowserRouter = createBrowserRouter([
    { path: '/', element: <Root /> },
    { path: '/home', element: <Protected> <Home /> </Protected>},
    { path: '/organizations', element: <Protected> <Organizations /> </Protected>},
    { path: '/neworganization', element: <Protected> <NewOrganization /> </Protected>},
    { path: '/profile', element: <Protected> <Profile /> </Protected>},
  ])

  return (
    <RouterProvider router={BrowserRouter}/>
  )
}