import { createContext, useState } from "react";


export const AppContext = createContext();

export const AppProvider = ({children}) => {
    const [isSideBarOpen, setSideBarOpen] = useState(false);

    const toggleSideBar = () => {
        setSideBarOpen(!isSideBarOpen);
    }

    return (
        <AppContext.Provider value={{isSideBarOpen, toggleSideBar}}>
            {children}
        </AppContext.Provider>
    )
}