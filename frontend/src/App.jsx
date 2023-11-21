import React from 'react'
import {   createBrowserRouter, RouterProvider } from 'react-router-dom'
import Root from './routes/Root'
import Home from './routes/Home'
import Protected from './components/Protected'

export default function App() {
  const BrowserRouter = createBrowserRouter([
    { path: '/', element: <Root /> },
    { path: '/home', element: <Protected> <Home /> </Protected>}
  ])

  return (
    <RouterProvider router={BrowserRouter}/>
  )
}