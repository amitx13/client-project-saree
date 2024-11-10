import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChevronLeft, ChevronRight, Search, UserPlus } from "lucide-react"

type User = {
  id: number
  name: string
  email: string
  registrationDate: string
  status: "Active" | "Inactive"
  referrer: string
  earnings: number
  referrals: { month: string; count: number }[]
}

const users: User[] = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@example.com",
    registrationDate: "2023-05-15",
    status: "Active",
    referrer: "Bob Smith",
    earnings: 520,
    referrals: [
      { month: "Jan", count: 3 },
      { month: "Feb", count: 5 },
      { month: "Mar", count: 2 },
      { month: "Apr", count: 7 },
      { month: "May", count: 4 },
      { month: "Jun", count: 6 },
    ],
  },
  {
    id: 2,
    name: "Charlie Brown",
    email: "charlie@example.com",
    registrationDate: "2023-06-01",
    status: "Inactive",
    referrer: "Diana Ross",
    earnings: 150,
    referrals: [
      { month: "Jan", count: 1 },
      { month: "Feb", count: 2 },
      { month: "Mar", count: 0 },
      { month: "Apr", count: 3 },
      { month: "May", count: 1 },
      { month: "Jun", count: 2 },
    ],
  },
  {
    id: 3,
    name: "Eva Green",
    email: "eva@example.com",
    registrationDate: "2023-06-15",
    status: "Active",
    referrer: "Frank White",
    earnings: 300,
    referrals: [
      { month: "Jan", count: 2 },
      { month: "Feb", count: 3 },
      { month: "Mar", count: 1 },
      { month: "Apr", count: 4 },
      { month: "May", count: 2 },
      { month: "Jun", count: 3 },
    ],
  },
  {
    id: 4,
    name: "David Lee",
    email: "david@example.com",
    registrationDate: "2023-07-01",
    status: "Active",
    referrer: "Grace Kim",
    earnings: 450,
    referrals: [
      { month: "Jan", count: 4 },
      { month: "Feb", count: 6 },
      { month: "Mar", count: 3 },
      { month: "Apr", count: 5 },
      { month: "May", count: 7 },
      { month: "Jun", count: 4 },
    ],
  },
  {
    id: 5,
    name: "Fiona Black",
    email: "fiona@example.com",
    registrationDate: "2023-07-15",
    status: "Inactive",
    referrer: "Henry Gold",
    earnings: 200,
    referrals: [
      { month: "Jan", count: 1 },
      { month: "Feb", count: 0 },
      { month: "Mar", count: 2 },
      { month: "Apr", count: 1 },
      { month: "May", count: 3 },
      { month: "Jun", count: 1 },
    ],
  },
]

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [showInactive, setShowInactive] = useState(false)
  const usersPerPage = 5

  const filteredUsers = users.filter(
    (user) =>
      (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (showInactive ? user.status === "Inactive" : user.status === "Active")
  )

  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)

  const toggleUserStatus = (userId: number) => {
    // In a real application, you would update the user's status in your backend here
    console.log(`Toggling status for user ${userId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-blue-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="bg-gradient-to-r from-pink-500 to-purple-500 text-white p-6 rounded-t-lg">
          <h1 className="text-2xl sm:text-3xl font-bold">User Management</h1>
          <p className="text-pink-100 mt-2">Manage and track user information</p>
        </header>
        <main className="bg-white/80 backdrop-blur-sm shadow-xl p-4 sm:p-6 rounded-b-lg">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
            <Button 
              onClick={() => {setShowInactive(false); setCurrentPage(1);}}
              className={`flex-1 ${!showInactive ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' : 'bg-gray-200 text-gray-800'}`}
              variant={"outline"}
            >
              Active Users
            </Button>
            <Button 
              onClick={() => {setShowInactive(true); setCurrentPage(1);}}
              className={`flex-1 ${showInactive ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' : 'bg-gray-200 text-gray-800'}`}
              variant={"outline"}
            >
              Inactive Users
            </Button>
          </div>
          <div className="flex justify-between items-center mb-4">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search by name or email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 max-w-sm"
              />
            </div>
            <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white">
              <UserPlus className="mr-2 h-4 w-4" /> Add New User
            </Button>
          </div>
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Registration Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Referrer</TableHead>
                  <TableHead>Earnings</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.registrationDate}</TableCell>
                    <TableCell>
                      <Badge
                        variant={user.status === "Active" ? "default" : "destructive"}
                        className={user.status === "Active" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.referrer}</TableCell>
                    <TableCell>${user.earnings}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={user.status === "Active"}
                          onCheckedChange={() => toggleUserStatus(user.id)}
                        />
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedUser(user)}
                            >
                              Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>{user.name}</DialogTitle>
                              <DialogDescription>
                                User details and referral information
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="email" className="text-right">
                                  Email
                                </Label>
                                <div className="col-span-3">{user.email}</div>
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="status" className="text-right">
                                  Status
                                </Label>
                                <div className="col-span-3">
                                  <Badge
                                    variant={user.status === "Active" ? "default" : "destructive"}
                                    className={user.status === "Active" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}
                                  >
                                    {user.status}
                                  </Badge>
                                </div>
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="earnings" className="text-right">
                                  Earnings
                                </Label>
                                <div className="col-span-3">${user.earnings}</div>
                              </div>
                            </div>
                            <div className="mt-4">
                              <h4 className="text-sm font-medium mb-2">Referral History</h4>
                              <ChartContainer
                                config={{
                                  count: {
                                    label: "Referral Count",
                                    color: "hsl(var(--chart-1))",
                                  },
                                }}
                                className="h-[200px]"
                              >
                                <ResponsiveContainer width="100%" height="100%">
                                  <BarChart data={user.referrals}>
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
                                  </BarChart>
                                </ResponsiveContainer>
                              </ChartContainer>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
            <Button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white w-full sm:w-auto"
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
            <span className="text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
            <Button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white w-full sm:w-auto"
            >
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </main>
      </div>
    </div>
  )
}