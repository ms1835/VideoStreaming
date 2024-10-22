import React from 'react';
import Toast from './Message';
import { useNavigate } from 'react-router-dom';
import Profile from './../assets/profile.jpg';

const VideoCard = ({ video }) => {
    const uploadDate = new Date(video?.createdAt);
    const date = uploadDate.getDate();
    const month = uploadDate.getMonth()+1;
    const year = uploadDate.getFullYear();

    const navigate = useNavigate();

    const handleMouseOver = (event) => {
        const videoElement = event.target;
        videoElement.play();
    }

    const handleMouseOut = (event) => {
        const videoElement = event.target;
        videoElement.pause();
        videoElement.currentTime=0;
    }

    

  return (
    <>
    <div className='absolute top-3 right-3'>
        <Toast></Toast>
    </div>
    <div className="rounded overflow-hidden shadow-lg h-fit">
        <div className='aspect-w-16 aspect-h-9'>
            <video id="video" className='object-cover min-h-50 md:min-h-80' controls >
                <source src={video.filePath}/>
            </video>
        </div>
        <div className='flex flex-row p-2 gap-4'>
            <img className='rounded-full h-10 w-10' src={Profile} />
            <div className="flex flex-col cursor-pointer" onClick={() => navigate(`/video/${video._id}`, { state: video})}>
                <div className="font-bold text-lg truncate" title={video.title}>{video?.title}</div>
                <p className="text-gray-700 text-base" title={video?.creator?.name}>{video?.creator?.name}</p>
            </div>
        </div>
        <div className="flex justify-end mb-2 mr-2">
                <span className="bg-rose-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                Posted On: {date+"-"+month+"-"+year}
                </span>
            </div>
    </div>
    </>
  );
};

export default VideoCard;