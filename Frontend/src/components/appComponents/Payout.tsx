import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { IndianRupee, CheckCircle2, XCircle, Clock, Wallet, ArrowDownToLine } from 'lucide-react'
import { useUserState } from '@/recoil/user'
import { useNavigate } from 'react-router-dom'
import { useUserWallet, useUserWithdrawlRequest } from '@/hooks/useUserWallet'
import { useToast } from '@/hooks/use-toast'

enum WithdrawalStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  REJECTED = "REJECTED"
}

interface withdrawalRequestsProps {
  id: string,
  userId: string,
  amount: number,
  status: WithdrawalStatus,
  createdAt: Date
}

interface userDataProps {
  userId: string,
  walletBalance: number,
  withdrawalRequests: withdrawalRequestsProps[]
}

export default function Payout() {
  const [user,] = useUserState()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [userData, setUserData] = useState<userDataProps | null>(null)
  const [withdrawAmount, setWithdrawAmount] = useState<string>("")

  useEffect(() => {
    if (!user) {
      navigate("/login")
      return
    } else {
      const fetchUserData = async () => {
        const res = await useUserWallet(user.id, user.token)
        setUserData(res)
      }
      fetchUserData()
    }
  }, [user])

  const handleWithdraw = async () => {
    if (withdrawAmount && userData) {
      const amount = parseFloat(withdrawAmount)
      if (amount < 200){
        toast({
          title: "Failed",
          description: "Minimum withdrawal amount is ₹200",
          variant: "destructive",
        })
        return
      }
      if (amount <= userData.walletBalance) {
        const res = await useUserWithdrawlRequest(user.id, user.token, amount)
        if (res.status) {
          setWithdrawAmount("")
          toast({
            title: "Success",
            description: "Withdrawal request created successfully",
          })
          const updatedUserData = await useUserWallet(user.id, user.token)
          setUserData(updatedUserData)
        } else {
          if(res.message){
            toast({
              title: "Failed",
              description: res.message,
              variant: "destructive",
            })
            return
          }
          toast({
            title: "Failed",
            description: "An unexpected error occurred Try again",
            variant: "destructive",
          })
        }
      }else{
        toast({
          title: "Failed",
          description: "Insufficient balance",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-gradient-to-b from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-3xl mx-auto space-y-6">
        <Card className="overflow-hidden shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 p-6">
            <CardTitle className="text-xl font-bold text-white">Wallet</CardTitle>
            <CardDescription className="text-blue-100">Manage your balance and withdrawals</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-gray-800 rounded-lg">
              <div className="space-y-1">
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Available Balance</p>
                <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                  ₹{userData && userData.walletBalance.toFixed(2)}
                </p>
              </div>
              <Wallet className="h-12 w-12 text-blue-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 p-6">
            <CardTitle className='text-xl font-semibold text-white'>Withdraw Funds</CardTitle>
            <CardDescription className="text-indigo-100">Minimum withdrawal amount is ₹200</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-sm font-medium text-gray-700 dark:text-gray-300">Amount</Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    id="amount"
                    placeholder="Enter amount"
                    type="number"
                    value={withdrawAmount}
                    disabled={userData?.walletBalance === 0}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="pl-10 h-11 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                  />
                </div>
              </div>
              <Button 
                onClick={handleWithdraw} 
                disabled={userData?.walletBalance === 0 || parseFloat(withdrawAmount) < 200}
                className="w-full h-11 text-base font-medium bg-gradient-to-r from-green-500 to-emerald-500 hover:from-indigo-600 hover:to-purple-600 text-white transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <ArrowDownToLine className="w-5 h-5 mr-2" />
                Withdraw Funds
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {userData && <WithdrawalTable userData={userData}/>}
      </div>
    </div>
  )
}

export const WithdrawalTable = ({ userData }: { userData: userDataProps }) => {

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case 'PENDING':
        return <Clock className="h-5 w-5 text-yellow-500" />
      default:
        return <XCircle className="h-5 w-5 text-red-500" />
    }
  }

  return (
    <Card className="overflow-hidden shadow-lg border-0">
      <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 p-6">
        <CardTitle className='text-xl font-semibold text-white'>Withdrawal History</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {userData && userData.withdrawalRequests.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-800">
                  <TableHead className="font-semibold text-gray-600 dark:text-gray-300">Date</TableHead>
                  <TableHead className="font-semibold text-gray-600 dark:text-gray-300">Amount</TableHead>
                  <TableHead className="font-semibold text-gray-600 dark:text-gray-300">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userData.withdrawalRequests.map((withdrawal) => (
                  <TableRow key={withdrawal.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <TableCell className="text-sm">{new Date(withdrawal.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className='flex items-center text-gray-900 dark:text-gray-100 font-medium'>
                        <IndianRupee size={16} strokeWidth={1.25} className="mr-1" />
                        {withdrawal.amount.toFixed(2)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(withdrawal.status)}
                        <span className={`text-sm font-medium ${
                          withdrawal.status === 'COMPLETED' ? 'text-green-600 dark:text-green-400' :
                          withdrawal.status === 'PENDING' ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
                        }`}>
                          {withdrawal.status}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <CardDescription className="p-6 text-center text-gray-500 dark:text-gray-400">No Withdrawal History Found</CardDescription>
        )}
      </CardContent>
    </Card>
  )
}

