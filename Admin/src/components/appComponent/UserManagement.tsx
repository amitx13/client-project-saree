"use client"

import { useState } from "react"
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

// Sample user data
const users = [
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
  // Add more sample users as needed
]

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState<typeof users[0] | null>(null)

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const toggleUserStatus = (userId:number) => {
    // In a real application, you would update the user's status in your backend here
    console.log(`Toggling status for user ${userId}`)
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-5">User Management</h1>
      <div className="mb-4">
        <Label htmlFor="search">Search Users</Label>
        <Input
          id="search"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
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
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.registrationDate}</TableCell>
                <TableCell>
                  <Badge
                    variant={user.status === "Active" ? "default" : "destructive"}
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
                                variant={
                                  user.status === "Active" ? "default" : "destructive"
                                }
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
    </div>
  )
}