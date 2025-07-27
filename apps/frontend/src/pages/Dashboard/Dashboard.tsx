import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bot, Plus, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { chatbotApi } from "@/lib/api/chatbot";

interface Chatbot {
  id: string;
  name: string;
  description?: string;
  instructions: string;
  context?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

const Dashboard = () => {
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChatbots = async () => {
      try {
        const data = await chatbotApi.getChatbots();
        setChatbots(data);
      } catch (err) {
        setError("Failed to load chatbots");
        console.error("Error fetching chatbots:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChatbots();
  }, []);

  if (error) {
    return (
      <div className="text-center py-12">
        <Bot className="h-16 w-16 text-red-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Error loading chatbots
        </h3>
        <p className="text-gray-600 mb-6">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your chatbot assistants</p>
        </div>
        <Button asChild className="flex items-center space-x-2">
          <Link to="/create">
            <Plus className="h-4 w-4" />
            Create New Bot
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Bot className="h-8 w-8 text-gray-400 mx-auto mb-2 animate-pulse" />
            <p className="text-gray-600">Loading your chatbots...</p>
          </div>
        </div>
      ) : (
        <>
          {chatbots.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Bot className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Chatbots
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {chatbots.length}
                  </p>
                </div>
              </div>
            </div>
          )}

          {chatbots.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {chatbots.map((bot) => (
                <Link
                  key={bot.id}
                  to={`/chatbot/${bot.id}`}
                  className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow block"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">🤖</div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {bot.name}
                        </h3>
                        <div className="flex items-center mt-1">
                          <div className="h-2 w-2 rounded-full mr-2 bg-green-500" />
                          <span className="text-xs font-medium text-green-700">
                            Active
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4">
                    {bot.description || "No description provided"}
                  </p>

                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    <span>
                      Created {new Date(bot.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center pt-4 border-t border-gray-100">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      asChild
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Link to={`/chatbot/${bot.id}`}>View</Link>
                    </Button>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Bot className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No chatbots yet
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
        </>
      )}
    </div>
  );
};

export default Dashboard;
