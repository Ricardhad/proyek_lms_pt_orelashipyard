import React, { useState, useEffect } from "react";
import AddInterns from "./AddInterns";
import ListInterns from "./ListInterns"; 
import Course from "./Course"; // Tambahkan komponen Course
import Announcement from "./Announcement";
import Mentor from "./Mentor";
import client from "../client"; // Axios instance for API calls
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
            src="/placeholder.svg?height=80&width=80" 
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
