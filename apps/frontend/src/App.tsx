import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AuthSuccess from "./pages/AuthSuccess";
import AuthProvider from "./lib/contexts/auth/AuthProvider";
import CreateChatBot from "./pages/CreateChatBot/CreateChatBot";
import PrivateRoute from "./components/routes/PrivateRoute";
import AppLayout from "./components/layout/AppLayout";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth/success" element={<AuthSuccess />} />
        <Route path="/" element={<Home />} />
        <Route element={<PrivateRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/create" element={<CreateChatBot />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
