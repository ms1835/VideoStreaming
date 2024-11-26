import React, { useContext, useState } from 'react';
import Toast from './Message';
import { useNavigate } from 'react-router-dom';
import Profile from './../assets/profile.jpg';
import Loader from './Loader';
import { ToastContext } from '../context/ToastContext';

const VideoCard = (props) => {
    const video = props?.video;
    const uploadDate = new Date(video?.createdAt);
    const date = uploadDate.getDate();
    const month = uploadDate.getMonth()+1;
    const year = uploadDate.getFullYear();
    const [loading, setLoading] = useState(false);
    const { addToast } = useContext(ToastContext);

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

    const deleteVideo = async(event) => {
        const videoId = event.currentTarget.getAttribute('data-id');
        console.log("ID for deletion: ", videoId);
        try{
            setLoading(true);
            const rawData = await fetch(`${import.meta.env.VITE_SERVER_URI}/video/${videoId}`, {
                method: "DELETE",
                credentials: "include"
            });
            const response = await rawData.json();
            console.log(response);
            if(response?.success){
                props.onDelete(videoId);
                addToast({type: "success", message: response.message});
            }
        } catch(err){
            console.log(err);
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
    <div className="flex flex-col rounded overflow-hidden shadow-lg h-fit">
        <div className='aspect-w-16 aspect-h-9'>
            <video id="video" className='w-full h-auto aspect-video object-cover' controls >
                <source src={video.filePath}/>
            </video>
        </div>
        <div className='flex flex-row p-3 gap-4'>
            <img className='rounded-full h-10 w-10' src={Profile} />
            <div className="flex flex-col cursor-pointer" onClick={() => navigate(`/video/${video._id}`, { state: { video, creator: props?.creator }})}>
                <div className="font-bold text-lg truncate" title={video.title}>{video?.title}</div>
                    <p className="text-gray-700 text-base truncate-multiline" title={video.description}>{video.description}</p>
                    <p className="text-gray-500 text-base text-sm" title={props?.creator?.name}>{props?.creator?.name}</p>
            </div>
            {/* <img src={Meatballs} className='h-4 w-4' /> */}
        </div>
        <div className={`flex mb-2 mx-2 ${props?.fromDashboard ? "justify-between" : "justify-end"}`}>
            <span className="inline-block bg-rose-200 rounded-full px-3 py-1 text-sm text-slate-800">
                Posted On: {date+"-"+month+"-"+year}
            </span>
            { props.fromDashboard &&
                <svg onClick={deleteVideo} data-id={video._id} className='bg-red-700 rounded-lg h-6 w-6 p-1 cursor-pointer' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
                    <path fill="#ffffff" d="M12 12h2v12h-2zm6 0h2v12h-2z" />
                    <path fill="#ffffff" d="M4 6v2h2v20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8h2V6zm4 22V8h16v20zm4-26h8v2h-8z" />
                </svg>
            }
        </div>
    </div>
    </>
  );
};

export default VideoCard;