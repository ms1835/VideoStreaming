import React from 'react';

const VideoCard = ({ video }) => {
  return (
    <div className="max-w-xs rounded overflow-hidden shadow-lg">
      <video>
        
      </video>
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{video.title}</div>
        <p className="text-gray-700 text-base">{video.description}</p>
      </div>
      <div className="px-6 py-4">
        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
          {video.views} views
        </span>
        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
          {video.date}
        </span>
        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
          {video.duration}
        </span>
      </div>
    </div>
  );
};

export default VideoCard;