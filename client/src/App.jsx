import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Home from './components/Home'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Dashboard from './components/Dashboard';

function App() {

  return (
    <Router>
    <div id="container">
      <Navbar />
      <div className='flex flex-1 content-center'>
        <Sidebar />
        <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/auth/login' element={<SignIn />} />
        <Route path='/auth/signup' element={<SignUp />} />
        <Route path='/user' element={<Dashboard />} />
      
      </Routes>
      </div>
    </div>
    </Router>
  )
}

export default App
