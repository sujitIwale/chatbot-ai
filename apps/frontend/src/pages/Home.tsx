import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { isAuthenticated, tryLogout } from "../lib/utils/auth";
import { Button } from "@/components/ui/button";

const Home: React.FC = () => {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    setAuthenticated(isAuthenticated());
  }, []);

  const handleLogout = () => {
    tryLogout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Lyzr Chatbot</h1>
            </div>
            <div className="flex items-center space-x-4">
              {authenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Button variant="outline" asChild>
                  <Link to="/login">Login</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="relative bg-gradient-to-br from-indigo-50 via-white to-purple-50 overflow-hidden">
        <div className="absolute inset-0 bg-white/60"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20 sm:py-24 lg:py-32">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-4xl mb-4">
                🤖
              </div>
            </div>

            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="block">Create AI Chatbots</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                in Minutes
              </span>
            </h1>

            <p className="mt-6 max-w-3xl mx-auto text-lg text-gray-600 sm:text-xl md:text-2xl leading-relaxed">
              Transform your customer support with intelligent AI agents that
              work 24/7. Real plug-and-play solution that creates tickets
              automatically and assigns them to available team members
              instantly.
            </p>

            {/* Feature Highlights */}
            <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-gray-600">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 text-indigo-800">
                ⚡ Setup in 5 minutes
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-800">
                🔌 Zero coding required
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800">
                🎫 Auto ticket creation
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                👥 Smart agent assignment
              </span>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <div className="rounded-md shadow-lg">
                {authenticated ? (
                  <Link
                    to="/dashboard"
                    className="w-full flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 md:text-lg md:px-10 transition-all duration-200"
                  >
                    Go to Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className="w-full flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 md:text-lg md:px-10 transition-all duration-200"
                  >
                    Get Started Free
                  </Link>
                )}
              </div>
              <div className="">
                <a
                  href="#features"
                  className="w-full flex items-center justify-center px-8 py-4 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 md:text-lg md:px-10 transition-all duration-200"
                >
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="features" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">
              Features
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need for exceptional customer support
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Our platform provides a complete solution for modern customer
              support with AI-powered automation.
            </p>
          </div>

          <div className="mt-10">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <span className="text-xl">⚡</span>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                    Create Chatbots in Minutes
                  </p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Set up intelligent AI chatbots with zero coding required. Our
                  intuitive interface gets you up and running in under 5
                  minutes.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <span className="text-xl">🔌</span>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                    Real Plug & Play
                  </p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Embed anywhere with a simple script tag. Works seamlessly with
                  any website, CMS, or application.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <span className="text-xl">🎫</span>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                    Automatic Ticket Creation
                  </p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Complex queries are automatically converted into support
                  tickets with all conversation context preserved.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <span className="text-xl">👥</span>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                    Smart Agent Assignment
                  </p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Tickets are intelligently assigned to available team members
                  based on expertise and workload.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <span className="text-xl">🌍</span>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                    24/7 Availability
                  </p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Your AI agents work around the clock, ensuring customers
                  always get immediate responses.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <div className="bg-indigo-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            <span className="block">Ready to transform your support?</span>
            <span className="block text-indigo-600">
              Start building your AI agent today.
            </span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              {authenticated ? (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Get Started Free
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
