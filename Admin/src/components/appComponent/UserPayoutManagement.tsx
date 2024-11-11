import { useEffect, useState } from 'react'
import { Clock, CheckCircle, XCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useUserState } from '@/recoil/user'
import { useFetchAllWithdrawalRequests } from '@/hooks/useFetchAllWithdrawalRequests'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useUserUpdatePaymentStatusToCompleted, useUserUpdatePaymentStatusToRejected } from '@/hooks/useUserUpdatePaymentStatus'
import { toast } from '@/hooks/use-toast'

interface BankDetails{
  id: string;
  userId: string;
  createdAt: Date;
  accountNo: string;
  ifscCode: string;
  BankName: string;
}

type Payout = {
  id: string;
  userName: string;
  mobile: number,
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'REJECTED';
  bankDetails: BankDetails[];
  requestedAt: string;
}

export default function UserPayoutManagement() {
  const [user,] = useUserState()
  const [isLoading, setIsLoading] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [payouts, setPayouts] = useState<Payout[]>()
  const payoutsPerPage = 5

  const fetchAllWithdrawalRequests = async () => {
    const res = await useFetchAllWithdrawalRequests(user.token)
    if(res && res.success){
      setPayouts(res.data)
    }
  }

  useEffect(()=>{
    setIsLoading(true)
    fetchAllWithdrawalRequests()
    setIsLoading(false)
  },[])

  const indexOfLastPayout = currentPage * payoutsPerPage
  const indexOfFirstPayout = indexOfLastPayout - payoutsPerPage
  const currentPayouts = payouts?.filter(payout => payout.status === 'PENDING') || []
  const historicalPayouts = payouts?.filter(payout => payout.status !== 'PENDING') || []
  const displayedPayouts = (showHistory ? historicalPayouts : currentPayouts).slice(indexOfFirstPayout, indexOfLastPayout)
  const totalPages = Math.ceil((showHistory ? historicalPayouts.length : currentPayouts.length) / payoutsPerPage)

  const handleStatusChange = async(id: string, value:"PENDING"| "COMPLETED" |"REJECTED") => {
    if(value === 'PENDING') return
    if(value === 'COMPLETED'){
      const res = await useUserUpdatePaymentStatusToCompleted(user.token, id)
      if(res.success){
        setIsLoading(true)
        fetchAllWithdrawalRequests()
        setIsLoading(false)
        toast({
          title: "Payment Completed",
          description: "Payment has been successfully completed",
        })
      }
    }
    if(value === 'REJECTED'){
      const res = await useUserUpdatePaymentStatusToRejected(user.token, id)
      if(res.success){
        setIsLoading(true)
        fetchAllWithdrawalRequests()
        setIsLoading(false)
        toast({
          title: "Payment Rejected",
          description: "Payment has been rejected",
        })
      }
    }
  }

  const getStatusBadge = (status: 'pending' | 'completed' | 'rejected') => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300"><Clock className="w-3 h-3 mr-1" />Pending</Badge>
      case 'completed':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-blue-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="bg-gradient-to-r from-pink-500 to-purple-500 text-white p-6 rounded-t-lg">
          <h1 className="text-2xl sm:text-3xl font-bold">User Payout Management</h1>
          <p className="text-pink-100 mt-2">Manage and track user payouts</p>
        </header>
        {!isLoading ? <main className="bg-white/80 backdrop-blur-sm shadow-xl p-4 sm:p-6 rounded-b-lg">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
            <Button 
              onClick={() => {setShowHistory(false); setCurrentPage(1);}}
              className={`flex-1 ${!showHistory ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' : 'bg-gray-200 text-gray-800'}`}
              variant={"outline"}
            >
              Current Transactions
            </Button>
            <Button 
              onClick={() => {setShowHistory(true); setCurrentPage(1);}}
              className={`flex-1 ${showHistory ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' : 'bg-gray-200 text-gray-800'}`}
              variant={"outline"}
            >
              Transaction History
            </Button>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">User</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead >Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedPayouts.map((payout) => (
                  <TableRow key={payout.id}>
                    <TableCell className="font-medium">{payout.userName}</TableCell>
                    <TableCell>₹{payout.amount.toFixed(2)}</TableCell>
                    <TableCell>{getStatusBadge(payout.status.toLowerCase() as 'pending' | 'completed' | 'rejected')}</TableCell>
                    <TableCell>{new Date(payout.requestedAt).toLocaleString()}</TableCell>
                    <TableCell className='flex gap-4 items-center'>
                      <Select
                        onValueChange={(value) => handleStatusChange(payout.id, value as "PENDING" | "COMPLETED" | "REJECTED")}
                        defaultValue={payout.status}
                      >
                        <SelectTrigger className="w-[130px]">
                          <SelectValue placeholder="Update status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PENDING">PENDING</SelectItem>
                          <SelectItem value="COMPLETED">COMPLETED</SelectItem>
                          <SelectItem value="REJECTED">REJECTED</SelectItem>
                        </SelectContent>
                      </Select>

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
                                <DialogTitle>User Bank Details</DialogTitle>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="email" className="text-right">
                                    Name
                                  </Label>
                                  <div className="col-span-3">{payout.userName}</div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="status" className="text-right">
                                    Mobile
                                  </Label>
                                  <div className="col-span-3">{payout.mobile}</div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="earnings" className="text-right">
                                    Amount
                                  </Label>
                                  <div className="col-span-3 flex items-center">₹{payout.amount}</div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <div className="col-span-3 flex flex-col">
                                  <h3 className="font-semibold mb-2">Bank Details</h3>
                                  <span>Account No: {payout.bankDetails[0].accountNo}</span>
                                  <span>IFSC Code: {payout.bankDetails[0].ifscCode}</span>
                                  <span>Bank Name: {payout.bankDetails[0].BankName}</span>
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                      </Dialog>
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
        </main>: <div className="bg-white/80 backdrop-blur-sm shadow-xl p-4 sm:p-6 rounded-b-lg">loading...</div>}
      </div>
    </div>
  )
}