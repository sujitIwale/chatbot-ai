import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AuthSuccess from "./pages/AuthSuccess";
import AuthProvider from "./lib/contexts/auth/AuthProvider";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth/success" element={<AuthSuccess />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
