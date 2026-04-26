import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContext } from '../context/ToastContext';
import Toast from './Message';

const Navbar = () => {
  const { toggleSideBar } = useContext(AppContext);
  const navigate = useNavigate();
  const { isLoggedIn, handleSession } = useContext(AppContext);
  console.log("login: ",isLoggedIn);
  const [showPanel, setShowPanel] = useState(false);
  const { addToast } = useContext(ToastContext);

  const handlePanel = () => {
    setShowPanel(!showPanel);
  }

  const handleSignOut = (flag) => {
    // e.preventDefault();
    try{
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        handleSession(false);
        addToast({type: "success", message: "Logged out successfully"});
        if(flag)
          handlePanel();
        navigate('/auth/login');
    } catch(error){
        console.log(error);
        addToast({type: "error", message: error.message});
    }
  }

  const location = useLocation();

  let activeLink = "";
  if(location.pathname === '/')
    activeLink = "home";
  else if(location.pathname === '/auth/login')
    activeLink = "login";
  else if(location.pathname === '/auth/signup')
    activeLink = "signup";
  else if(location.pathname === '/video/upload')
    activeLink = "create";
  else if(location.pathname === '/user')
    activeLink = "dashboard";

    return (
      <>
      <div className='absolute top-3 right-3'>
        <Toast></Toast>
      </div>
      <nav class="sticky w-full bg-gray-900 border-dashed border-b-2 border-slate-800">
        <div class="max-w-screen flex flex-wrap items-center justify-between mx-auto p-3 text-white">
          <div class="flex flex-wrap items-center gap-4">
            <button onClick={toggleSideBar} data-drawer-target="default-sidebar" data-drawer-toggle="default-sidebar" aria-controls="default-sidebar" type="button" class="hidden md:inline-flex items-center p-1 ms-3 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 text-gray-400">
              <span class="sr-only">Open sidebar</span>
              <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path clip-rule="evenodd" fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
              </svg>
            </button>
            <button onClick={() => navigate('/')} class="flex items-center space-x-3 rtl:space-x-reverse hover:opacity-80 transition-opacity">
                <img src="/icon.png" class="h-8" alt="Logo" />
                <span class="self-center text-2xl font-semibold whitespace-nowrap text-white">Vines</span>
            </button>
          </div>
          <button onClick={handlePanel} data-collapse-toggle="navbar-default" data-toggle="collapse" data-target="#navbar-default" type="button" class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-400 rounded-lg md:hidden hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false">
            <span class="sr-only">Open main menu</span>
              <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
              </svg>
          </button>
          <div class="hidden w-full md:block md:w-auto text-white" id="navbar-default">
            <ul class="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-700 rounded-lg md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 bg-gray-900 md:bg-transparent">
              { !isLoggedIn ?
              <>
                <li>
                    <button onClick={() => navigate('/auth/login')} class={`${activeLink === "login" ? "text-emerald-400" : "text-white"} block py-2 px-3 rounded hover:bg-gray-800 md:hover:bg-transparent md:border-0 md:hover:text-gray-200 md:p-0 hover:text-gray-200 md:hover:bg-transparent transition-colors`}>Sign In</button>
                </li>
                <li>
                    <button onClick={() => navigate('/auth/signup')} class={`${activeLink === "signup" ? "text-emerald-400" : "text-white"} block py-2 px-3 rounded hover:bg-gray-800 md:hover:bg-transparent md:border-0 md:hover:text-gray-200 md:p-0 hover:text-gray-200 md:hover:bg-transparent transition-colors`}>Sign Up</button>
                </li>
              </> 
              :
              <>
                <li>
                    <button onClick={() => navigate('/user')} class={`${activeLink === "dashboard" ? "text-emerald-400" : "text-white"} block py-2 px-3 rounded hover:bg-gray-800 md:hover:bg-transparent md:border-0 md:hover:text-gray-200 md:p-0 hover:text-gray-200 md:hover:bg-transparent transition-colors`}>Dashboard</button>
                </li>
                <li>
                    <button onClick={handleSignOut} class={`${activeLink === "logout" ? "text-emerald-400" : "text-white"} block py-2 px-3 rounded hover:bg-gray-800 md:hover:bg-transparent md:border-0 md:hover:text-gray-200 md:p-0 hover:text-gray-200 md:hover:bg-transparent transition-colors`}>Sign Out</button>
                </li>
                <li>
                    <button onClick={() => navigate('/video/upload')} class={`${activeLink === "create" ? "text-emerald-400" : "text-white"} block py-2 px-3 rounded hover:bg-gray-800 md:hover:bg-transparent md:border-0 md:hover:text-gray-200 md:p-0 hover:text-gray-200 md:hover:bg-transparent transition-colors`}>Create</button>
                </li>
                {/* <li>
            <button type="button" class="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" id="user-menu-button" aria-expanded="false" aria-haspopup="true">
              <span class="absolute -inset-1.5"></span>
              <img class="h-8 w-8 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
            </button>
          </li> */}
              </>
            }
            </ul>
          </div>
        </div>
        
        <div class={`md:hidden ${showPanel ? "block" : "hidden"}`} id="mobile-menu">
          <div class="space-y-1 px-2 pb-3 pt-2">
            { !isLoggedIn ?
              <>
            <button onClick={() => {navigate('/auth/login'); handlePanel()}} class={`w-full ${activeLink === "login" ? "bg-emerald-600 text-white" : "text-white hover:bg-gray-800" } block rounded-md px-3 py-2 text-base font-medium transition-colors`}>Sign In</button>
            <button onClick={() => {navigate('/auth/signup'); handlePanel()}} class={`w-full ${activeLink === "signup" ? "bg-emerald-600 text-white" : "text-white hover:bg-gray-800" } block rounded-md px-3 py-2 text-base font-medium transition-colors`}>Sign Up</button>
            </> :
            <>
            <button onClick={() => {navigate('/user'); handlePanel()}} class={`w-full ${activeLink === "dashboard" ? "bg-emerald-600 text-white" : "text-white hover:bg-gray-800" } block rounded-md px-3 py-2 text-base font-medium transition-colors`}>Dashboard</button>
            <button onClick={() => handleSignOut(true)} class={`w-full ${activeLink === "logout" ? "bg-emerald-600 text-white" : "text-white hover:bg-gray-800" } block rounded-md px-3 py-2 text-base font-medium transition-colors`}>Sign Out</button>
            <button onClick={() => {navigate('/video/upload'); handlePanel()}} class={`w-full ${activeLink === "create" ? "bg-emerald-600 text-white" : "text-white hover:bg-gray-800" } block rounded-md px-3 py-2 text-base font-medium transition-colors`}>Create</button>
            </>
            }
            </div>
        </div>
      </nav>   
</>
    )
}

export default Navbar;