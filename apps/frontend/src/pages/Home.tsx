import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { isAuthenticated, logout } from "../lib/utils/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const Home: React.FC = () => {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    setAuthenticated(isAuthenticated());
  }, []);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Agentic Chat</h1>
            </div>
            <div className="flex items-center space-x-4">
              {authenticated ? (
                <button
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
      <div className="space-y-4">
        <Button>Default Button</Button>
        <Button variant="secondary">Secondary Button</Button>
        <Button variant="outline">Outline Button</Button>
        <Button variant="destructive">Delete</Button>
        <Button size="sm">Small Button</Button>
        <Button size="lg">Large Button</Button>
      </div>

      <div className="space-y-4 mt-8">
        <h2 className="text-xl font-semibold">Input Examples</h2>
        <Input type="text" placeholder="Enter your name..." />
        <Input type="email" placeholder="Enter your email..." />
        <Input type="password" placeholder="Enter your password..." />
        <Input type="text" placeholder="Disabled input" disabled />
      </div>

      <div className="space-y-4 mt-8">
        <h2 className="text-xl font-semibold">Textarea Examples</h2>
        <Textarea placeholder="Enter your message..." />
        <Textarea placeholder="Disabled textarea" disabled />
        <Textarea placeholder="Custom size textarea with rows" rows={5} />
      </div>

      <div className="space-y-4 mt-8 max-w-md">
        <h2 className="text-xl font-semibold">Complete Form Example</h2>
        <form className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Name
            </label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email address"
              required
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-2">
              Message
            </label>
            <Textarea
              id="message"
              placeholder="Enter your message here..."
              rows={4}
              required
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit">Submit</Button>
            <Button type="reset" variant="outline">
              Reset
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Home;
