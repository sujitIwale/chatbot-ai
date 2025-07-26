import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Ticket,
  Plus,
  Calendar,
  User,
  Hash,
  Loader2,
  AlertTriangle,
  Mail,
} from "lucide-react";
import { chatbotApi } from "../../lib/api/chatbot";

interface AssignedUser {
  id: string;
  name: string;
  email: string;
}

interface TicketItem {
  id: string;
  subject: string;
  sessionId: string;
  chatbotId: string;
  assignedTo?: string;
  assignedUser?: AssignedUser;
  createdAt: string;
  updatedAt: string;
}

interface TicketsPanelProps {
  chatbotId: string;
}

const TicketsPanel: React.FC<TicketsPanelProps> = ({ chatbotId }) => {
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newTicket, setNewTicket] = useState({
    subject: "",
    sessionId: "",
    assignedTo: "",
  });

  useEffect(() => {
    fetchTickets();
  }, [chatbotId]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const data = await chatbotApi.getTickets(chatbotId);
      setTickets(data);
      setError(null);
    } catch (err) {
      setError("Failed to load tickets");
      console.error("Error fetching tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async () => {
    if (!newTicket.subject.trim() || !newTicket.sessionId.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      setCreating(true);
      const createdTicket = await chatbotApi.createTicket(chatbotId, {
        subject: newTicket.subject,
        sessionId: newTicket.sessionId,
        assignedTo: newTicket.assignedTo || undefined,
      });

      setTickets([createdTicket, ...tickets]);
      setNewTicket({ subject: "", sessionId: "", assignedTo: "" });
      setShowCreateModal(false);
    } catch (err) {
      alert("Failed to create ticket");
      console.error("Error creating ticket:", err);
    } finally {
      setCreating(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading tickets...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-red-500" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {error}
            </h2>
            <Button onClick={fetchTickets} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Support Tickets
            </h1>
            <p className="text-gray-600">
              Manage customer support tickets. {tickets.length} tickets total.
            </p>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Ticket
          </Button>
        </div>

        {/* Tickets Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {tickets.length === 0 ? (
            <div className="text-center py-12">
              <div className="p-4 bg-gray-50 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <Ticket className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No tickets found
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                You haven't created any support tickets yet. Create your first
                ticket to get started.
              </p>
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create First Ticket
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ticket
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Session ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assigned To
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Updated
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tickets.map((ticket) => (
                    <tr
                      key={ticket.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="p-2 bg-purple-100 rounded-lg mr-3">
                            <Ticket className="w-4 h-4 text-purple-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {ticket.subject}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center mt-1">
                              <Hash className="w-3 h-3 mr-1" />
                              {ticket.id.slice(0, 8)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 font-mono">
                          {ticket.sessionId}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {ticket.assignedUser ? (
                            <div className="flex items-start">
                              <div className="p-1 bg-blue-100 rounded mr-2 mt-0.5">
                                <User className="w-3 h-3 text-blue-600" />
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">
                                  {ticket.assignedUser.name}
                                </div>
                                <div className="text-xs text-gray-500 flex items-center">
                                  <Mail className="w-3 h-3 mr-1" />
                                  {ticket.assignedUser.email}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-400 italic">
                              Unassigned
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                          {formatDate(ticket.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                          {formatDate(ticket.updatedAt)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Create Ticket Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Create New Ticket
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <Input
                    value={newTicket.subject}
                    onChange={(e) =>
                      setNewTicket({ ...newTicket, subject: e.target.value })
                    }
                    placeholder="Enter ticket subject"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Session ID *
                  </label>
                  <Input
                    value={newTicket.sessionId}
                    onChange={(e) =>
                      setNewTicket({ ...newTicket, sessionId: e.target.value })
                    }
                    placeholder="Enter session ID"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assigned To (Optional)
                  </label>
                  <Input
                    value={newTicket.assignedTo}
                    onChange={(e) =>
                      setNewTicket({ ...newTicket, assignedTo: e.target.value })
                    }
                    placeholder="Enter user ID to assign"
                    className="w-full"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewTicket({
                      subject: "",
                      sessionId: "",
                      assignedTo: "",
                    });
                  }}
                  disabled={creating}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateTicket}
                  disabled={creating}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  {creating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Ticket
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketsPanel;
