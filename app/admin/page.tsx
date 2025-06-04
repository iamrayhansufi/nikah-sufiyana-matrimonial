"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Users,
  UserCheck,
  CreditCard,
  Download,
  Send,
  Eye,
  CheckCircle,
  XCircle,
  TrendingUp,
  DollarSign,
  Activity,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Search, MoreHorizontal, Mail, Phone, MapPin } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function AdminDashboard() {
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [notificationMessage, setNotificationMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [subscriptionFilter, setSubscriptionFilter] = useState("all")
  const [selectedUsers, setSelectedUsers] = useState<number[]>([])

  const [pendingUsers, setPendingUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Remove mock stats and fetch real stats from API
  const [stats, setStats] = useState({
    totalRegistrations: 0,
    activeSubscriptions: 0,
    pendingApprovals: 0,
    totalRevenue: 0,
    monthlyGrowth: 0,
    successfulMatches: 0,
  })

  const subscriptions = [
    {
      id: 1,
      userName: "Omar Ali",
      plan: "Premium",
      amount: 2999,
      startDate: "2024-01-01",
      endDate: "2024-07-01",
      status: "active",
      paymentMethod: "UPI",
    },
    {
      id: 2,
      userName: "Mariam Sheikh",
      plan: "VIP",
      amount: 4999,
      startDate: "2024-01-05",
      endDate: "2025-01-05",
      status: "active",
      paymentMethod: "Credit Card",
    },
    {
      id: 3,
      userName: "Hassan Ibrahim",
      plan: "Premium",
      amount: 2999,
      startDate: "2023-12-15",
      endDate: "2024-06-15",
      status: "expiring",
      paymentMethod: "Net Banking",
    },
  ]

  const activeUsers = [
    {
      id: 1,
      name: "Zainab Ali",
      lastActive: "2 hours ago",
      profileViews: 45,
      interestsSent: 12,
      interestsReceived: 18,
      location: "Hyderabad",
    },
    {
      id: 2,
      name: "Yusuf Rahman",
      lastActive: "1 day ago",
      profileViews: 32,
      interestsSent: 8,
      interestsReceived: 15,
      location: "Chennai",
    },
  ]

  useEffect(() => {
    const fetchPendingUsers = async () => {
      setLoading(true)
      setError("")
      try {
        const res = await fetch("/api/admin/users?status=pending")
        if (!res.ok) throw new Error("Failed to fetch users")
        const data = await res.json()
        setPendingUsers(data.users || [])
      } catch (err: any) {
        setError(err.message || "Error loading users")
      } finally {
        setLoading(false)
      }
    }
    fetchPendingUsers()
  }, [])

  // Fetch real stats from API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats")
        if (!res.ok) throw new Error("Failed to fetch stats")
        const data = await res.json()
        setStats({
          totalRegistrations: data.totalRegistrations || 0,
          activeSubscriptions: data.activeSubscriptions || 0,
          pendingApprovals: data.pendingApprovals || 0,
          totalRevenue: data.totalRevenue || 0,
          monthlyGrowth: data.monthlyGrowth || 0,
          successfulMatches: data.successfulMatches || 0,
        })
      } catch (err) {
        // Optionally handle error
      }
    }
    fetchStats()
  }, [])

  const handleApproveProfile = (userId: number) => {
    console.log("Approving profile:", userId)
    // Handle profile approval
  }

  const handleRejectProfile = (userId: number) => {
    console.log("Rejecting profile:", userId)
    // Handle profile rejection
  }

  const handleSendNotification = () => {
    console.log("Sending notification:", notificationMessage)
    // Handle sending notification
    setNotificationMessage("")
  }

  const exportUserList = () => {
    console.log("Exporting user list as CSV")
    // Handle CSV export
  }

  const handleBulkApprove = () => {
    console.log("Bulk approving users:", selectedUsers)
    // Handle bulk approval logic
  }

  const handleBulkReject = () => {
    console.log("Bulk rejecting users:", selectedUsers)
    // Handle bulk rejection logic
  }

  const handleBulkEmail = () => {
    console.log("Sending email to users:", selectedUsers)
    // Handle sending email logic
  }

  // Admin authentication check
  const router = useRouter();
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem("adminToken") : null;
    if (!token) {
      router.replace("/admin/login");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50 dark:from-emerald-950 dark:to-amber-950">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 animate-fade-in">
            <h1 className="text-3xl font-bold font-heading mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground font-body">Manage users, subscriptions, and platform analytics</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
            <Card className="card-hover animate-slide-up animate-stagger-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground font-body">Total Users</p>
                    <p className="text-2xl font-bold font-heading">{stats.totalRegistrations.toLocaleString()}</p>
                  </div>
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover animate-slide-up animate-stagger-2">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground font-body">Active Subscriptions</p>
                    <p className="text-2xl font-bold font-heading">{stats.activeSubscriptions.toLocaleString()}</p>
                  </div>
                  <CreditCard className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover animate-slide-up animate-stagger-3">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground font-body">Pending Approvals</p>
                    <p className="text-2xl font-bold font-heading">{stats.pendingApprovals}</p>
                  </div>
                  <UserCheck className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover animate-slide-up animate-stagger-4">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground font-body">Total Revenue</p>
                    <p className="text-2xl font-bold font-heading">₹{(stats.totalRevenue / 100000).toFixed(1)}L</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover animate-slide-up animate-stagger-5">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground font-body">Monthly Growth</p>
                    <p className="text-2xl font-bold font-heading">+{stats.monthlyGrowth}%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover animate-slide-up animate-stagger-6">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground font-body">Success Matches</p>
                    <p className="text-2xl font-bold font-heading">{stats.successfulMatches}</p>
                  </div>
                  <Activity className="h-8 w-8 text-pink-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="users" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="users">User Management</TabsTrigger>
              <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
              <TabsTrigger value="approvals">Profile Approvals</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>

            {/* User Management Tab */}
            <TabsContent value="users">
              <Card className="animate-fade-in">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="font-heading">Recent Registrations</CardTitle>
                  <Button onClick={exportUserList} variant="outline" className="font-body">
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          placeholder="Search users by name, email, or phone..."
                          className="pl-10 font-body"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={subscriptionFilter} onValueChange={setSubscriptionFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by plan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Plans</SelectItem>
                        <SelectItem value="free">Free</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                        <SelectItem value="vip">VIP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {selectedUsers.length > 0 && (
                    <div className="flex items-center gap-4 p-4 bg-muted rounded-lg mb-4">
                      <span className="text-sm font-medium">{selectedUsers.length} users selected</span>
                      <Button size="sm" variant="outline" onClick={() => handleBulkApprove()}>
                        Bulk Approve
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleBulkReject()}>
                        Bulk Reject
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleBulkEmail()}>
                        Send Email
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setSelectedUsers([])}>
                        Clear Selection
                      </Button>
                    </div>
                  )}
                  <div className="space-y-4">
                    {pendingUsers
                      .filter((user) => {
                        const matchesSearch =
                          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.phone.includes(searchTerm)
                        const matchesStatus = statusFilter === "all" || user.status === statusFilter
                        const matchesSubscription =
                          subscriptionFilter === "all" || user.subscription === subscriptionFilter
                        return matchesSearch && matchesStatus && matchesSubscription
                      })
                      .map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center justify-between p-4 border rounded-lg card-hover"
                        >
                          <div className="flex items-center gap-4">
                            <input
                              type="checkbox"
                              checked={selectedUsers.includes(user.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedUsers([...selectedUsers, user.id])
                                } else {
                                  setSelectedUsers(selectedUsers.filter((id) => id !== user.id))
                                }
                              }}
                              className="rounded"
                            />
                            <Avatar>
                              <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={user.name} />
                              <AvatarFallback>
                                {user.name
                                  .split(" ")
                                  .map((n: string) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-semibold font-heading">{user.name}</h4>
                              <p className="text-sm text-muted-foreground font-body flex items-center gap-2">
                                <MapPin className="h-3 w-3" />
                                {user.age} years • {user.location}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground font-body">
                                <span className="flex items-center gap-1">
                                  <Mail className="h-3 w-3" />
                                  {user.email}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  {user.phone}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <Badge
                              variant={
                                user.subscription === "premium"
                                  ? "default"
                                  : user.subscription === "vip"
                                    ? "destructive"
                                    : "secondary"
                              }
                            >
                              {user.subscription}
                            </Badge>
                            <Badge
                              variant={
                                user.status === "approved"
                                  ? "default"
                                  : user.status === "pending"
                                    ? "secondary"
                                    : "destructive"
                              }
                            >
                              {user.status}
                            </Badge>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setSelectedUser(user)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Mail className="h-4 w-4 mr-2" />
                                  Send Email
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Phone className="h-4 w-4 mr-2" />
                                  Call User
                                </DropdownMenuItem>
                                {user.status === "pending" && (
                                  <>
                                    <DropdownMenuItem onClick={() => handleApproveProfile(user.id)}>
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                      Approve
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleRejectProfile(user.id)}>
                                      <XCircle className="h-4 w-4 mr-2" />
                                      Reject
                                    </DropdownMenuItem>
                                  </>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Subscriptions Tab */}
            <TabsContent value="subscriptions">
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="font-heading">Subscription Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {subscriptions.map((sub) => (
                      <div key={sub.id} className="flex items-center justify-between p-4 border rounded-lg card-hover">
                        <div>
                          <h4 className="font-semibold font-heading">{sub.userName}</h4>
                          <p className="text-sm text-muted-foreground font-body">
                            {sub.plan} Plan • ₹{sub.amount}
                          </p>
                          <p className="text-xs text-muted-foreground font-body">
                            {sub.startDate} to {sub.endDate}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge variant={sub.status === "active" ? "default" : "destructive"}>{sub.status}</Badge>
                          <span className="text-sm text-muted-foreground font-body">{sub.paymentMethod}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Profile Approvals Tab */}
            <TabsContent value="approvals">
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="font-heading">Pending Profile Approvals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pendingUsers.length === 0 && !loading && (
                      <p className="text-center text-muted-foreground font-body">No pending approvals</p>
                    )}
                    {pendingUsers.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-4 border rounded-lg card-hover"
                      >
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={user.name} />
                            <AvatarFallback>
                              {user.name
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold font-heading">{user.name}</h4>
                            <p className="text-sm text-muted-foreground font-body">
                              {user.age} years • {user.location}
                            </p>
                            <p className="text-xs text-muted-foreground font-body">Joined: {user.joinedDate}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleApproveProfile(user.id)}
                            className="gradient-primary text-white btn-hover font-body"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleRejectProfile(user.id)}
                            className="font-body"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                    {loading && (
                      <div className="flex justify-center py-4">
                        <span className="loader"></span>
                      </div>
                    )}
                    {error && (
                      <p className="text-red-500 text-center text-sm font-body">{error}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-heading">Most Active Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {activeUsers.map((user) => (
                        <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <h4 className="font-semibold font-heading">{user.name}</h4>
                            <p className="text-sm text-muted-foreground font-body">{user.location}</p>
                            <p className="text-xs text-muted-foreground font-body">Last active: {user.lastActive}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-body">Views: {user.profileViews}</p>
                            <p className="text-xs text-muted-foreground font-body">
                              Sent: {user.interestsSent} | Received: {user.interestsReceived}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="font-heading">Payment History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {subscriptions.slice(0, 3).map((payment) => (
                        <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <h4 className="font-semibold font-heading">{payment.userName}</h4>
                            <p className="text-sm text-muted-foreground font-body">{payment.plan} Plan</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold font-heading">₹{payment.amount}</p>
                            <p className="text-xs text-muted-foreground font-body">{payment.paymentMethod}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="font-heading">Send Notifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="notification-type" className="font-body">
                        Notification Type
                      </Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select notification type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Users</SelectItem>
                          <SelectItem value="premium">Premium Users Only</SelectItem>
                          <SelectItem value="free">Free Users Only</SelectItem>
                          <SelectItem value="inactive">Inactive Users</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="message" className="font-body">
                        Message
                      </Label>
                      <Textarea
                        id="message"
                        value={notificationMessage}
                        onChange={(e) => setNotificationMessage(e.target.value)}
                        placeholder="Enter your notification message..."
                        rows={4}
                        className="font-body"
                      />
                    </div>

                    <Button
                      onClick={handleSendNotification}
                      className="gradient-primary text-white btn-hover font-body"
                      disabled={!notificationMessage.trim()}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send Notification
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  )
}
