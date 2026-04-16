import { createContext, useState } from "react";

const parseUserData = (raw) => {
    if(!raw) return null;
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

export const AppContext = createContext();

export const AppProvider = ({children}) => {
    const [isSideBarOpen, setSideBarOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('token') ? true : false);
    const [userData, setUserData] = useState(parseUserData(localStorage.getItem('user')));

    const handleSession = (value) => {
        setIsLoggedIn(value);
    }

    const handleUserData = (data) => {
        if(!data){
            localStorage.removeItem('user');
            setUserData(null);
            return;
        }
        const serialized = JSON.stringify(data);
        localStorage.setItem('user', serialized);
        setUserData(data);
    }

    const toggleSideBar = () => {
        setSideBarOpen(!isSideBarOpen);
    }

    return (
        <AppContext.Provider value={{isSideBarOpen, toggleSideBar, isLoggedIn, handleSession, userData, handleUserData}}>
            {children}
        </AppContext.Provider>
    )
}