"use client";

export const dynamic = 'force-dynamic';

import { useState } from "react";
import {
  Search,
  Filter,
  MoreHorizontal,
  UserCheck,
  UserX,
  Mail,
  Eye,
  Edit,
  Shield,
  Crown
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "admin" | "contributor" | "user";
  status: "active" | "suspended" | "pending";
  joinDate: string;
  lastActive: string;
  downloads: number;
  uploads: number;
  revenue: number;
}

const sampleUsers: User[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@example.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
    role: "contributor",
    status: "active",
    joinDate: "2023-08-15",
    lastActive: "2024-01-20",
    downloads: 45,
    uploads: 156,
    revenue: 2340
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b96d10a0?w=100",
    role: "user",
    status: "active",
    joinDate: "2023-12-01",
    lastActive: "2024-01-19",
    downloads: 234,
    uploads: 0,
    revenue: 0
  },
  {
    id: "3",
    name: "Michael Chen",
    email: "m.chen@example.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    role: "admin",
    status: "active",
    joinDate: "2022-03-10",
    lastActive: "2024-01-20",
    downloads: 89,
    uploads: 45,
    revenue: 890
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    role: "contributor",
    status: "suspended",
    joinDate: "2023-06-20",
    lastActive: "2024-01-15",
    downloads: 23,
    uploads: 67,
    revenue: 445
  },
  {
    id: "5",
    name: "Alex Rodriguez",
    email: "alex.r@example.com",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100",
    role: "user",
    status: "pending",
    joinDate: "2024-01-18",
    lastActive: "2024-01-19",
    downloads: 5,
    uploads: 0,
    revenue: 0
  }
];

function UserCard({ user }: { user: User }) {
  const roleColors = {
    admin: "bg-purple-50 text-purple-700 border-purple-200",
    contributor: "bg-blue-50 text-blue-700 border-blue-200",
    user: "bg-gray-50 text-gray-700 border-gray-200"
  };

  const statusColors = {
    active: "bg-green-50 text-green-700 border-green-200",
    suspended: "bg-red-50 text-red-700 border-red-200",
    pending: "bg-yellow-50 text-yellow-700 border-yellow-200"
  };

  const roleIcons = {
    admin: Crown,
    contributor: UserCheck,
    user: Shield
  };

  const RoleIcon = roleIcons[user.role];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <img src={user.avatar} alt={user.name} className="rounded-full" />
          </Avatar>
          <div>
            <h3 className="font-medium text-gray-900">{user.name}</h3>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={roleColors[user.role]}>
            <RoleIcon className="mr-1 h-3 w-3" />
            {user.role}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Eye className="mr-2 h-4 w-4" />
                View Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Edit User
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Mail className="mr-2 h-4 w-4" />
                Send Message
              </DropdownMenuItem>
              {user.status === "active" ? (
                <DropdownMenuItem className="text-red-600">
                  <UserX className="mr-2 h-4 w-4" />
                  Suspend User
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem className="text-green-600">
                  <UserCheck className="mr-2 h-4 w-4" />
                  Activate User
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Badge variant="outline" className={statusColors[user.status]}>
          {user.status}
        </Badge>
        <span className="text-xs text-gray-500">
          Joined {new Date(user.joinDate).toLocaleDateString()}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-gray-900">{user.downloads}</div>
          <div className="text-xs text-gray-500">Downloads</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-purple-600">{user.uploads}</div>
          <div className="text-xs text-gray-500">Uploads</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-green-600">${user.revenue}</div>
          <div className="text-xs text-gray-500">Revenue</div>
        </div>
      </div>

      <div className="text-xs text-gray-400 mt-4">
        Last active: {new Date(user.lastActive).toLocaleDateString()}
      </div>
    </Card>
  );
}

export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredUsers = sampleUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus = filterStatus === "all" || user.status === filterStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage users, roles, and permissions</p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700">
          Invite User
        </Button>
      </div>

        {/* User Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{sampleUsers.length}</div>
            <div className="text-sm text-gray-500">Total Users</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {sampleUsers.filter(u => u.status === "active").length}
            </div>
            <div className="text-sm text-gray-500">Active</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {sampleUsers.filter(u => u.role === "contributor").length}
            </div>
            <div className="text-sm text-gray-500">Contributors</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {sampleUsers.filter(u => u.status === "pending").length}
            </div>
            <div className="text-sm text-gray-500">Pending</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {sampleUsers.filter(u => u.status === "suspended").length}
            </div>
            <div className="text-sm text-gray-500">Suspended</div>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search users by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="contributor">Contributor</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </Card>

        {/* Users List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Users ({filteredUsers.length})</h2>
            <div className="text-sm text-gray-500">
              Showing {filteredUsers.length} of {sampleUsers.length} users
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        </div>

      {filteredUsers.length === 0 && (
        <Card className="p-12 text-center">
          <div className="text-gray-400 mb-2">No users found</div>
          <p className="text-sm text-gray-500">Try adjusting your search or filter criteria</p>
        </Card>
      )}
    </div>
  );
}
