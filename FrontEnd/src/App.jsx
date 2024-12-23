import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/LoginForm";
import Register from "./pages/RegisterForm";
import Test from "./pages/Test";
import Home from "./AdminPage/Home";
import ListInterns from "./AdminPage/ListInterns"; 
import EditUser from "./AdminPage/EditUser"; 
import AddMentor from "./AdminPage/AddMentor";
import Course from "./AdminPage/Course";
import AddCourse from "./AdminPage/AddCourse";
import AddAnnouncement from "./AdminPage/AddAnouncement";


import MentorPage from "./MentorPage/MentorPage"; // Import MentorPage
import MaterialsPage from "./MentorPage/MaterialPage"; // Import MaterialsPage
import InternsPage from "./MentorPage/InternsPage"; // Import InternsPage


import InternProfile from "./InternPage/profile/page";
import InternMaterials from "./InternPage/material/page";
import InternHomework from "./InternPage/homework/page";
import InternEditProfile from "./InternPage/edit-profile/page";
import InternAnnouncements from "./InternPage/announcement/page";
import InternGroupChat from "./InternPage/group-chat/page";
import MaterialForm from "./InternPage/materials/[id]/form/page";
import MaterialZip from "./InternPage/materials/[id]/zip/page";

function App() {
  return (
    <Router>
      <Routes>
        {/* Route ke halaman Login */}
        <Route path="/" element={<Login />} />

        {/* Route ke halaman Register */}
        <Route path="/register" element={<Register />} />
        <Route path="/test" element={<Test />} />
        <Route path="/home" element={<Home />} />
        <Route path="/listinterns" element={<ListInterns />} />
        <Route path="/edit/:userId" element={<EditUser />} />
        <Route path="/addmentor" element={<AddMentor />} />
        <Route path="/course" element={<Course />} />
        <Route path="/addcourse" element={<AddCourse />} />
        <Route path="/addannouncement" element={<AddAnnouncement />} />

        <Route path="/homeMentor" element={<MentorPage />} />
        <Route path="/homeMentor/materials" element={<MaterialsPage />} /> {/* Materials page */}
        <Route path="/homeMentor/interns" element={<InternsPage />} /> {/* Interns page */}


        {/* New routes for our previously created pages */}
        <Route path="/homeMagang/" element={<InternProfile />} />
        <Route path="/homeMagang/materials" element={<InternMaterials />} />
        <Route path="/homeMagang/homework" element={<InternHomework />} />
        <Route path="/homeMagang/edit-profile" element={<InternEditProfile />} />
        <Route path="/homeMagang/announcements" element={<InternAnnouncements />} />
        <Route path="/homeMagang/group-chat" element={<InternGroupChat />} />
        <Route path="/homeMagang/materials/:id/form" element={<MaterialForm />} />
        <Route path="/homeMagang/materials/:id/zip" element={<MaterialZip />} />
      </Routes>
    </Router>
  );
}

export default App;
