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
  
      </Routes>
    </Router>
  );
}

export default App;
