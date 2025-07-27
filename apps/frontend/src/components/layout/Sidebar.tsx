import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

const navigationItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Your Chat Bots",
    href: "/chatbots",
    icon: Bot,
  },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-gray-200">
      {/* Logo/Brand */}
      <div className="flex h-16 items-center justify-center border-b border-gray-200 px-6">
        <div className="flex items-center space-x-2">
          <Bot className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-900">Lyzr Chatbot</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon
                className={cn(
                  "mr-3 h-5 w-5 flex-shrink-0",
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
  );
};

export default Sidebar;
