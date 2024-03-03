import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const UploadVideo = () => {
    const [userData, setUserData] = useState({title:'',description:'',video:null});
    const navigate = useNavigate();

    const handleChange = (event) => {
        const {name, value, files} = event.target;
        if(files){
            setUserData({
                ...userData,
                [name]: files[0]
            })
        }
        else{
            setUserData({
                ...userData,
                [name]: value
            })
        }
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('title', userData.title);
            formData.append('description', userData.description);
            formData.append('video', userData.video);
            const rawData = await fetch("http://localhost:3000/video", {
                method: "POST",
                credentials: 'include',
                body: formData
            })
            const response = await rawData.json();
            console.log(response);

            setUserData({title:'',description:'',video:null});
            navigate('/user');
        } catch(error) {
            console.log(error);
        }
    }

  return (
    <form class=" w-[75%] sm:w-2/3 xl:w-1/3 mx-auto border border-2 rounded-lg p-4 md:p-16 self-center h-fit">
        <div class="relative z-0 w-full mb-8 group text-center">
            <h1 className='text-3xl font-bold'>Make Your Move</h1>
        </div>
        <div class="relative z-0 w-full mb-8 group">
            <input 
                type="text" 
                name="title" 
                id="floating_title" 
                value={userData.title}
                onChange={handleChange}
                class="block py-2 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" 
                placeholder=" " 
                required />
            <label 
                for="floating_title" 
                class="peer-focus:font-medium absolute text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-0 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-placeholder-shown:top-3"
            >
                Title
            </label>
        </div>
        <div class="relative z-0 w-full mb-5 group">
            <input 
                type="text" 
                name="description" 
                id="floating_description" 
                value={userData.description}
                onChange={handleChange}
                class="block py-2 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" 
                placeholder=" " 
                required />
            <label 
                for="floating_description" 
                class="peer-focus:font-medium absolute text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-0 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-placeholder-shown:top-3"
            >
                Password
            </label>
        </div>
        <div class="relative z-0 w-full mb-5 group">
            <input 
                type="file" 
                name="video" 
                id="floating_file"
                onChange={handleChange}
                class="block py-2 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" 
                placeholder=" " 
                required />
        </div>
        <div class="flex flex-col sm:flex-row relative z-0 w-full mb-5 group justify-between">
            <button 
                type="submit" 
                onClick={handleSubmit}
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
                Upload
            </button>
        </div>
    </form>
  )
}

export default UploadVideo;