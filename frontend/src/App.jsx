import React from 'react'
import {   createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './routes/Login'
import Root from './routes/Root'
import Home from './routes/Home'

export default function App() {
  const BrowserRouter = createBrowserRouter([
    { path: '/', element: <Root /> },
    { path: '/login', element: <Login /> },
    { path: '/home', element: <Home />}
  ])

  return (
    <RouterProvider router={BrowserRouter}/>
  )
}