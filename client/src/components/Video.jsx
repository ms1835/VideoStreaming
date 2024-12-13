import { useState, useEffect, useContext, useCallback } from "react";
import { useLocation, useParams } from "react-router-dom";
import Loader from "./Loader";
import { AppContext } from "../context/AppContext";
import { ToastContext } from "../context/ToastContext";
import { useReaction } from "../context/ReactionContext";


const Video = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const { isLoggedIn } = useContext(AppContext);
    const location = useLocation();
    const { video, creator } = location.state || {};
    const uploadDate = new Date(video?.createdAt);
    const [videoDetails, setVideoDetails] = useState(video);
    const userID = localStorage.getItem('token') || null;
    const { addToast } = useContext(ToastContext);
    const { reaction, handleReaction } = useReaction();
    const { userData } = useContext(AppContext);
    const [isSubscribed, SetIsSubscribed] = useState(false);
    console.log("Id: ",id);
    console.log("Video: ", location.state);

    const date = uploadDate.getDate();
    const month = uploadDate.getMonth()+1;
    const year = uploadDate.getFullYear();

    const getVideoDetails = useCallback(async() => {
        try{
            // setLoading(true);
            const rawData = await fetch(`${import.meta.env.VITE_SERVER_URI}/video/${id}`, {
                method: "GET",
                credentials: "include"
            });
            const response = await rawData.json();
            setVideoDetails(response.data);
        } catch(err) {
            console.log(err);
        } finally {
            // setLoading(false);
        }
    },[id])
    

    const likeVideo = async(e) => {
        e.preventDefault();
        try {
            if(!userID){
                addToast({type: "error", message: "User not authenticated"})
                return;
            }
            const rawData = await fetch(`${import.meta.env.VITE_SERVER_URI}/video/${video._id}/like/${userID}`, {
                method: "POST",
                credentials: 'include',
                headers: {
                    'Content-Type': "Application/json"
                }
            });
            const response = await rawData.json();
            console.log(response);
            if (typeof handleReaction === "function") {
                handleReaction();
            }
            addToast({type: "success", message: response.message});
        } catch(error) {
            console.log(error);
            addToast({type: "error", message: error.message});
        }
    }

    const dislikeVideo = async(e) => {
        e.preventDefault();
        try {
            if(!userID){
                addToast({type: "error", message: "User not authenticated"})
                return;
            }
            const rawData = await fetch(`${import.meta.env.VITE_SERVER_URI}/video/${video._id}/unlike/${userID}`, {
                method: "POST",
                credentials: 'include',
                headers: {
                    'Content-Type': "Application/json"
                }
            });
            const response = await rawData.json();
            console.log(response);
            if (typeof handleReaction === "function") {
                handleReaction(); 
            }
            addToast({type: "success", message: response.message});
        } catch(error) {
            console.log(error);
            addToast({type: "error", message: error.message});
        }
    }

    const subscribeChannel = async() => {
        console.log("Userid: ",userID);
        console.log("Creater: ", video.creator._id)
        try {
            if(!userID) {
                addToast({type: "error", message: "User not authenticated"});
                return;
            }
            const rawData = await fetch(`${import.meta.env.VITE_SERVER_URI}/user/subscribe`, {
                method: 'PUT',
                credentials: "include",
                headers: {
                    'Content-Type': "Application/json"
                },
                body: JSON.stringify({
                    channelID: video.creator._id,
                    user: userID
                })
            })
            const response = await rawData.json();
            console.log(response);
            SetIsSubscribed(!isSubscribed);
        } catch(err) {
            console.log(err);
            addToast({type: "error", message: err.message});
        }
    }

    useEffect(() => {
        getVideoDetails();
        if(userData?.subscribedTo?.some(channel => channel?.id === video?.creator?._id)){
            SetIsSubscribed(true);
        }
    },[reaction, userData, video?.creator?._id]);

    return (
        loading ? <Loader /> :
        video ? (
        <div>
            
            <video id="video" className='w-screen h-screen' controls >
                    <source src={video.filePath}/>
            </video>
            
            <div className="px-6 py-2">
                <div className="font-bold text-xl mb-2 truncate" title={video.title}>{video.title}</div>
                <p className="text-gray-700 text-base truncate-multiline" title={video.description}>{video.description}</p>
            </div>
            <div className="flex flex-row justify-between px-6 py-1">
                <div className="flex justify-start items-center gap-2">
                    <p className="font-bold text-lg">{creator?.name}</p>
                    <p className="text-gray-500 text-sm">{creator?.subscribers?.length} subscriber</p>
                </div>
                <div className="flex justify-end items-center">
                    <span onClick={likeVideo} className={`${isLoggedIn && "cursor-pointer"} inline-flex bg-lime-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2`}>
                        {videoDetails.likes}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="ml-2 w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
                        </svg>
                    </span>
                    <span onClick={dislikeVideo} className={`${isLoggedIn && "cursor-pointer"} inline-flex bg-amber-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2`}>
                        {videoDetails.unlikes}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="ml-2 w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.498 15.25H4.372c-1.026 0-1.945-.694-2.054-1.715a12.137 12.137 0 0 1-.068-1.285c0-2.848.992-5.464 2.649-7.521C5.287 4.247 5.886 4 6.504 4h4.016a4.5 4.5 0 0 1 1.423.23l3.114 1.04a4.5 4.5 0 0 0 1.423.23h1.294M7.498 15.25c.618 0 .991.724.725 1.282A7.471 7.471 0 0 0 7.5 19.75 2.25 2.25 0 0 0 9.75 22a.75.75 0 0 0 .75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 0 0 2.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384m-10.253 1.5H9.7m8.075-9.75c.01.05.027.1.05.148.593 1.2.925 2.55.925 3.977 0 1.487-.36 2.89-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398-.306.774-1.086 1.227-1.918 1.227h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 0 0 .303-.54" />
                        </svg>
                    </span>
                    <button onClick={subscribeChannel} className={`${isSubscribed ? "bg-rose-500" : "bg-slate-500 hover:bg-slate-600" } text-white px-3 py-1 rounded-full`}>
                        {isSubscribed ? "Subscribed" : "Subscribe"}
                    </button>
                </div>
            </div>
            
            <div className="px-6 pb-4 flex">
                <span className="inline-block bg-rose-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                Posted On: {date+"-"+month+"-"+year}
                </span>
            </div>
        
        </div>
        ) : <></>
    )
}

export default Video;