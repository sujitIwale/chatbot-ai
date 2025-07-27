import React from "react";
import { loginWithGoogle } from "../lib/utils/auth";
import { Bot } from "lucide-react";
import { Link } from "react-router-dom";

const Login: React.FC = () => {
  const handleGoogleLogin = () => {
    loginWithGoogle();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-center gap-6">
        <Link to="/">
          <div className="flex items-center space-x-2">
            <Bot className="h-8 w-8 text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-900">
              Lyzr Chatbot
            </h1>
          </div>
        </Link>
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Sign in to your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Welcome to Lyzr Chatbot
            </p>
          </div>

          <div className="mt-8">
            <button
              onClick={handleGoogleLogin}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md border-gray-300"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <img src="/google.svg" alt="Google" className="h-5 w-5" />
              </span>
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
