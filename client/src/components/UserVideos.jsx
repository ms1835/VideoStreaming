import React from 'react'

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



const UserVideos = () => {
    const [videos, setVideos] = useState([]);
    const [reaction ,setReaction] = useState(false);

    useEffect(() => {
        const getVideos = async() => {
            try{
                const rawData = await fetch("http://localhost:3000/user", {
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
        
    },[reaction]);

    const handleReactionChange = () => {
        setReaction(!reaction);
    }

    return (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8 m-8 md:m-16">
        {videos.map((video, index) => (
            <VideoCard key={index} video={video} handleReaction={handleReactionChange} />
        ))}
        </div>
    );
};




export default UserVideos;