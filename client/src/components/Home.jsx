import React, { useEffect, useState } from 'react'
import VideoCard from './VideoCard';
import Loader from './Loader';

const Home = () => {
    const [videos, setVideos] = useState([]);
    const [reaction ,setReaction] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getVideos = async() => {
            try{
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
            } finally {
              setLoading(false);
            }
        }
        getVideos();
        
    },[reaction]);

    const handleReactionChange = () => {
        setReaction(!reaction);
    }

  return (
    loading ? <Loader /> :
    <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8 m-8 md:m-16">
      {videos.map((video, index) => (
        <VideoCard key={index} video={video} handleReaction={handleReactionChange} />
      ))}
    </div>
  )
}

export default Home;