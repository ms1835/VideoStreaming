import React, { useContext, useEffect, useState } from 'react'
import VideoCard from './VideoCard';
import Loader from './Loader';
import { ToastContext } from '../context/ToastContext';
import Toast from './Message';

const Home = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(false);
    const { addToast } = useContext(ToastContext);

    useEffect(() => {
        const getVideos = async() => {
            try {
              setLoading(true);
                const rawData = await fetch(`${import.meta.env.VITE_SERVER_URI}`, {
                    method: "GET",
                    credentials: 'include'
                })
                const response = await rawData.json();
                console.log(response);
                setVideos(response.data);
            } catch(error) {
                console.log(error);
                addToast({type: "error", message: error.message});
            } finally {
              setLoading(false);
            }
        }
        getVideos();
        
    },[]);

  return (
    loading ? <Loader /> :
    <>
      <div className='absolute top-3 right-3'>
        <Toast></Toast>
      </div>
      <div className="w-screen grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8 m-8 md:m-16">
        {videos.map((video, index) => (
          <VideoCard key={index} video={video} fromDashboard={false} />
        ))}
      </div>
    </>
  )
}

export default Home;