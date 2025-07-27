import { ChevronDown, LogOut, User, LayoutDashboard, Bot } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/contexts/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigationItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
];

const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <Bot className="h-8 w-8 text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-900">
              Lyzr Chatbot
            </h1>
          </div>

          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <item.icon
                    className={cn(
                      "mr-2 h-4 w-4 flex-shrink-0",
                      isActive
                        ? "text-blue-700"
                        : "text-gray-400 group-hover:text-gray-500"
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <div className="md:hidden"></div>

          <div className="flex items-center space-x-3">
            <div className="hidden lg:block text-right">
              <p className="text-sm font-medium text-gray-900">
                {user?.name || user?.email || "User"}
              </p>
              <p className="text-xs text-gray-500">
                {user?.email || "user@example.cdfaom"}
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
