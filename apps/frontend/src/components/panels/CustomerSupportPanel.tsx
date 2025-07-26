import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Users,
  Search,
  Filter,
  Plus,
  MoreVertical,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  MessageCircle,
} from "lucide-react";

interface SupportUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "admin" | "agent" | "supervisor";
  status: "online" | "offline" | "away" | "busy";
  avatar?: string;
  department: string;
  joinedAt: Date;
  totalTickets: number;
  activeTickets: number;
}

const mockSupportUsers: SupportUser[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    phone: "+1 (555) 123-4567",
    role: "supervisor",
    status: "online",
    department: "Technical Support",
    joinedAt: new Date(2023, 5, 15),
    totalTickets: 245,
    activeTickets: 12,
  },
  {
    id: "2",
    name: "Mike Chen",
    email: "mike.chen@company.com",
    phone: "+1 (555) 234-5678",
    role: "agent",
    status: "busy",
    department: "Customer Service",
    joinedAt: new Date(2023, 8, 20),
    totalTickets: 189,
    activeTickets: 8,
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily.rodriguez@company.com",
    role: "agent",
    status: "away",
    department: "Technical Support",
    joinedAt: new Date(2024, 0, 10),
    totalTickets: 67,
    activeTickets: 5,
  },
  {
    id: "4",
    name: "David Kim",
    email: "david.kim@company.com",
    phone: "+1 (555) 345-6789",
    role: "admin",
    status: "online",
    department: "Administration",
    joinedAt: new Date(2023, 2, 1),
    totalTickets: 312,
    activeTickets: 3,
  },
];

const CustomerSupportPanel: React.FC = () => {
  const [users] = useState<SupportUser[]>(mockSupportUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <CheckCircle2 className="w-3 h-3 text-green-500" />;
      case "busy":
        return <XCircle className="w-3 h-3 text-red-500" />;
      case "away":
        return <Clock className="w-3 h-3 text-yellow-500" />;
      case "offline":
        return <XCircle className="w-3 h-3 text-gray-500" />;
      default:
        return <XCircle className="w-3 h-3 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-100 text-green-800";
      case "busy":
        return "bg-red-100 text-red-800";
      case "away":
        return "bg-yellow-100 text-yellow-800";
      case "offline":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800";
      case "supervisor":
        return "bg-blue-100 text-blue-800";
      case "agent":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus =
      filterStatus === "all" || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="p-3 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Customer Support Team
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Manage your customer support team members and track their
            performance. {filteredUsers.length} team members.
          </p>
        </div>

        {/* Search and Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search team members by name, email, or department..."
                className="pl-12 py-3 text-sm rounded-xl border-gray-200"
              />
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-green-500 focus:ring-green-500"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="supervisor">Supervisor</option>
                  <option value="agent">Agent</option>
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-green-500 focus:ring-green-500"
                >
                  <option value="all">All Status</option>
                  <option value="online">Online</option>
                  <option value="busy">Busy</option>
                  <option value="away">Away</option>
                  <option value="offline">Offline</option>
                </select>
              </div>
              <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 rounded-xl px-6 py-3">
                <Plus className="w-4 h-4 mr-2" />
                Add Member
              </Button>
            </div>
          </div>
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{user.name}</h3>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(user.status)}
                      <span className="text-sm text-gray-600 capitalize">
                        {user.status}
                      </span>
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

              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4 flex-shrink-0" />
                    <span>{user.phone}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4 flex-shrink-0" />
                  <span>Joined {user.joinedAt.toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      user.status
                    )}`}
                  >
                    {user.status}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(
                      user.role
                    )}`}
                  >
                    {user.role}
                  </span>
                </div>
              </div>

              <div className="text-xs text-gray-500 mb-3">
                <p className="font-medium">{user.department}</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm">
                  <div className="text-center">
                    <p className="font-semibold text-gray-900">
                      {user.activeTickets}
                    </p>
                    <p className="text-gray-500 text-xs">Active</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-gray-900">
                      {user.totalTickets}
                    </p>
                    <p className="text-gray-500 text-xs">Total</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="rounded-lg">
                  <MessageCircle className="w-4 h-4 mr-1" />
                  Message
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <div className="p-4 bg-gray-50 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <Users className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No team members found
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {searchQuery || filterRole !== "all" || filterStatus !== "all"
                ? "No team members match your current search and filter criteria. Try adjusting your filters."
                : "You haven't added any team members yet. Add your first team member to get started."}
            </p>
            <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 rounded-xl">
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
