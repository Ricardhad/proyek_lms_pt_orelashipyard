import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/LoginForm";
import Register from "./pages/RegisterForm";
import Test from "./pages/Test";
import Home from "./AdminPage/Home";
import ListInterns from "./AdminPage/ListInterns";
import DetailIntern from "./AdminPage/DetailIntern"; 
import EditUser from "./AdminPage/EditUser"; 
import AddMentor from "./AdminPage/AddMentor";
import Course from "./AdminPage/Course";
import AddCourse from "./AdminPage/AddCourse";
import AddAnnouncement from "./AdminPage/AddAnouncement";
import EditMentor from "./AdminPage/EditMentor";
import DetailMentor from "./AdminPage/DetailMentor";
import PopUp from "./AdminPage/PopUp";


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
import InternMaterialAttendance from "./InternPage/materials/[id]/attendance/page";

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
import MentorCheckAttendancePage from "./MentorPage/materials/check-attendance/[id]/page";  
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
        <Route path="/home" element={<ProtectedRoute  element={Home}requiredRole={0}/>}/>
        <Route path="/listinterns" element={<ListInterns />} />
        <Route path="/edit/:userId" element={<ProtectedRoute  element={EditUser}requiredRole={0}/>} />
        <Route path="/addmentor" element={<ProtectedRoute  element={AddMentor} requiredRole={0}/>} />
        <Route path="/course" element={<ProtectedRoute  element={Course} requiredRole={0}/>} />
        <Route path="/addcourse" element={<ProtectedRoute  element={AddCourse} requiredRole={0}/>} />
        <Route path="/addannouncement" element={<ProtectedRoute  element={AddAnnouncement} requiredRole={0}/>} />
        <Route path="/detail/:id" element={<ProtectedRoute  element={DetailIntern} requiredRole={0}/>}  />
        <Route path="/editmentor/:id" element={<ProtectedRoute  element={EditMentor} requiredRole={0}/>} />
        <Route path="/detailmentor/:id" element={<ProtectedRoute  element={DetailMentor} requiredRole={0}/>} />
        <Route path="/popup" element={<PopUp />} />

        
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
        <Route path="/homeMentor/materials/check-attendance/:id" element={<ProtectedRoute element={MentorCheckAttendancePage} requiredRole={1} />} />
        <Route path="/homeMentor/materials/check-tugas/:id" element={<ProtectedRoute element={MentorCheckTugasPage} requiredRole={1} />} />
        <Route path="/homeMentor/materials/check-latihan/:id" element={<ProtectedRoute element={MentorCheckLatihanPage} requiredRole={1} />} />
        <Route path="/homeMentor/materials/check-latihan/:id/:internId" element={<ProtectedRoute element={MentorInternFormCheckPage} requiredRole={1} />} />
        <Route path="/homeMentor/" element={<ProtectedRoute element={MentorProfilePage} requiredRole={1} />} />

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
        <Route path="/homeMagang/materials/:id/attendance" element={<ProtectedRoute element={InternMaterialAttendance} requiredRole={2} />} />
        
      </Routes>
    </Router>
  );
}

export default App;

