import { Link } from "react-router-dom";
import { Bot, Plus, MessageCircle, Calendar, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockChatBots = [
  {
    id: 1,
    name: "Customer Support Bot",
    description: "Handles customer inquiries and support tickets",
    status: "active",
    conversations: 245,
    lastActive: "2 hours ago",
    avatar: "🤖",
  },
  {
    id: 2,
    name: "Sales Assistant",
    description: "Helps qualify leads and answer product questions",
    status: "active",
    conversations: 89,
    lastActive: "1 day ago",
    avatar: "💼",
  },
  {
    id: 3,
    name: "FAQ Bot",
    description: "Answers frequently asked questions about our services",
    status: "inactive",
    conversations: 156,
    lastActive: "1 week ago",
    avatar: "❓",
  },
];

const ChatBots = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Chat Bots</h1>
          <p className="text-gray-600 mt-1">
            Manage and monitor your chatbot assistants
          </p>
        </div>
        <Button asChild className="flex items-center space-x-2">
          <Link to="/create">
            <Plus className="h-4 w-4" />
            <span>Create New Bot</span>
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Bot className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Bots</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockChatBots.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <MessageCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Active Conversations
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {mockChatBots.reduce((sum, bot) => sum + bot.conversations, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Bots</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockChatBots.filter((bot) => bot.status === "active").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Bots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockChatBots.map((bot) => (
          <div
            key={bot.id}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            {/* Bot Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{bot.avatar}</div>
                <div>
                  <h3 className="font-semibold text-gray-900">{bot.name}</h3>
                  <div className="flex items-center mt-1">
                    <div
                      className={`h-2 w-2 rounded-full mr-2 ${
                        bot.status === "active" ? "bg-green-500" : "bg-gray-400"
                      }`}
                    />
                    <span
                      className={`text-xs font-medium ${
                        bot.status === "active"
                          ? "text-green-700"
                          : "text-gray-500"
                      }`}
                    >
                      {bot.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>
              <button className="p-1 hover:bg-gray-100 rounded">
                <MoreVertical className="h-4 w-4 text-gray-400" />
              </button>
            </div>

            {/* Bot Description */}
            <p className="text-gray-600 text-sm mb-4">{bot.description}</p>

            {/* Bot Stats */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-gray-500">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  <span>{bot.conversations}</span>
                </div>
                <div className="flex items-center text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{bot.lastActive}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-gray-100">
              <Button variant="outline" size="sm" className="flex-1">
                Configure
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                View Chats
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State - Show when no bots exist */}
      {mockChatBots.length === 0 && (
        <div className="text-center py-12">
          <Bot className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No chat bots yet
          </h3>
          <p className="text-gray-600 mb-6">
            Create your first chatbot to get started with automated
            conversations.
          </p>
          <Button asChild>
            <Link to="/create">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Bot
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default ChatBots;
