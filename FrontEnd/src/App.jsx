import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/LoginForm";
import Register from "./pages/RegisterForm";

function App() {
  return (
    <Router>
      <Routes>
        {/* Route ke halaman Login */}
        <Route path="/" element={<Login />} />

        {/* Route ke halaman Register */}
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
