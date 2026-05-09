import React, { useContext, useEffect } from "react";
import { ToastContext } from "../context/ToastContext";


const Message = () => {
    const { toast, addToast, clearToast } = useContext(ToastContext);

    useEffect(() => {
        console.log("Toast:", toast);
    },[toast, addToast, clearToast])

    switch (toast.type) {
        case 'success': return (
            <div className="fixed top-4 right-4 z-50 flex items-center w-full max-w-xs p-4 text-gray-200 bg-green-600 rounded-lg shadow-lg" role="alert">
                <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-white bg-green-700 rounded-lg">
                    <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                    <span className="sr-only">Check icon</span>
                </div>
                <div className="ml-3 text-sm font-normal">{toast.message}</div>

            </div>
        );
        case 'error': return (
            <div id="toast-danger" className="fixed top-4 right-4 z-50 flex items-center w-full max-w-xs p-4 text-gray-200 bg-red-600 rounded-lg shadow-lg" role="alert">
                <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-white bg-red-700 rounded-lg">
                    <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                    <span className="sr-only">Error icon</span>
                </div>
                <div className="ml-3 text-sm font-normal">{toast.message}</div>

            </div>
        );
        case 'warning': return (
            <div id="toast-warning" className="fixed top-4 right-4 z-50 flex items-center w-full max-w-xs p-4 text-gray-200 bg-yellow-500 rounded-lg shadow-lg" role="alert">
                <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-white bg-yellow-600 rounded-lg">
                    <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
                    <span className="sr-only">Warning icon</span>
                </div>
                <div className="ml-3 text-sm font-normal">{toast.message}</div>

            </div>
        );
        case 'info': return (
            <div id="toast-info" className="fixed top-4 right-4 z-50 flex items-center w-full max-w-xs p-4 text-gray-200 bg-blue-600 rounded-lg shadow-lg" role="alert">
                <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-white bg-blue-700 rounded-lg">
                    <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
                    <span className="sr-only">Info icon</span>
                </div>
                <div className="ml-3 text-sm font-normal">{toast.message}</div>

            </div>
        );
        default: return null;
    }
}

export default Message;