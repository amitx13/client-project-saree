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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, IndianRupee, PencilIcon, SaveIcon, Search } from "lucide-react"
import { useFetchAllUsers } from "@/hooks/useFetchAllUsers"
import { useUserState } from "@/recoil/user"
import { useActivateUserAccount } from "@/hooks/useActivateUserAccount"
import { toast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Card, CardContent } from "../ui/card"
import { useUpdateUserData } from "@/hooks/useUpdateUserData"

type User = {
  id: string
  name: string
  username: string
  password: string
  email: string
  mobile: string
  registrationDate: string
  status: boolean
  referrer: string
  referrals: { userId: string, email: string, status: boolean }[]
  walletBalance: number
  levelIncome: number
  address: {id:string, houseNo: string, city: string, state: string, pinCode: string }
  bankDetails: {id:string, accountNo: string, ifscCode: string, BankName: string }
}

export type Users = {
  id: string
  name: string
  username: string
  password: string
  email: string
  mobile: string
  registrationDate: string
  status: boolean
  referrer: string
  referrals: { userId: string, email: string, status: boolean }[]
  walletBalance: number
  levelIncome: number
  address: {id:string, houseNo: string, city: string, state: string, pinCode: string }
  bankDetails: {id:string, accountNo: string, ifscCode: string, BankName: string }
}[]

export default function UserManagement() {
  const [user,] = useUserState()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [users, setUsers] = useState<Users>()
  const [currentPage, setCurrentPage] = useState(1)
  const [showInactive, setShowInactive] = useState(false)
  const usersPerPage = 7
  const [currentReferalPage, setCurrentReferalPage] = useState(1)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [isEditing, setIsEditing] = useState(false)
  const [userDetails, setUserDetails] = useState<Users[0]>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchData = async () => {
    const Data = await useFetchAllUsers(user.token)
    if (Data.success) {
      const sortByDate = Data.userData.sort((a:User, b:User) => new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime())
      setUsers(sortByDate)
    }
  }

  useEffect(() => {
    if (!user) {
      navigate("/login")
      return
    }
    setIsLoading(true)
    fetchData()
    setIsLoading(false)
  }, [])


  const filteredUsers = (users || []).filter(
    (user) =>
      (user.id.includes(searchTerm) || user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (showInactive ? !user.status : user.status)
  )

  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)

  const handleActivateUserAccount = async (userId: string) => {
    setIsLoading(true)
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
    setIsLoading(false)
  }

  const handleSubmit = async() => {
    if(!userDetails) return
    setIsSubmitting(true)
    setIsEditing(false)
    const changes = await useUpdateUserData(userDetails.id, userDetails, user.token)
    if(changes.success) {
      fetchData()
      toast({
        title: "Account Updated Sucessfully!",
        description: "User account has been updated successfully.",
      });
    } else {
      toast({
        title: "Failed to Update Account Details!",
        description: changes.message,
        variant: "destructive",
      });
    }
    setIsSubmitting(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserDetails((prevData) => {
      if (!prevData) return prevData;

      if (name.includes("address.")) {
        const [, field] = name.split(".");
        return {
          ...prevData,
          address: {
            ...prevData.address,
            [field]: value
          }
        };
      }
      
      if (name.includes("bankDetails.")) {
        const [, field] = name.split(".");
        return {
          ...prevData,
          bankDetails: {
            ...prevData.bankDetails,
            [field]: value
          }
        };
      }

      return {
        ...prevData,
        [name]: value
      };
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-blue-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="bg-gradient-to-r from-pink-500 to-purple-500 text-white p-6 rounded-t-lg">
          <h1 className="text-2xl sm:text-3xl font-bold">User Management</h1>
          <p className="text-pink-100 mt-2">Manage and track user information</p>
        </header>
        {!isLoading ? <main className="bg-white/80 backdrop-blur-sm shadow-xl p-4 sm:p-6 rounded-b-lg">
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
                  <TableHead>USerId</TableHead>
                  <TableHead>Password</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Registration Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sponsor</TableHead>
                  <TableHead>Current Balance</TableHead>
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
                      <TableCell className="font-medium">{user.id}</TableCell>
                      <TableCell className="font-medium">{user.password}</TableCell>
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
                      <TableCell>{user && user?.referrer || "N/A"}</TableCell>
                      <TableCell className="pt-5 flex items-center"><IndianRupee scale={1} size={15} />{user.walletBalance}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {!user.status ?
                            <Button
                              disabled={isLoading}
                              onClick={() => handleActivateUserAccount(user.id)}
                              className="bg-green-500 hover:bg-green-600"
                            >Activate</Button>
                            :
                            (
                              <Dialog onOpenChange={(isOpen) => {
                                if(!isOpen) setIsEditing(false)
                              }}>
                                {/* Button to open the dialog */}
                                <DialogTrigger asChild onClick={() => setUserDetails(user)}>
                                  <Button variant="outline">View Details</Button>
                                </DialogTrigger>

                                {/* Dialog Content */}
                                <DialogContent className="w-full lg:w-2/3">
                                  <DialogHeader className="flex-row items-center justify-around">
                                    <DialogTitle>User Details</DialogTitle>
                                    <div className="h-12 w-12 flex items-center justify-center">
                                      {isEditing && (
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="mr-2 w-auto p-2 rounded"
                                          onClick={() => setIsEditing(false)}
                                        >Back<ChevronLeft className="h-5 w-5" />
                                        </Button>
                                      )}
                                      {!isEditing && (
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-10 w-auto p-2 rounded"
                                          onClick={() => setIsEditing(true)}
                                        >
                                          Edit<PencilIcon className="h-5 w-5" />
                                        </Button>
                                      )}
                                    </div>
                                  </DialogHeader>

                                  {userDetails && <div>
                                    <Tabs defaultValue="basic" className="w-full">
                                      {/* Tabs List */}
                                      <TabsList className="w-full justify-start rounded-none h-12 p-0 bg-transparent gap-6 mb-6">
                                        {["basic", "address", "bank", "referals"].map((tab) => (
                                          <TabsTrigger
                                            key={tab}
                                            value={tab}
                                            className="relative h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-0"
                                          >
                                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                          </TabsTrigger>
                                        ))}
                                      </TabsList>

                                      {/* Basic Tab Content */}
                                      <TabsContent value="basic" className="space-y-6 mt-0">
                                        {/* User Info Inputs */}
                                        <div className="space-y-4">
                                          <div className="space-y-2">
                                            <Label>User Id</Label>
                                            <Input
                                              name="id"
                                              value={userDetails.id}
                                              disabled={true}
                                              className="h-12 text-lg bg-card"
                                            />
                                          </div>
                                          <div className="space-y-2">
                                            <Label>Username</Label>
                                            <Input
                                              name="username"
                                              value={userDetails.username}
                                              disabled={true}
                                              className={"h-12 text-lg bg-card"}
                                            />
                                          </div>
                                          <div className="space-y-2">
                                            <Label>Full Name</Label>
                                            <Input
                                              name="name"
                                              value={userDetails.name}
                                              onChange={handleChange}
                                              disabled={!isEditing}
                                              className="h-12 text-lg bg-card"
                                            />
                                          </div>
                                          <div className="space-y-2">
                                            <Label>Email</Label>
                                            <Input
                                              name="email"
                                              type="email"
                                              value={userDetails.email}
                                              onChange={handleChange}
                                              disabled={!isEditing}
                                              className="h-12 text-lg bg-card"
                                            />
                                          </div>
                                          <div className="space-y-2">
                                            <Label>Password</Label>
                                            <Input
                                              name="password"
                                              type="text"
                                              value={userDetails.password}
                                              onChange={handleChange}
                                              disabled={!isEditing}
                                              className="h-12 text-lg bg-card"
                                            />
                                          </div>
                                          <div className="space-y-2">
                                            <Label>Mobile Number</Label>
                                            <Input
                                              name="mobile"
                                              value={userDetails.mobile}
                                              onChange={handleChange}
                                              disabled={!isEditing}
                                              className="h-12 text-lg bg-card"
                                            />
                                          </div>
                                        </div>
                                      </TabsContent>

                                      {/* Address Tab Content */}
                                      <TabsContent value="address">
                                        <Card>
                                          <CardContent className="p-6 space-y-4">
                                            <div className="space-y-2">
                                              <Label>House No / Street</Label>
                                              <Input
                                                name="address.houseNo"
                                                value={userDetails.address.houseNo}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                className="h-12 text-lg"
                                              />
                                            </div>
                                            <div className="space-y-2">
                                              <Label>City</Label>
                                              <Input
                                                name="address.city"
                                                value={userDetails.address.city}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                className="h-12 text-lg"
                                              />
                                            </div>
                                            <div className="space-y-2">
                                              <Label>State</Label>
                                              <Input
                                                name="address.state"
                                                value={userDetails.address.state}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                className="h-12 text-lg"
                                              />
                                            </div>
                                            <div className="space-y-2">
                                              <Label>Pin Code</Label>
                                              <Input
                                                name="address.pinCode"
                                                value={userDetails.address.pinCode}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                className="h-12 text-lg"
                                              />
                                            </div>
                                          </CardContent>
                                        </Card>
                                      </TabsContent>

                                      {/* Bank Tab Content */}
                                      <TabsContent value="bank">
                                        <Card>
                                          <CardContent className="p-6 space-y-4">
                                            <div className="space-y-2">
                                              <Label>Account Number</Label>
                                              <Input
                                                name="bankDetails.accountNo"
                                                value={userDetails.bankDetails.accountNo}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                className="h-12 text-lg"
                                              />
                                            </div>
                                            <div className="space-y-2">
                                              <Label>IFSC Code</Label>
                                              <Input
                                                name="bankDetails.ifscCode"
                                                value={userDetails.bankDetails.ifscCode}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                className="h-12 text-lg"
                                              />
                                            </div>
                                            <div className="space-y-2">
                                              <Label>Bank Name</Label>
                                              <Input
                                                name="bankDetails.BankName"
                                                value={userDetails.bankDetails.BankName}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                className="h-12 text-lg"
                                              />
                                            </div>
                                          </CardContent>
                                        </Card>
                                      </TabsContent>

                                      {/* Referals Tab Content */}
                                      <TabsContent value="referals">
                                        <div className="space-y-4">
                                          {/* Referrals Count */}
                                          <div className="flex items-center justify-around">
                                            <Label htmlFor="earnings" className="text-lg font-medium text-gray-700">
                                              Total Referrals Count:
                                            </Label>
                                            <div className="text-xl font-semibold text-gray-900">{userDetails.referrals.length}</div>
                                          </div>

                                          {userDetails.referrals.length > 0 ? (
                                            <div className="mt-4 w-full">
                                              {/* Table */}
                                              <div className="w-full overflow-x-auto">
                                                <table className="min-w-full border-collapse border border-gray-200 rounded-md">
                                                  {/* Table Header */}
                                                  <thead className="bg-gray-100">
                                                    <tr>
                                                      <th className="px-3 py-3 text-left text-sm font-medium text-gray-700">User ID</th>
                                                      <th className="px-3 py-3 text-left text-sm font-medium text-gray-700">Email</th>
                                                      <th className="px-3 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                                                    </tr>
                                                  </thead>

                                                  {/* Table Body */}
                                                  <tbody className="divide-y divide-gray-200">
                                                    {currentReferalUsers.map((referral, index) => (
                                                      <tr key={index} className="hover:bg-gray-50">
                                                        <td className="px-3 py-3 text-sm font-medium text-gray-800">{referral.userId}</td>
                                                        <td className="px-3 py-3 text-sm text-gray-600">{referral.email}</td>
                                                        <td className="px-3 py-3">
                                                          <Badge
                                                            variant={referral.status ? "default" : "destructive"}
                                                            className={`text-white px-3 py-1 rounded-md ${referral.status
                                                                ? "bg-green-500 hover:bg-green-600"
                                                                : "bg-red-500 hover:bg-red-600"
                                                              }`}
                                                          >
                                                            {referral.status ? "Active" : "Inactive"}
                                                          </Badge>
                                                        </td>
                                                      </tr>
                                                    ))}
                                                  </tbody>
                                                </table>
                                              </div>

                                              {/* Pagination */}
                                              <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
                                                <Button
                                                  onClick={() => setCurrentReferalPage((prev) => Math.max(prev - 1, 1))}
                                                  disabled={currentReferalPage === 1}
                                                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white w-full sm:w-auto"
                                                >
                                                  <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                                                </Button>
                                                <span className="text-sm text-gray-600">
                                                  Page {currentReferalPage} of {totalReferalPages}
                                                </span>
                                                <Button
                                                  onClick={() => setCurrentReferalPage((prev) => Math.min(prev + 1, totalReferalPages))}
                                                  disabled={currentReferalPage === totalReferalPages}
                                                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white w-full sm:w-auto"
                                                >
                                                  Next <ChevronRight className="ml-2 h-4 w-4" />
                                                </Button>
                                              </div>
                                            </div>
                                          ) : (
                                            <div className="text-center text-gray-500 mt-6">
                                              No referrals found.
                                            </div>
                                          )}
                                        </div>
                                      </TabsContent>


                                    </Tabs>

                                    {/* Save Button */}
                                    {isEditing && (
                                      <div className="w-full mt-4">
                                        <Button
                                          type="submit"
                                          className="w-full h-12 text-base font-medium"
                                          disabled={isSubmitting}
                                          onClick={handleSubmit}
                                        >
                                          <SaveIcon className="mr-2 h-5 w-5" />
                                          Save Changes
                                        </Button>
                                      </div>
                                    )}
                                  </div>}
                                </DialogContent>
                              </Dialog>
                            )
                          }
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
        </main> : <div className="bg-white/80 backdrop-blur-sm shadow-xl p-4 sm:p-6 rounded-b-lg text-center">Loading...</div>}
      </div>
    </div>
  )
}