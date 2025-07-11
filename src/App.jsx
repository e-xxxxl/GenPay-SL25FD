import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LandingPage from './Components/Pages/LandingPage'

import { Route, Routes } from 'react-router-dom'
import SignUpPage from './Components/Pages/SignUpPage'

function App() {
  

  return (
    <>
   
     <Routes>
      <Route path='/' element={<LandingPage/>} />
      <Route path='/signup' element={<SignUpPage/>} />
     </Routes>
    </>
  )
}

export default App
