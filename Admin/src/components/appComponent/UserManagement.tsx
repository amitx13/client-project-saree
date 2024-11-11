import { useEffect, useState } from "react"
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
import { ChevronLeft, ChevronRight, IndianRupee, Search} from "lucide-react"
import { useFetchAllUsers } from "@/hooks/useFetchAllUsers"
import { useUserState } from "@/recoil/user"
import { useActivateUserAccount } from "@/hooks/useActivateUserAccount"
import { toast } from "@/hooks/use-toast"

type Users = {
  id: string
  name: string
  email: string
  registrationDate: string
  status: boolean
  referrer: string
  referrals: { email: string, status: boolean }[]
  walletBalance: number
}[]

export default function UserManagement() {

  const [user,] = useUserState()
  const [searchTerm, setSearchTerm] = useState("")
  const [users, setUsers] = useState<Users>()
  const [currentPage, setCurrentPage] = useState(1)
  const [showInactive, setShowInactive] = useState(false)
  const usersPerPage = 7
  const [currentReferalPage, setCurrentReferalPage] = useState(1)

  const fetchData = async () => {
    const Data = await useFetchAllUsers(user.token)
    if (Data.success) {
      setUsers(Data.userData)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (!users) return <div>Loading...</div>

  const filteredUsers = users.filter(
    (user) =>
      (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (showInactive ? !user.status : user.status)
  )

  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)

  const handleActivateUserAccount = async(userId: string) => {
    const res = await useActivateUserAccount(user.token, userId)
    if (res.success) {
      fetchData()
      toast({
        title: "Account Activated",
        description: "User account has been activated successfully",
      })
    } else {
      toast({
        title: "Failed to Activate",
        description: "User account could not be activated",
        variant: "destructive",
      })
    }
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
              onClick={() => { setShowInactive(false); setCurrentPage(1); }}
              className={`flex-1 ${!showInactive ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' : 'bg-gray-200 text-gray-800'}`}
              variant={"outline"}
            >
              Active Users
            </Button>
            <Button
              onClick={() => { setShowInactive(true); setCurrentPage(1); }}
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
          </div>
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Registration Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sponsor</TableHead>
                  <TableHead>Earnings</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentUsers.map((user) => {
                  const indexOfLastreferalUser = currentReferalPage * 8
                  const indexOfFirstReferalUser = indexOfLastreferalUser - 8
                  const currentReferalUsers = user.referrals.slice(indexOfFirstReferalUser, indexOfLastreferalUser)
                  const totalReferalPages = Math.ceil(filteredUsers.length / 8)
                  return (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{new Date(user.registrationDate).toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge
                          variant={user.status ? "default" : "destructive"}
                          className={user.status ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}
                        >
                          {user.status ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>{users.find((u) => u.id === user.referrer)?.email || "N/A"}</TableCell>
                      <TableCell className="pt-5 flex items-center"><IndianRupee scale={1} size={15} />{user.walletBalance}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {!user.status ? 
                          <Button
                            onClick={() => handleActivateUserAccount(user.id)}
                            className="bg-green-500 hover:bg-green-600"
                          >Activate</Button> 
                          :
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
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
                                      variant={user.status ? "default" : "destructive"}
                                      className={user.status ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}
                                    >
                                      {user.status ? "Active" : "Inactive"}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="earnings" className="text-right">
                                    Earnings
                                  </Label>
                                  <div className="col-span-3 flex items-center"><IndianRupee scale={1} size={15} />{user.walletBalance}</div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="earnings" className="text-right">
                                    Referrals count
                                  </Label>
                                  <div className="col-span-3 flex items-center">{user.referrals.length}</div>
                                </div>
                              </div>
                              {user.referrals.length !== 0 ? <div className="mt-4">
                                <h4 className="text-sm font-medium mb-2">Referrals</h4>
                                {currentReferalUsers.map((referral) => (
                                  <div key={referral.email} className="py-1">
                                    <div className="flex justify-between">
                                      <div>
                                        {referral.email}
                                      </div>
                                      <Badge
                                        variant={referral.status ? "default" : "destructive"}
                                        className={referral.status ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}
                                      >
                                        {referral.status ? "Active" : "Inactive"}
                                      </Badge>
                                    </div>
                                  </div>
                                ))}
                                <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
                                  <Button
                                    onClick={() => setCurrentReferalPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentReferalPage === 1}
                                    className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white w-full sm:w-auto"
                                  >
                                    <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                                  </Button>
                                  <span className="text-sm text-gray-600">Page {currentReferalPage} of {totalReferalPages}</span>
                                  <Button
                                    onClick={() => setCurrentReferalPage(prev => Math.min(prev + 1, totalReferalPages))}
                                    disabled={currentReferalPage === totalReferalPages}
                                    className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white w-full sm:w-auto"
                                  >
                                    Next <ChevronRight className="ml-2 h-4 w-4" />
                                  </Button>
                                </div>
                              </div>: null}
                            </DialogContent>
                          </Dialog>}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
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