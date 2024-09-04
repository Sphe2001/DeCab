
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LoginPage from './web_pages/LoginPage'
import ClientHomePage from './web_pages/ClientHomePage'
import RegisterPage from './web_pages/RegisterPage'
import DriverHomePage from './web_pages/DriverHomePage'
import NavBar from './components/NavBar'

function App() {

  return (
    <div className='App'>
        <BrowserRouter>
        <NavBar/>
          <Routes>
            <Route path='/' element ={<LoginPage/>}/>
            <Route path='/c-home' element ={<ClientHomePage/>}/>
            <Route path='/d-home' element ={<DriverHomePage/>}/>
            <Route path='/register' element ={<RegisterPage/>}/>
          </Routes>
        </BrowserRouter>
    </div>
  )
}

export default App
