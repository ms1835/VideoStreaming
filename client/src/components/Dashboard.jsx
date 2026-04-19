import React, {useState, useEffect, lazy, Suspense, useContext } from 'react';
import { useParams } from 'react-router-dom';
import Profile from './../assets/profile.jpg'
import Loader from './Loader';
import { AppContext } from '../context/AppContext';
import { ToastContext } from '../context/ToastContext';
const VideoCard = lazy(()=> import('./VideoCard'));
import Toast from './Message';

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
  const [channelOwner, setChannelOwner] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const { addToast } = useContext(ToastContext);
  const { userData } = useContext(AppContext);
  const { userID: routeUserID } = useParams();
  const dashboardUserID = routeUserID || localStorage.getItem('token');

  const handleVideoDelete = (deletedVideoID) => {
    setVideos(prevVideos => prevVideos.filter(video => video._id !== deletedVideoID))
    addToast({ type: "success", message: "Video deleted successfully"})
  }

  const updateSubscribedState = (channel, isSubscribedFromServer) => {
    if(!userData || !channel) {
      setIsSubscribed(false);
      return;
    }
    if(userData._id === channel._id) {
      setIsSubscribed(false);
      return;
    }
    setIsSubscribed(Boolean(isSubscribedFromServer));
  }

  const subscribeChannel = async () => {
    if(!userData?._id){
      addToast({type: "error", message: "You must be signed in to subscribe."});
      return;
    }
    if(!channelOwner?._id){
      addToast({type: "error", message: "Channel not found."});
      return;
    }
    if(channelOwner._id === userData._id){
      addToast({type: "info", message: "You cannot subscribe to your own channel."});
      return;
    }

    try {
      const rawData = await fetch(`${import.meta.env.VITE_SERVER_URI}/user/subscribe`, {
        method: "PUT",
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          channelID: channelOwner._id,
          user: userData._id
        })
      });
      const response = await rawData.json();
      if(!response?.success){
        throw new Error(response?.message || 'Unable to update subscription');
      }

      setIsSubscribed(Boolean(response.isSubscribed));
      setChannelOwner(prev => ({
        ...prev,
        subscribersCount: response?.subscribersCount ?? prev?.subscribersCount
      }));
      addToast({ type: response.success ? 'success' : 'error', message: response.message });

    } catch (error) {
      console.log(error);
      addToast({type: "error", message: error?.message || "Subscription update failed."});
    }
  }

    useEffect(() => {
        const getVideos = async() => {
            try{
                setLoading(true);
                const queryString = userData?._id ? `?currentUserID=${userData._id}` : "";
        const rawData = await fetch(`${import.meta.env.VITE_SERVER_URI}/user/${dashboardUserID}${queryString}`, {
                    method: "GET",
                    credentials: 'include'
                })
                const response = await rawData.json();
                console.log(response);
                if(response?.success){
                  setVideos(response?.data);
                  setChannelOwner(response?.user);
                  updateSubscribedState(response?.user, response?.isSubscribed);
                }
            } catch(error) {
                console.log(error);
                addToast({type: "error", message: error?.message});
            } finally {
              setLoading(false);
            }
        }
        if(dashboardUserID){
          getVideos();
        }
    },[dashboardUserID]);

    useEffect(() => {
      updateSubscribedState(channelOwner);
    }, [userData, channelOwner]);

  return (
    loading ? <Loader /> :
    <>
      <div className='absolute top-3 right-3'>
        <Toast></Toast>
      </div>
      <div className='flex flex-col m-8'>
        <div className="flex flex-col lg:flex-row gap-4 p-4 border rounded-lg shadow-md justify-evenly bg-cyan-900 items-center">
          <div className='flex justify-center lg:justify-start'>
          <img
            src={Profile}
            alt="Profile"
            className="w-24 h-24 sm:w-28 sm:h-28 md:h-32 md:w-32 lg:w-36 lg:h-36 rounded-full object-cover bg-red-800"
            loading='lazy'
          />
        </div>
          <div className="flex flex-col justify-between max-w-[80%]">
            <h1 className="text-3xl text-white font-semibold">{channelOwner?.name || "Channel Name"}</h1>

            <div className="flex flex-col md:flex-row justify-between items-center gap-3">
              <p className="text-white">Total Videos: {videos?.length || 0}</p>
              <p className="text-white">Subscribers: {channelOwner?.subscribersCount || 0}</p>
              {userData && userData._id !== channelOwner?._id && (
                <button
                  onClick={subscribeChannel}
                  className={`${isSubscribed ? "bg-rose-500" : "bg-slate-500 hover:bg-slate-600"} text-white px-4 py-2 rounded-full`}
                >
                  {isSubscribed ? "Subscribed" : "Subscribe"}
                </button>
              )}
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
            <Suspense fallback={<Loader />}>
              <VideoCard key={index} video={video} fromDashboard={true} onDelete={handleVideoDelete} creator={userData} />
            </Suspense>
          ))}
          </div>
      </div>
    </>
  );
};

export default Dashboard;
