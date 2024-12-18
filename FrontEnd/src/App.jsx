import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/LoginForm";
import Register from "./pages/RegisterForm";
import Test from "./pages/Test";
import Home from "./AdminPage/Home";
// import HomeMagang from "./pages/HomeMagang";
// import HomeMentor from "./pages/HomeMentor";

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
        {/* <Route path="/homeMagang" element={<HomeMagang />} />
        <Route path="/homeMentor" element={<HomeMentor />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
