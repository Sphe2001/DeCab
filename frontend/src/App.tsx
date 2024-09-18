
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LoginPage from './web_pages/LoginPage'
import ClientHomePage from './web_pages/clientpages/ClientHomePage'
import RegisterPage from './web_pages/RegisterPage'
import DriverHomePage from './web_pages/driverpages/DriverHomePage'
import NavBar from './components/NavBar'
import ClientAuth from './web_pages/auth/ClientAuth'
import DriverAuth from './web_pages/auth/DriverAuth'
import TestPage from './web_pages/TestPage'
import ClientManageAccountPage from './web_pages/clientpages/ClientManageAccountPage'
import MyRidesPage from './web_pages/clientpages/MyRidesPage'
import DriverManageAccountPage from './web_pages/driverpages/DriverManageAccountPage'
import HistoryPage from './web_pages/driverpages/HistoryPage'
import PaymentHistoryPage from './web_pages/driverpages/PaymentHistoryPage'
import HomePage from './web_pages/HomePage'

function App() {

  return (
    <div className='App'>
        <BrowserRouter>
          <Routes>
            <Route path='/' element ={<LoginPage/>}/>
            <Route path='/home' element ={<HomePage/>}/>
            <Route path='/register' element ={<RegisterPage/>}/>
            <Route path="/c-home" element={<ClientAuth> <ClientHomePage /> </ClientAuth> }/>
            <Route path='/d-home' element ={<DriverAuth> <DriverHomePage/> </DriverAuth>}/>
            <Route path='/t-page' element ={<TestPage/>}/>
            <Route path='/c-manage/account' element = {<ClientAuth> <ClientManageAccountPage/> </ClientAuth>}/>
            <Route path='/c-myrides' element = {<ClientAuth> <MyRidesPage/> </ClientAuth>}/>
            <Route path='/d-manage/account' element = {<DriverAuth> <DriverManageAccountPage/> </DriverAuth>}/>
            <Route path='/d-history' element = {<DriverAuth> <HistoryPage/> </DriverAuth>}/>
            <Route path='/d-payments' element = {<DriverAuth> <PaymentHistoryPage/> </DriverAuth>}/>
          </Routes>
        </BrowserRouter>
    </div>
  )
}

export default App
