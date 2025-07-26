import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Ticket,
  Search,
  Filter,
  Plus,
  MoreVertical,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface TicketItem {
  id: string;
  title: string;
  status: "open" | "in-progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  customer: string;
  createdAt: Date;
  updatedAt: Date;
}

const mockTickets: TicketItem[] = [
  {
    id: "1",
    title: "Unable to access chatbot interface",
    status: "open",
    priority: "high",
    customer: "John Doe",
    createdAt: new Date(2024, 0, 20),
    updatedAt: new Date(2024, 0, 20),
  },
  {
    id: "2",
    title: "Chatbot not responding correctly",
    status: "in-progress",
    priority: "medium",
    customer: "Jane Smith",
    createdAt: new Date(2024, 0, 19),
    updatedAt: new Date(2024, 0, 20),
  },
  {
    id: "3",
    title: "Integration API documentation request",
    status: "resolved",
    priority: "low",
    customer: "Mike Johnson",
    createdAt: new Date(2024, 0, 18),
    updatedAt: new Date(2024, 0, 19),
  },
];

const TicketsPanel: React.FC = () => {
  const [tickets] = useState<TicketItem[]>(mockTickets);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case "in-progress":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "resolved":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "closed":
        return <XCircle className="w-4 h-4 text-gray-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-red-100 text-red-800";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-blue-100 text-blue-800";
      case "low":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || ticket.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Ticket className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Support Tickets
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Manage and track customer support tickets. {filteredTickets.length}{" "}
            tickets total.
          </p>
        </div>

        {/* Search and Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tickets by title or customer..."
                className="pl-12 py-3 text-sm rounded-xl border-gray-200"
              />
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-purple-500 focus:ring-purple-500"
                >
                  <option value="all">All Status</option>
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl px-6 py-3">
                <Plus className="w-4 h-4 mr-2" />
                New Ticket
              </Button>
            </div>
          </div>
        </div>

        {/* Tickets Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-[1.02]"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    {getStatusIcon(ticket.status)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {ticket.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>{ticket.customer}</span>
                      <span>•</span>
                      <span>#{ticket.id}</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-gray-600"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      ticket.status
                    )}`}
                  >
                    {ticket.status.replace("-", " ")}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                      ticket.priority
                    )}`}
                  >
                    {ticket.priority}
                  </span>
                </div>
                <div className="text-right text-xs text-gray-500">
                  <p>Created: {ticket.createdAt.toLocaleDateString()}</p>
                  <p>Updated: {ticket.updatedAt.toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTickets.length === 0 && (
          <div className="text-center py-12">
            <div className="p-4 bg-gray-50 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <Ticket className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No tickets found
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {searchQuery || filterStatus !== "all"
                ? "No tickets match your current search and filter criteria. Try adjusting your filters."
                : "You haven't created any support tickets yet. Create your first ticket to get started."}
            </p>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl">
              <Plus className="w-4 h-4 mr-2" />
              Create First Ticket
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketsPanel;
