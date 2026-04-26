import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Toast from './Message';
import { ToastContext } from '../context/ToastContext';
import Loader from './Loader';

const UploadVideo = () => {
    const [userData, setUserData] = useState({title:'',description:'',video:null});
    const navigate = useNavigate();
    const userID = localStorage.getItem('token') || null;
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [video, setVideo] = useState(null);
    const { addToast } = useContext(ToastContext);
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        const file = event.target.files[0];
        console.log("File uploaded: ", file);
        setVideo(file);
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
            const myForm = new FormData();
            myForm.append('title', title);
            myForm.append('description', description);
            myForm.append('video', video);

            for (let [key, value] of myForm.entries()) {
                console.log(`${key}:`, value);
            }
            setLoading(true);
            const rawData = await fetch(`${import.meta.env.VITE_SERVER_URI}/video/${userID}`, {
                method: "POST",
                credentials: 'include',
                body: myForm
            })
            const response = await rawData.json();
            console.log(response);
            if(response.success){
                addToast({type: "success", message: response.message});
                setUserData({title:'',description:'',video:null});
                navigate('/user');
            }
            else{
                addToast({type: "error", message: response.message})
            }
        } catch(error) {
            console.log(error);
            addToast({type: "error", message: error.message});
        } finally {
            setLoading(false);
        }
    }

  return (
    loading ? <Loader /> :
    <>
    <div className='absolute top-3 right-3'>
        <Toast></Toast>
      </div>
    <form class=" w-[75%] sm:w-2/3 xl:w-1/3 mx-auto border border-2 rounded-lg p-4 my-8 md:my-0 md:p-16 self-center h-fit bg-gray-900">
        <div class="relative z-0 w-full mb-8 group text-center">
            <h1 className='text-3xl font-bold text-gray-200'>Make Your Move</h1>
        </div>
        <div class="relative z-0 w-full mb-8 group">
            <input 
                type="text" 
                name="title" 
                id="floating_title" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                class="block py-2 px-0 w-full text-sm text-gray-200 bg-transparent border-0 border-b-2 border-gray-700 appearance-none focus:border-emerald-500 focus:outline-none focus:ring-0 peer" 
                placeholder=" " 
                required />
            <label 
                for="floating_title" 
                class="peer-focus:font-medium absolute text-gray-400 duration-300 transform -translate-y-6 scale-75 top-0 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-emerald-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-placeholder-shown:top-3"
            >
                Title
            </label>
        </div>
        <div class="relative z-0 w-full mb-5 group">
            <input 
                type="text" 
                name="description" 
                id="floating_description" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                class="block py-2 px-0 w-full text-sm text-gray-200 bg-transparent border-0 border-b-2 border-gray-700 appearance-none focus:border-emerald-500 focus:outline-none focus:ring-0 peer" 
                placeholder=" " 
                required />
            <label 
                for="floating_description" 
                class="peer-focus:font-medium absolute text-gray-400 duration-300 transform -translate-y-6 scale-75 top-0 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-emerald-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-placeholder-shown:top-3"
            >
                Description
            </label>
        </div>
        <div class="relative z-0 w-full mb-5 group">
            <input 
                type="file" 
                name="video" 
                id="floating_file"
                onChange={handleChange}
                class="block py-2 px-0 w-full text-sm text-gray-200 bg-transparent border-0 border-b-2 border-gray-700 appearance-none focus:border-emerald-500 focus:outline-none focus:ring-0 peer" 
                placeholder=" " 
                required />
        </div>
        <div class="flex flex-col sm:flex-row relative z-0 w-full mb-5 group justify-between">
            <button 
                type="submit" 
                onClick={handleSubmit}
                class="text-gray-200 bg-emerald-500 hover:bg-emerald-600 focus:ring-4 focus:outline-none focus:ring-emerald-500 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            >
                Upload
            </button>
        </div>
    </form>
    </>
  )
}

export default UploadVideo;