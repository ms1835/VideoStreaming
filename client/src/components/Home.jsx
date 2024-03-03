import React, { useEffect, useState } from 'react'
import VideoCard from './VideoCard';

const Home = () => {
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        const getVideos = async() => {
            try{
                const rawData = await fetch("http://localhost:3000", {
                    method: "GET",
                    credentials: 'include'
                })
                const response = await rawData.json();
                console.log(response);
                setVideos(response.data);
            } catch(error) {
                console.log(error);
            }
        }
        getVideos();
        
    },[]);

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8 m-8 md:m-16">
      {videos.map((video, index) => (
        <VideoCard key={index} video={video} />
      ))}
    </div>
  )
}

export default Home;