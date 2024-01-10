import './App.css'
import { RouterProvider } from 'react-router-dom'
import router from './router'
import { useEffect } from 'react'
import axios from 'axios'

function App() {
  useEffect(() => {
    const controller = new AbortController()
    axios
    .get(
      '/users/me', // URL xác thực email bên API Server của các bạn
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        },
        baseURL: import.meta.env.VITE_API_URL,
        signal: controller.signal
      }
    )
    .then((res) => {
      console.log("res client", res)
      localStorage.setItem('profile', JSON.stringify(res.data.result))
    })
   return () => {
    controller.abort()
   }

  },[])
  return <RouterProvider router={router} />
}

export default App
