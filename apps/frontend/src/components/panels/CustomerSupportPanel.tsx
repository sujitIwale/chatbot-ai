import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Users, Plus, Mail } from "lucide-react";
import { chatbotApi } from "@/lib/api/chatbot";
import { useParams } from "react-router-dom";

interface CustomerSupportUser {
  id: string;
  name: string;
  email: string;
  ticketCount?: number;
}

const CustomerSupportPanel: React.FC = () => {
  const { id: chatbotId } = useParams<{ id: string }>();
  const [users, setUsers] = useState<CustomerSupportUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (chatbotId) {
      fetchUsers();
    }
  }, [chatbotId]);

  const fetchUsers = async () => {
    if (!chatbotId) return;

    try {
      setLoading(true);
      const data = await chatbotApi.getCustomerSupportUsers(chatbotId);
      setUsers(data);
    } catch (err) {
      setError("Failed to load support users");
      console.error("Error fetching support users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async () => {
    if (!chatbotId || !newUser.name.trim() || !newUser.email.trim()) return;

    try {
      setSubmitting(true);
      const createdUser = await chatbotApi.createCustomerSupportUser(
        chatbotId,
        {
          name: newUser.name.trim(),
          email: newUser.email.trim(),
        }
      );

      setUsers((prev) => [...prev, createdUser]);
      setNewUser({ name: "", email: "" });
      setIsAdding(false);
    } catch (err) {
      console.error("Error creating support user:", err);
      alert("Failed to add user. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelAdd = () => {
    setNewUser({ name: "", email: "" });
    setIsAdding(false);
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto p-6">
        <div className="text-center">
          <Users className="h-8 w-8 text-gray-400 mx-auto mb-2 animate-pulse" />
          <p className="text-gray-600">Loading support users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto p-6">
        <div className="text-center">
          <Users className="h-16 w-16 text-red-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Error loading users
          </h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={fetchUsers}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="text-center pb-4 border-b">
          <div className="p-3 bg-blue-100 rounded-lg w-12 h-12 mx-auto mb-3 flex items-center justify-center">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-1">
            Support Team
          </h2>
          <p className="text-sm text-gray-600">
            {users.length} team member{users.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Add New User Form */}
        {isAdding ? (
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h3 className="font-medium text-gray-900">Add New User</h3>
            <Input
              placeholder="Full Name"
              value={newUser.name}
              onChange={(e) =>
                setNewUser((prev) => ({ ...prev, name: e.target.value }))
              }
              className="bg-white"
            />
            <Input
              placeholder="Email Address"
              type="email"
              value={newUser.email}
              onChange={(e) =>
                setNewUser((prev) => ({ ...prev, email: e.target.value }))
              }
              className="bg-white"
            />
            <div className="flex space-x-2">
              <Button
                onClick={handleAddUser}
                disabled={
                  !newUser.name.trim() || !newUser.email.trim() || submitting
                }
                className="flex-1"
                size="sm"
              >
                {submitting ? "Adding..." : "Add User"}
              </Button>
              <Button
                onClick={handleCancelAdd}
                variant="outline"
                size="sm"
                disabled={submitting}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button
            onClick={() => setIsAdding(true)}
            className="w-full"
            variant="outline"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New User
          </Button>
        )}

        {/* Users List */}
        <div className="space-y-2">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">
                    {user.name}
                  </h3>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <Mail className="w-3 h-3 mr-1 flex-shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  {user.ticketCount !== undefined && (
                    <p className="text-xs text-gray-500 mt-1">
                      {user.ticketCount} assigned ticket
                      {user.ticketCount !== 1 ? "s" : ""}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {users.length === 0 && !isAdding && (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No team members yet
            </h3>
            <p className="text-gray-600 mb-4 text-sm">
              Add your first support team member to get started.
            </p>
            <Button onClick={() => setIsAdding(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add First Member
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerSupportPanel;
