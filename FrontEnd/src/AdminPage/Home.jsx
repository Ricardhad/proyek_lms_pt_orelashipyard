import React, { useState, useEffect } from "react";
import AddInterns from "./AddInterns";
import ListInterns from "./ListInterns"; 
import Course from "./Course"; // Tambahkan komponen Course
import Announcement from "./Announcement";
import Mentor from "./Mentor";
import client from "@client"; // Axios instance for API calls
import { useNavigate } from "react-router-dom"; // Untuk navigasi logout
import { UserPlus, Users, BookOpen, Calendar, Bell } from 'lucide-react';

const Home = () => {
  const [currentPage, setCurrentPage] = useState("add-interns");
  const [userName, setUserName] = useState(""); // State untuk menyimpan namaUser
  const navigate = useNavigate();

  // Fungsi untuk mengambil data user
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token"); // Ambil token dari localStorage
  
        if (!token) {
          console.error("User is not logged in.");
          setUserName("Guest");
          return;
        }
  
        const response = await client.get("/api/user/all", {
          headers: {
            Authorization: `Bearer ${token}`, // Kirim token di header Authorization
          },
        });
  
        const users = response.data;
  
        if (users && users.length > 0) {
          setUserName(users[0].namaUser); // Mengambil namaUser pengguna pertama
        } else {
          console.warn("No users found");
          setUserName("Guest"); // Default value jika tidak ada user
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setUserName("Guest"); // Default value jika terjadi error
      }
    };
  
    fetchUserData();
  }, []);

  // Fungsi logout
  const handleLogout = () => {
    localStorage.removeItem("token"); // Hapus token atau sesi
    navigate("/"); // Arahkan kembali ke halaman login
  };

  // Fungsi untuk merender halaman berdasarkan state
  const renderPage = () => {
    switch (currentPage) {
      case "add-interns":
        return <AddInterns />;
      case "interns":
        return <ListInterns />;
      case "courses":
        return <Course />;
      case "announcement":
        return <Announcement />; 
      case "mentors":
        return <Mentor />; 
      default:
        return <AddInterns />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md fixed top-0 left-0 h-full z-10">
        <div className="p-4">
          <img 
            src="data:image/webp;base64,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" 
            alt="Logo" 
            className="w-20 h-20 rounded-full mb-4"
          />
          <h2 className="text-xl font-semibold mb-6">Menu</h2>
          <nav className="space-y-2">
            <SidebarItem icon={<UserPlus />} text="Add Interns" onClick={() => setCurrentPage("add-interns")} />
            <SidebarItem icon={<Users />} text="Interns" onClick={() => setCurrentPage("interns")} />
            <SidebarItem icon={<Users />} text="Mentors" onClick={() => setCurrentPage("mentors")} />
            <SidebarItem icon={<BookOpen />} text="Courses" onClick={() => setCurrentPage("courses")} />
            <SidebarItem icon={<Calendar />} text="Schedule" onClick={() => setCurrentPage("schedule")} />
            <SidebarItem icon={<Bell />} text="Add Announcement" onClick={() => setCurrentPage("announcement")} />
          </nav>
        </div>

        {/* User Data di bawah menu */}
        <div className="mt-6 text-center">
          
          <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded-full text-sm">
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-6">
        {renderPage()}
      </main>
    </div>
  );
};

// Sidebar Item Component
const SidebarItem = ({ icon, text, onClick }) => (
  <a
    href="#"
    onClick={onClick}
    className="flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors text-gray-600 hover:bg-gray-50"
  >
    <span className="w-5 h-5">{icon}</span>
    <span>{text}</span>
  </a>
);

export default Home;
