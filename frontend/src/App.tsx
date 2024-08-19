import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LoginPage from './web_pages/LoginPage'
import HomePage from './web_pages/HomePage'
import RegisterPage from './web_pages/RegisterPage'

function App() {

  return (
    <div className='App'>
        <BrowserRouter>
          <Routes>
            <Route path='/' element ={<LoginPage/>}/>
            <Route path='/home' element ={<HomePage/>}/>
            <Route path='/register' element ={<RegisterPage/>}/>
          </Routes>
          </BrowserRouter>
    </div>
  )
}

export default App
