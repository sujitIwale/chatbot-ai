import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AuthSuccess from "./pages/AuthSuccess";
import AuthProvider from "./lib/contexts/auth/AuthProvider";
import CreateChatBot from "./pages/CreateChatBot/CreateChatBot";
import ChatBot from "./pages/ChatBot/ChatBot";
import ChatBotTickets from "./pages/ChatBot/ChatBotTickets";
import ChatBotSupport from "./pages/ChatBot/ChatBotSupport";
import ChatBotEmbed from "./pages/ChatBot/ChatBotEmbed";
import PrivateRoute from "./components/routes/PrivateRoute";
import GuestRoute from "./components/routes/GuestRoute";
import AppLayout from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard/Dashboard";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<GuestRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth/success" element={<AuthSuccess />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create" element={<CreateChatBot />} />
            <Route path="/chatbot/:id" element={<ChatBot />} />
            <Route path="/chatbot/:id/tickets" element={<ChatBotTickets />} />
            <Route path="/chatbot/:id/support" element={<ChatBotSupport />} />
            <Route path="/chatbot/:id/embed" element={<ChatBotEmbed />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
