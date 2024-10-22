import { createContext, useState } from "react";


export const ToastContext = createContext();

export const ToastProvider = ({children}) => {
    const [toast, setToast] = useState({type: null, message: ""});

    const addToast = (data) => {
        setToast(data);
        setTimeout(()=> {
            clearToast();
        }, 3000);
    }

    const clearToast = () => {
        setToast({type: null, message: ""});
    }

    return (
        <ToastContext.Provider value={{toast, addToast, clearToast}}>
            {children}
        </ToastContext.Provider>
    )
}