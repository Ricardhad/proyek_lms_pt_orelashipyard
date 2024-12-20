// Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar } from '@mui/material'; // Material-UI Avatar
import { Tooltip,Drawer } from '@mui/material'; // Tooltip for icons
import { FaUser, FaBook, FaUsers, FaComments, FaBell } from 'react-icons/fa'; // Using react-icons for icons

function Sidebar() {
  return (
    <div className="flex flex-col h-screen w-64 bg-gray-200 p-4">
      {/* Profile Avatar */}
      <div className="flex items-center mb-4">
        <Avatar alt="Profile" src="/path/to/profile/image.jpg" sx={{ width: 56, height: 56 }} />
      </div>

      {/* Sidebar Menu */}
      <div className="flex flex-col">
        <Tooltip title="My Profile">
          <Link to="/homeMentor/mentor" className="flex items-center p-2 text-gray-700 hover:bg-gray-300 rounded-lg">
            <FaUser className="mr-2" />
            My Profile
          </Link>
        </Tooltip>
        
        <Tooltip title="Materials">
          <Link to="/homeMentor/materials" className="flex items-center p-2 text-gray-700 hover:bg-gray-300 rounded-lg">
            <FaBook className="mr-2" />
            Materials
          </Link>
        </Tooltip>
        
        <Tooltip title="My Interns">
          <Link to="/homeMentor/interns" className="flex items-center p-2 text-gray-700 hover:bg-gray-300 rounded-lg">
            <FaUsers className="mr-2" />
            My Interns
          </Link>
        </Tooltip>

        <Tooltip title="Group Chat">
          <Link to="/homeMentor/chat" className="flex items-center p-2 text-gray-700 hover:bg-gray-300 rounded-lg">
            <FaComments className="mr-2" />
            Group Chat
          </Link>
        </Tooltip>

        <Tooltip title="Add Announcement">
          <Link to="/homeMentor/addannouncement" className="flex items-center p-2 text-gray-700 hover:bg-gray-300 rounded-lg">
            <FaBell className="mr-2" />
            Add Announcement
          </Link>
        </Tooltip>
      </div>
    </div>
  );
}

export default Sidebar;