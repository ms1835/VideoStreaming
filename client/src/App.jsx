import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Home from './components/Home'
import Footer from './components/Footer'
import Toast from './components/Message'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Dashboard from './components/Dashboard';
import UploadVideo from './components/UploadVideo';
import Video from './components/Video';

function App() {
  const [paginationData, setPaginationData] = useState({
    page: 1,
    totalPages: 1,
    onPageChange: null
  });

  return (
    <Router>
      <div id="container">
        <div className="fixed top-4 right-4 z-50">
          <Toast />
        </div>
        <div className='navbar-container'>
          <Navbar />
        </div>
        <div className='main-content-wrapper bg-slate-900'>
          <Sidebar />
          <div className='main-content'>
            <Routes>
              <Route path='/' element={<Home setPaginationData={setPaginationData} />} />
              <Route path='/auth/login' element={<SignIn />} />
              <Route path='/auth/signup' element={<SignUp />} />
              <Route path='/user' element={<Dashboard />} />
              <Route path='/user/:userID' element={<Dashboard />} />
              <Route path='/video/upload' element={<UploadVideo />} />
              <Route path='/video/:id' element={<Video />} />
            </Routes>
          </div>
        </div>
        <Footer paginationData={paginationData} />
      </div>
    </Router>
  )
}

export default App
