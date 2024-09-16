
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LoginPage from './web_pages/LoginPage'
import ClientHomePage from './web_pages/ClientHomePage'
import RegisterPage from './web_pages/RegisterPage'
import DriverHomePage from './web_pages/DriverHomePage'
import NavBar from './components/NavBar'
import ClientAuth from './web_pages/auth/ClientAuth'
import DriverAuth from './web_pages/auth/DriverAuth'
import TestPage from './web_pages/TestPage'

function App() {

  return (
    <div className='App'>
        <BrowserRouter>
        <NavBar/>
          <Routes>
            <Route path='/' element ={<LoginPage/>}/>
            <Route path='/register' element ={<RegisterPage/>}/>
            <Route path="/c-home" element={<ClientAuth> <ClientHomePage /> </ClientAuth> }/>
            <Route path='/d-home' element ={<DriverAuth> <DriverHomePage/> </DriverAuth>}/>
            <Route path='/t-page' element ={<TestPage/>}/>
          </Routes>
        </BrowserRouter>
    </div>
  )
}

export default App
