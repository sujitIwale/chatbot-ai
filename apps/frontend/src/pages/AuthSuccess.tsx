import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { handleGoogleAuthCallback } from "../lib/utils/auth";

const AuthSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      try {
        handleGoogleAuthCallback(token);
        setStatus("success");

        setTimeout(() => {
          navigate("/", { replace: true });
        }, 2000);
      } catch (error) {
        console.error("Error handling auth callback:", error);
        setStatus("error");
      }
    } else {
      setStatus("error");
    }
  }, [searchParams, navigate]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Completing sign in...</p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="rounded-full h-12 w-12 bg-green-100 mx-auto flex items-center justify-center">
            <svg
              className="h-6 w-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
          <h2 className="mt-4 text-xl font-semibold text-gray-900">
            Sign in successful!
          </h2>
          <p className="mt-2 text-gray-600">Redirecting you to the app...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="rounded-full h-12 w-12 bg-red-100 mx-auto flex items-center justify-center">
          <svg
            className="h-6 w-6 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </div>
        <h2 className="mt-4 text-xl font-semibold text-gray-900">
          Sign in failed
        </h2>
        <p className="mt-2 text-gray-600">
          There was an error completing your sign in.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Try again
        </button>
      </div>
    </div>
  );
};

export default AuthSuccess;
