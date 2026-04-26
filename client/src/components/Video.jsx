import { useState, useEffect, useContext, useCallback } from "react";
import { useLocation, useParams } from "react-router-dom";
import Loader from "./Loader";
import { AppContext } from "../context/AppContext";
import { ToastContext } from "../context/ToastContext";
import { useReaction } from "../context/ReactionContext";
import Profile from "./../assets/profile.jpg";


const Video = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const { isLoggedIn } = useContext(AppContext);
    const location = useLocation();
    const { video, creator } = location.state || {};
    const [videoDetails, setVideoDetails] = useState(video || null);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState("");
    const [replyText, setReplyText] = useState({});
    const [replyingTo, setReplyingTo] = useState(null);
    const userID = localStorage.getItem('token') || null;
    const { addToast } = useContext(ToastContext);

    const handleCommentChange = (event) => {
        const textarea = event.target;
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
        setCommentText(textarea.value);
    };
    const { reaction, handleReaction } = useReaction();
    const { userData } = useContext(AppContext);
    const [isSubscribed, setIsSubscribed] = useState(false);

    const currentVideo = videoDetails;
    const currentCreator = creator || videoDetails?.creator;
    const uploadDate = new Date(currentVideo?.createdAt || Date.now());
    const date = uploadDate.getDate();
    const month = uploadDate.getMonth() + 1;
    const year = uploadDate.getFullYear();

    const getVideoDetails = useCallback(async() => {
        try{
            const rawData = await fetch(`${import.meta.env.VITE_SERVER_URI}/video/${id}`, {
                method: "GET",
                credentials: "include"
            });
            const response = await rawData.json();
            if(response.success){
                setVideoDetails(response.data);
                setComments(response.comments || []);
            }
        } catch(err) {
            console.log(err);
        }
    },[id])

    const getComments = useCallback(async() => {
        try{
            const rawData = await fetch(`${import.meta.env.VITE_SERVER_URI}/video/${id}/comments`, {
                method: "GET",
                credentials: "include"
            });
            const response = await rawData.json();
            if(response.success){
                setComments(response.data || []);
            }
        } catch(err) {
            console.log(err);
        }
    },[id]);

    const handleCommentSubmit = async (event) => {
        event.preventDefault();
        if(!userID){
            addToast({type: "error", message: "You must be signed in to comment."});
            return;
        }
        if(!commentText.trim()){
            addToast({type: "error", message: "Comment cannot be empty."});
            return;
        }

        try{
            const rawData = await fetch(`${import.meta.env.VITE_SERVER_URI}/video/${id}/comment`, {
                method: "POST",
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    content: commentText,
                    userId: userID,
                    parentComment: null
                })
            });
            const response = await rawData.json();
            if(response.success){
                setCommentText("");
                addToast({type: "success", message: response.message});
                getComments();
            } else {
                addToast({type: "error", message: response.message || "Could not post comment."});
            }
        } catch(err){
            console.log(err);
            addToast({type: "error", message: err.message});
        }
    }

    const handleReplySubmit = async (parentCommentId) => {
        if(!userID){
            addToast({type: "error", message: "You must be signed in to reply."});
            return;
        }
        const body = (replyText[parentCommentId] || "").trim();
        if(!body){
            addToast({type: "error", message: "Reply cannot be empty."});
            return;
        }

        try{
            const rawData = await fetch(`${import.meta.env.VITE_SERVER_URI}/video/${id}/comment`, {
                method: "POST",
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    content: body,
                    userId: userID,
                    parentComment: parentCommentId
                })
            });
            const response = await rawData.json();
            if(response.success){
                setReplyText(prev => ({...prev, [parentCommentId]: ""}));
                setReplyingTo(null);
                addToast({type: "success", message: response.message});
                getComments();
            } else {
                addToast({type: "error", message: response.message || "Could not post reply."});
            }
        } catch(err){
            console.log(err);
            addToast({type: "error", message: err.message});
        }
    }

    const renderComments = (items, depth = 0) => {
        return items.map(comment => (
            <div key={comment._id} className="bg-gray-900 border border-gray-700 rounded-xl p-2 text-gray-200" style={{marginLeft: depth * 24}}>
                <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-900 flex items-center justify-center text-sm font-semibold text-gray-200">
                        <img 
                            src={Profile} 
                            alt={comment.creator?.name || comment.creator?.email || 'User'} 
                            className="w-8 h-8 sm:w-8 sm:h-8 md:h-8 md:w-8 lg:w-8 lg:h-8 rounded-full object-cover bg-gray-900"
                            loading='lazy'
                        />
                    </div>
                    <div className="flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                                <p className="font-semibold text-gray-200">{comment.creator?.name || comment.creator?.email || 'Unknown'}</p>
                                <p className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleString()}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
                                className="text-sm text-emerald-500 hover:text-emerald-600 hover:bg-gray-800 p-2 rounded-lg"
                            >
                                Reply
                            </button>
                        </div>
                        <p className="mt-1 text-gray-200 whitespace-pre-line">{comment.content}</p>
                        {replyingTo === comment._id && (
                            <div className="mt-4">
                                <textarea
                                    className="w-full rounded-lg border border-gray-700 p-3 focus:border-emerald-500 focus:outline-none bg-gray-900 text-gray-200"
                                    rows={3}
                                    value={replyText[comment._id] || ""}
                                    onChange={(e) => setReplyText(prev => ({...prev, [comment._id]: e.target.value}))}
                                    placeholder="Write your reply"
                                />
                                <div className="mt-3 flex flex-wrap gap-2">
                                    <button
                                        type="button"
                                        onClick={() => handleReplySubmit(comment._id)}
                                        className="rounded-full bg-emerald-500 px-4 py-2 text-sm text-gray-200 hover:bg-emerald-600"
                                    >
                                        Post Reply
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setReplyingTo(null)}
                                        className="rounded-full border border-gray-700 px-4 py-2 text-sm text-gray-200 hover:bg-gray-800"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                {comment.replies?.length > 0 && (
                    <div className="mt-4">
                        {renderComments(comment.replies, depth + 1)}
                    </div>
                )}
            </div>
        ));
    }

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
        try {
            if(!userID) {
                addToast({type: "error", message: "User not authenticated"});
                return;
            }
            if(!currentVideo?.creator?._id){
                throw new Error("Creator not found");
            }
            if(currentVideo.creator._id === userID){
                addToast({type: "info", message: "You cannot subscribe to your own channel."});
                return;
            }
            const rawData = await fetch(`${import.meta.env.VITE_SERVER_URI}/user/subscribe`, {
                method: 'PUT',
                credentials: "include",
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify({
                    channelID: currentVideo.creator._id,
                    user: userID
                })
            })
            const response = await rawData.json();
            console.log(response);
            if(!response?.success){
                throw new Error(response?.message || 'Subscription update failed');
            }
            setIsSubscribed(Boolean(response.isSubscribed));
        } catch(err) {
            console.log(err);
            addToast({type: "error", message: err.message});
        }
    }

    const checkSubscriptionStatus = async (creatorId) => {
        if(!userID || !creatorId){
            setIsSubscribed(false);
            return;
        }
        try {
            const rawData = await fetch(`${import.meta.env.VITE_SERVER_URI}/user/subscription-status?channelID=${creatorId}&userID=${userID}`, {
                method: 'GET',
                credentials: 'include'
            });
            const response = await rawData.json();
            setIsSubscribed(Boolean(response?.isSubscribed));
        } catch(err) {
            console.log(err);
            setIsSubscribed(false);
        }
    };

    useEffect(() => {
        getVideoDetails();
        getComments();
    },[getVideoDetails, getComments, reaction]);

    useEffect(() => {
        checkSubscriptionStatus(currentVideo?.creator?._id);
    }, [currentVideo?.creator?._id, userID]);

    return (
        loading ? <Loader /> :
        currentVideo ? (
        <div className="min-h-screen bg-slate-950 text-gray-200">
            <div className="w-full bg-black">
                <video id="video" className="w-full h-[65vh] min-h-[360px] object-cover" controls>
                    <source src={currentVideo.filePath}/>
                </video>
            </div>

            <div className="p-3 border-t-2 border-gray-800">
                <div className="space-y-2">
                    <h1 className="text-xl md:text-2xl font-semibold text-white truncate" title={currentVideo.title}>{currentVideo.title}</h1>
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center text-lg font-semibold text-white">
                                <img 
                                    src={Profile} 
                                    alt={currentCreator?.name?.charAt(0) || currentCreator?.email?.charAt(0) || 'U'} 
                                    className="w-12 h-12 sm:w-12 sm:h-12 md:h-12 md:w-12 lg:w-12 lg:h-12 rounded-full object-cover bg-gray-900"
                                    loading='lazy'
                                />
                            </div>
                            <div className="min-w-0">
                                <p className="truncate text-lg font-medium text-white">{currentCreator?.name || currentCreator?.email || 'Unknown creator'}</p>
                                <p className="text-sm text-gray-400">{currentCreator?.subscribersCount || 0} subscribers</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">

                            <button type="button" onClick={likeVideo} className={`${isLoggedIn ? 'cursor-pointer' : 'opacity-80'} inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-gray-200 transition hover:bg-emerald-600`}>
                            <span>{currentVideo.likes}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
                            </svg>
                            </button>
                            <button type="button" onClick={dislikeVideo} className={`${isLoggedIn ? 'cursor-pointer' : 'opacity-80'} inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-gray-200 transition hover:bg-gray-800`}>
                                <span>{currentVideo.unlikes}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.498 15.25H4.372c-1.026 0-1.945-.694-2.054-1.715a12.137 12.137 0 0 1-.068-1.285c0-2.848.992-5.464 2.649-7.521C5.287 4.247 5.886 4 6.504 4h4.016a4.5 4.5 0 0 1 1.423.23l3.114 1.04a4.5 4.5 0 0 0 1.423.23h1.294M7.498 15.25c.618 0 .991.724.725 1.282A7.471 7.471 0 0 0 7.5 19.75 2.25 2.25 0 0 0 9.75 22a.75.75 0 0 0 .75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 0 0 2.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384m-10.253 1.5H9.7m8.075-9.75c.01.05.027.1.05.148.593 1.2.925 2.55.925 3.977 0 1.487-.36 2.89-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398-.306.774-1.086 1.227-1.918 1.227h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 0 0 .303-.54" />
                                </svg>
                            </button>
                            <button type="button" onClick={subscribeChannel} className={`${isSubscribed ? 'bg-emerald-500' : 'bg-slate-900 hover:bg-gray-800'} rounded-full px-4 py-2 text-sm font-semibold text-gray-200 transition`}>
                                {isSubscribed ? 'Subscribed' : 'Subscribe'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-4 p-3">
                <div className="rounded-2xl border border-gray-800 bg-slate-900 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-gray-400">
                        <span>Posted on: {date + '-' + month + '-' + year}</span>
                    </div>
                    <p className="mt-1 text-gray-300 leading-relaxed">{currentVideo.description || 'No description provided.'}</p>
                </div>

                <div className="rounded-2xl border border-gray-800 bg-slate-900 p-6 space-y-5">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Comments ({comments.length})</h2>
                    </div>

                    {isLoggedIn ? (
                        <form onSubmit={handleCommentSubmit} className="space-y-1">
                            <textarea
                                value={commentText}
                                onChange={handleCommentChange}
                                onInput={handleCommentChange}
                                className="w-full min-h-[52px] resize-none rounded-2xl border border-gray-700 bg-slate-950 px-4 py-4 text-sm text-gray-200 placeholder:text-gray-500 focus:border-emerald-500 focus:outline-none"
                                rows={1}
                                placeholder="Share your thoughts"
                            />
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setCommentText("")}
                                    className="rounded-full border border-gray-700 bg-slate-950 px-4 py-2 text-sm text-gray-200 hover:bg-gray-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-medium text-gray-200 hover:bg-emerald-600"
                                >
                                    Comment
                                </button>
                            </div>
                        </form>
                    ) : (
                        <p className="text-sm text-gray-400">Sign in to add a comment.</p>
                    )}

                    {comments.length === 0 ? (
                        <p className="text-gray-400">No comments yet. Be the first to share your thoughts.</p>
                    ) : (
                        <div className="space-y-1">
                            {renderComments(comments)}
                        </div>
                    )}
                </div>
            </div>
        </div>
        ) : <></>
    )
}

export default Video;