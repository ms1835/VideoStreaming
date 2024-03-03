import React from 'react';

const Dashboard = () => {
  return (
    <div className="flex flex-row gap-4 p-4 border rounded-lg shadow-md">
      {/* Profile Picture */}
      <img
        src="profile.jpg"
        alt="Profile"
        className="w-20 h-20 rounded-full object-cover"
      />

      <div className="flex flex-col justify-between">
        {/* Channel Name */}
        <h2 className="text-xl font-semibold">Channel Name</h2>

        <div className="flex flex-row justify-between items-center">
          {/* Total Videos */}
          <p className="text-gray-600">Total Videos: 100</p>

          {/* Subscribe Button */}
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
            Subscribe
          </button>
        </div>

        {/* Description Text */}
        <p className="text-gray-700 mt-2">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
