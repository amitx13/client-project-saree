import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Search } from "lucide-react"
import { useFetchAllUsersTransactionDetails, useUpdateRequestCodeTransactionDetails } from "@/hooks/useFetchAllUsers"
import { useUserState } from "@/recoil/user"
import { useNavigate } from "react-router-dom"
import API_BASE_URL from "@/config"
import { useToast } from "@/hooks/use-toast"

export type User = {
    image: string;
    id: string;
    createdAt: Date;
    userId: string;
    amount: number;
    transactionId: string;
    approved: boolean;
}

export default function FundManagement() {
    const [user,] = useUserState()
    const navigate = useNavigate()
    const { toast } = useToast()

    const [searchTerm, setSearchTerm] = useState("")
    const [users, setUsers] = useState<User[]>()
    const [currentPage, setCurrentPage] = useState(1)
    const [showInactive, setShowInactive] = useState(false)

    const usersPerPage = 7
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const fetchData = async () => {
        const Data = await useFetchAllUsersTransactionDetails(user.token)
        if (Data.success) {
            const sortByDate = Data.users.sort((a: User, b: User) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
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
            (user.userId.includes(searchTerm) &&
            (showInactive ? !user.approved : user.approved))
    )

    const indexOfLastUser = currentPage * usersPerPage
    const indexOfFirstUser = indexOfLastUser - usersPerPage
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage)

    const handleApproved = async (id:string,userId:string) => {
        setIsLoading(true)
        const res = await useUpdateRequestCodeTransactionDetails(user.token, id, userId, true)
        if (res.success) {
            fetchData()
            toast({
                title: "Approved",
                description: "Transaction Approved Successfully",
            })
        } else{
            toast({
                title: "Error",
                description: res.message,
                variant: "destructive",
            })
        }
        setIsLoading(false)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-100 to-blue-100 p-4 sm:p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="bg-gradient-to-r from-pink-500 to-purple-500 text-white p-6 rounded-t-lg">
                    <h1 className="text-2xl sm:text-3xl font-bold">Fund Management</h1>
                    <p className="text-pink-100 mt-2">Manage and track funds information</p>
                </header>
                {!isLoading ? <main className="bg-white/80 backdrop-blur-sm shadow-xl p-4 sm:p-6 rounded-b-lg">
                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
                        <Button
                            onClick={() => { setShowInactive(false); setCurrentPage(1); }}
                            className={`flex-1 ${!showInactive ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' : 'bg-gray-200 text-gray-800'}`}
                            variant={"outline"}
                        >
                            Approved Fund Request
                        </Button>
                        <Button
                            onClick={() => { setShowInactive(true); setCurrentPage(1); }}
                            className={`flex-1 ${showInactive ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' : 'bg-gray-200 text-gray-800'}`}
                            variant={"outline"}
                        >
                            Pending Fund Request
                        </Button>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                        <div className="relative">
                            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <Input
                                placeholder="Search by UserId"
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
                                    <TableHead>UserId</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Date/Time</TableHead>
                                    <TableHead>Transaction Id</TableHead>
                                    <TableHead>Image</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {currentUsers.map((user) => {
                                    return (
                                        <TableRow key={user.id}>
                                            <TableCell className="font-medium">{user.userId}</TableCell>
                                            <TableCell>{user.amount}</TableCell>
                                            <TableCell>{new Date(user.createdAt).toLocaleString()}</TableCell>
                                            <TableCell>{user.transactionId}</TableCell>
                                            <TableCell>{
                                                user.image ?
                                                    <img
                                                        src={`${API_BASE_URL}/${user.image}`}
                                                        alt={"Transaction"}
                                                        className="rounded-md w-12 h-12 object-cover cursor-pointer"
                                                        onClick={() => {
                                                            user.image && window.open(`${API_BASE_URL}/${user.image}`)
                                                        }}
                                                    /> : "N/A"}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={user.approved ? "default" : "destructive"}
                                                    className={user.approved ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}
                                                >
                                                    {user.approved ? "Approved" : "Pending"}
                                                </Badge>
                                            </TableCell>

                                            <TableCell>
                                                <div className="flex items-center space-x-2">
                                                    {!user.approved ?
                                                        <Button
                                                            disabled={isLoading}
                                                            onClick={()=>handleApproved(user.id, user.userId)}
                                                            className="bg-green-500 hover:bg-green-600"
                                                        >Approved</Button>
                                                        : null
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