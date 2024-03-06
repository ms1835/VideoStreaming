import React, {useState, useEffect } from 'react';
import VideoCard from './VideoCard';
import Profile from './../assets/profile.jpg'

// Implement remaining functionality
// const videos = [
//     {
//       title: 'Video 1',
//       thumbnailUrl: 'https://via.placeholder.com/300x200',
//       description: 'Description for video 1',
//       views: 1000,
//       date: '10/10/2023',
//       duration: '5:00',
//     }
//   ];

const Dashboard = () => {
  const [videos, setVideos] = useState([]);
    const [reaction ,setReaction] = useState(false);
  const [user, setUser] = useState(null);

    useEffect(() => {
        const getVideos = async() => {
            try{
                const rawData = await fetch(`${import.meta.env.VITE_SERVER_URI}/user`, {
                    method: "GET",
                    credentials: 'include'
                })
                const response = await rawData.json();
                console.log(response);
                setVideos(response.data);
                setUser(response.user.name);
            } catch(error) {
                console.log(error);
            }
        }
        getVideos();
        
    },[reaction]);

    const handleReactionChange = () => {
        setReaction(!reaction);
    }

  return (
    <div className='flex flex-col m-8'>
      <div className="flex flex-col lg:flex-row gap-4 p-4 border rounded-lg shadow-md justify-evenly bg-cyan-900 items-center">
        <div className='flex justify-center lg:justify-start'>
        <img
          src={Profile}
          alt="Profile"
          className="w-24 h-24 sm:w-28 sm:h-28 md:h-32 md:w-32 lg:w-36 lg:h-36 rounded-full object-cover bg-red-800"
        />
      </div>
        <div className="flex flex-col justify-between max-w-[80%]">
          <h1 className="text-3xl text-white font-semibold">{user || "Channel Name"}</h1>

          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white">Total Videos: {videos.length || 0}</p>

            <button className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded">
              Subscribe
            </button>
          </div>

          <p className="text-white mt-2">
          Get ready for non-stop entertainment and laughter! FunFlix is your ultimate destination for hilarious
           comedy sketches, heartwarming short films, and thrilling movie reviews. Join us as we bring joy and
            excitement into your day!
          </p>
        </div>
      </div>
      <div className='border border-2 border-pink-800 my-4 sm:my-8 md:my-16' />
      <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8">
        {videos.map((video, index) => (
            <VideoCard key={index} video={video} handleReaction={handleReactionChange} />
        ))}
        </div>
    </div>
  );
};

export default Dashboard;
