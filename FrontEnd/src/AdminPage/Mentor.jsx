import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Edit, Info } from 'lucide-react';
import client from '../client'; // Koneksi backend (axios instance)

const Mentor = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const response = await client.get('/api/admin/mentors');
        setMentors(response.data.mentors);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching mentors:', error);
        setLoading(false);
      }
    };

    fetchMentors();
  }, []);

  if (loading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Mentors</h2>
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center hover:bg-blue-700"
          onClick={() => navigate('/addmentor')}
        >
          <PlusCircle className="mr-2" size={20} /> Add New Mentor
        </button>
      </div>

      {/* Mentor Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mentors.map((mentor) => (
          <div
            key={mentor._id}
            className="bg-white shadow-lg rounded-lg overflow-hidden"
          >
            {/* Profile Picture */}
            <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
              <img
                src={mentor.Profile_Picture || 'https://via.placeholder.com/120'}
                alt="profile"
                className="w-24 h-24 object-cover rounded-full border-4 border-white shadow-md"
              />
            </div>

            {/* Mentor Info */}
            <div className="p-4">
              <h3 className="text-lg font-semibold">{mentor.namaUser}</h3>
              <p className="text-gray-500">
                Role: {mentor.roleType === 1 ? 'Mentor' : 'Other'}
              </p>
            </div>

            {/* Buttons */}
            <div className="p-4 border-t flex justify-between">
              <button
                className="bg-yellow-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-yellow-600"
                onClick={() => navigate(`/editmentor/${mentor._id}`)}
              >
                <Edit className="mr-2" size={16} /> Edit
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600"
                onClick={() => navigate(`/detailmentor/${mentor._id}`)}
              >
                <Info className="mr-2" size={16} /> Detail
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Mentor;
