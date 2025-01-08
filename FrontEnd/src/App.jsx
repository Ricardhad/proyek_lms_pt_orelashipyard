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

// import MentorPage from "./MentorPage/MentorPage";
// import MaterialsPage from "./MentorPage/MaterialPage";
// import InternsPage from "./MentorPage/InternsPage";

import InternProfile from "./InternPage/profile/page";
import InternMaterials from "./InternPage/material/page";
import InternHomework from "./InternPage/homework/page";
import InternEditProfile from "./InternPage/edit-profile/page";
import InternAnnouncements from "./InternPage/announcement/page";
import InternViewAnnouncement from "./InternPage/announcement/[id]/page";
import InternGroupChat from "./InternPage/group-chat/page";
import InternMaterialForm from "./InternPage/materials/[id]/form/page";
import InternMaterialZip from "./InternPage/materials/[id]/zip/page";

// Import the pages we created before
import MentorAnnouncementPage from "./MentorPage/announcement/page";
import MentorCreateAnnouncementPage from "./MentorPage/announcement/create/page";
import MentorEditAnnouncementPage from "./MentorPage/announcement/edit/[id]/page";
import MentorViewAnnouncementPage from "./MentorPage/announcement/[id]/page";
import MentorChatPage from "./MentorPage/chat/page";
import MentorInternDetailPage from "./MentorPage/interns/[id]/page";
import MentorInternsPage from "./MentorPage/interns/page";
import MentorMaterialsPage from "./MentorPage/materials/page";
import MentorAddMaterialPage from "./MentorPage/materials/add/page";
import MentorAddFormPage from "./MentorPage/materials/add/form/page";
import MentorZipSubmissionPage from "./MentorPage/materials/add/zip/page";
import MentorAttendancePage from "./MentorPage/materials/add/attendance/page";
import MentorCheckTugasPage from "./MentorPage/materials/check-tugas/[id]/page";
import MentorCheckLatihanPage from "./MentorPage/materials/check-latihan/[id]/page";
import MentorInternFormCheckPage from "./MentorPage/materials/check-latihan/[id]/[internId]/page";
import MentorProfilePage from "./MentorPage/profile/page";

import ProtectedRoute from './component/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Existing routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/test" element={<Test />} />
        <Route path="/home" element={<Home />} />
        <Route path="/listinterns" element={<ListInterns />} />
        <Route path="/edit/:userId" element={<EditUser />} />
        <Route path="/addmentor" element={<AddMentor />} />
        <Route path="/course" element={<Course />} />
        <Route path="/addcourse" element={<AddCourse />} />
        <Route path="/addannouncement" element={<AddAnnouncement />} />

        {/* <Route path="/homeMentor" element={<MentorPage />} />
        <Route path="/homeMentor/materials" element={<MaterialsPage />} />
        <Route path="/homeMentor/interns" element={<InternsPage />} /> */}
        {/* New routes for the pages we created before */}
        {/* <Route path="/homeMentor/announcements" element={<MentorAnnouncementPage />} />
        <Route path="/homeMentor/announcements/create" element={<MentorCreateAnnouncementPage />} />
        <Route path="/homeMentor/announcements/edit/:id" element={<MentorEditAnnouncementPage />} />
        <Route path="/homeMentor/announcements/:id" element={<MentorViewAnnouncementPage />} />
        <Route path="/homeMentor/chat" element={<MentorChatPage />} />
        <Route path="/homeMentor/interns/:id" element={<MentorInternDetailPage />} />
        <Route path="/homeMentor/interns" element={<MentorInternsPage />} />
        <Route path="/homeMentor/materials" element={<MentorMaterialsPage />} />
        <Route path="/homeMentor/materials/add" element={<MentorAddMaterialPage />} />
        <Route path="/homeMentor/materials/add/form" element={<MentorAddFormPage />} />
        <Route path="/homeMentor/materials/add/zip" element={<MentorZipSubmissionPage />} />
        <Route path="/homeMentor/materials/add/attendance" element={<MentorAttendancePage />} />
        <Route path="/homeMentor/materials/check-tugas/:id" element={<MentorCheckTugasPage />} />
        <Route path="/homeMentor/materials/check-latihan/:id" element={<MentorCheckLatihanPage />} />
        <Route path="/homeMentor/materials/check-latihan/:id/:internId" element={<MentorInternFormCheckPage />} />
        <Route path="/homeMentor/" element={<MentorProfilePage />} /> */}
        {/* Mentor Protected Routes */}
        <Route path="/homeMentor/announcements" element={<ProtectedRoute element={MentorAnnouncementPage} requiredRole={1} />} />
        <Route path="/homeMentor/announcements/create" element={<ProtectedRoute element={MentorCreateAnnouncementPage} requiredRole={1} />} />
        <Route path="/homeMentor/announcements/edit/:id" element={<ProtectedRoute element={MentorEditAnnouncementPage} requiredRole={1} />} />
        <Route path="/homeMentor/announcements/:id" element={<ProtectedRoute element={MentorViewAnnouncementPage} requiredRole={1} />} />
        <Route path="/homeMentor/chat" element={<ProtectedRoute element={MentorChatPage} requiredRole={1} />} />
        <Route path="/homeMentor/interns/:id" element={<ProtectedRoute element={MentorInternDetailPage} requiredRole={1} />} />
        <Route path="/homeMentor/interns" element={<ProtectedRoute element={MentorInternsPage} requiredRole={1} />} />
        <Route path="/homeMentor/materials" element={<ProtectedRoute element={MentorMaterialsPage} requiredRole={1} />} />
        <Route path="/homeMentor/materials/add" element={<ProtectedRoute element={MentorAddMaterialPage} requiredRole={1} />} />
        <Route path="/homeMentor/materials/add/form" element={<ProtectedRoute element={MentorAddFormPage} requiredRole={1} />} />
        <Route path="/homeMentor/materials/add/zip" element={<ProtectedRoute element={MentorZipSubmissionPage} requiredRole={1} />} />
        <Route path="/homeMentor/materials/add/attendance" element={<ProtectedRoute element={MentorAttendancePage} requiredRole={1} />} />
        <Route path="/homeMentor/materials/check-tugas/:id" element={<ProtectedRoute element={MentorCheckTugasPage} requiredRole={1} />} />
        <Route path="/homeMentor/materials/check-latihan/:id" element={<ProtectedRoute element={MentorCheckLatihanPage} requiredRole={1} />} />
        <Route path="/homeMentor/materials/check-latihan/:id/:internId" element={<ProtectedRoute element={MentorInternFormCheckPage} requiredRole={1} />} />
        <Route path="/homeMentor/" element={<ProtectedRoute element={MentorProfilePage} requiredRole={1} />} />


        {/* <Route path="/homeMagang/" element={<InternProfile />} />
        <Route path="/homeMagang/materials" element={<InternMaterials />} />
        <Route path="/homeMagang/homework" element={<InternHomework />} />
        <Route path="/homeMagang/edit-profile" element={<InternEditProfile />} />
        <Route path="/homeMagang/announcements" element={<InternAnnouncements />} />
        <Route path="/homeMagang/group-chat" element={<InternGroupChat />} />
        <Route path="/homeMagang/materials/:id/form" element={<MaterialForm />} />
        <Route path="/homeMagang/materials/:id/zip" element={<MaterialZip />} /> */}
        {/* Intern Protected Routes */}
        <Route path="/homeMagang/" element={<ProtectedRoute element={InternProfile} requiredRole={2} />} />
        <Route path="/homeMagang/materials" element={<ProtectedRoute element={InternMaterials} requiredRole={2} />} />
        <Route path="/homeMagang/homework" element={<ProtectedRoute element={InternHomework} requiredRole={2} />} />
        <Route path="/homeMagang/edit-profile" element={<ProtectedRoute element={InternEditProfile} requiredRole={2} />} />
        <Route path="/homeMagang/announcements" element={<ProtectedRoute element={InternAnnouncements} requiredRole={2} />} />
        <Route path="/homeMagang/announcements/:id" element={<ProtectedRoute element={InternViewAnnouncement} requiredRole={2} />} />
        <Route path="/homeMagang/group-chat" element={<ProtectedRoute element={InternGroupChat} requiredRole={2} />} />
        <Route path="/homeMagang/materials/:id/form" element={<ProtectedRoute element={InternMaterialForm} requiredRole={2} />} />
        <Route path="/homeMagang/materials/:id/zip" element={<ProtectedRoute element={InternMaterialZip} requiredRole={2} />} />

        
      </Routes>
    </Router>
  );
}

export default App;

