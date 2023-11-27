import React from 'react'
import { createBrowserRouter, RouterProvider} from 'react-router-dom'
import Root from './routes/Root'
import Home from './routes/Home'
import Protected from './components/Protected'
import Organizations from './routes/Organizations'
import NewOrganization from './routes/NewOrganization'
import Profile from './routes/Profile'
import Organization from './routes/Organization'
import AddUsers from './routes/AddUsers'

export default function App() {
  const BrowserRouter = createBrowserRouter([
    { path: '/', element: <Root /> },
    { path: '/home', element: <Protected> <Home /> </Protected>},
    { path: '/organizations', element: <Protected> <Organizations /> </Protected>},
    { path: '/organization/create', element: <Protected> <NewOrganization /> </Protected>},
    { path: '/profile', element: <Protected> <Profile /> </Protected>},
    { path: '/organization', element: <Protected> <Organization /> </Protected>},
    { path: '/users/add', element: <Protected> <AddUsers /> </Protected>},
  ])

  return (
    <RouterProvider router={BrowserRouter}/>
  )
}