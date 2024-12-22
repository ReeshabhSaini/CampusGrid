import React from 'react';

const Profile = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-6">Profile Section</h2>
      <div className="bg-white shadow-md rounded-lg p-6 flex items-center space-x-6">
        {/* Profile Image */}
        <img
          src="https://via.placeholder.com/120"
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
        />
        <div className="flex-1">
          <p className="text-xl font-semibold text-gray-800">John Doe</p>
          <p className="text-sm text-gray-500 mb-4">johndoe@example.com</p>
          
          {/* Profile Details */}
          <div className="text-gray-700">
            <p><strong>Location:</strong> New York, USA</p>
            <p><strong>Skills:</strong> Web Development, JavaScript, React</p>
          </div>

          {/* Edit Button (you can add functionality later) */}
          <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
