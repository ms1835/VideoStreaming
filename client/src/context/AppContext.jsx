import { createContext, useState } from "react";


export const AppContext = createContext();

export const AppProvider = ({children}) => {
    const [isSideBarOpen, setSideBarOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('token') ? true : false);
    const userData = localStorage.getItem('user');

    const handleSession = (value) => {
        setIsLoggedIn(value);
    }

    const toggleSideBar = () => {
        setSideBarOpen(!isSideBarOpen);
    }

    return (
        <AppContext.Provider value={{isSideBarOpen, toggleSideBar, isLoggedIn, handleSession, userData}}>
            {children}
        </AppContext.Provider>
    )
}