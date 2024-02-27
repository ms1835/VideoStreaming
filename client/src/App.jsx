import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Home from './components/Home'

function App() {

  return (
    <div id="container">
      <Navbar />
      <div className='flex flex-1'>
        <Sidebar />
        <Home />
      </div>
    </div>
  )
}

export default App
