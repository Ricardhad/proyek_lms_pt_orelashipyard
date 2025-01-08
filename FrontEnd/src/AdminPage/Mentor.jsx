import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Mentor = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    // Fungsi untuk mengambil data mentor dari API
    const fetchMentors = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/admin/mentors'); // URL sesuai dengan endpoint Anda
        setMentors(response.data.mentors); // Menyimpan data mentor ke state
        setLoading(false); // Mengubah loading menjadi false setelah data diterima
      } catch (error) {
        console.error('Error fetching mentors:', error);
        setLoading(false); // Mengubah loading menjadi false jika ada error
      }
    };

    fetchMentors(); // Memanggil fungsi fetchMentors saat komponen pertama kali dirender
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Menampilkan loading jika data sedang diambil
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {mentors.map((mentor) => (
        <div
          key={mentor._id}
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '20px',
            marginRight: '20px',
            border: '1px solid #ddd',
            padding: '10px',
            borderRadius: '10px',
            width: '300px',
          }}
        >
          <div
            style={{
              borderRadius: '50%',
              width: '80px',
              height: '80px',
              backgroundColor: '#eee',
              marginRight: '20px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <img
              src={mentor.Profile_Picture || 'https://via.placeholder.com/80'}
              alt="profile"
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                objectFit: 'cover',
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <h3>{mentor.namaUser}</h3>
            <p>Role: {mentor.roleType === 1 ? 'Mentor' : 'Other'}</p>
          </div>
          
          {/* Tombol Add + di samping card */}
          <button
            style={{
              backgroundColor: '#28a745',
              color: '#fff',
              border: 'none',
              padding: '15px 25px',
              cursor: 'pointer',
              borderRadius: '5px',
              marginLeft: '20px',
              fontSize: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={() => alert('Add Mentor clicked')} // Ganti dengan logika yang sesuai jika diperlukan
          >
            +
          </button>
        </div>
      ))}
      
      {/* Tombol untuk menambahkan mentor baru */}
      <div
        style={{
          marginTop: '20px',
          textAlign: 'center',
        }}
      >
        <button
          style={{
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            padding: '15px 30px',
            cursor: 'pointer',
            borderRadius: '10px',
            fontSize: '20px',
          }}
          onClick={() => navigate('/addmentor')} // Navigasi ke halaman AddMentor
        >
          + Add New Mentor
        </button>
      </div>
    </div>
  );
};

export default Mentor;
