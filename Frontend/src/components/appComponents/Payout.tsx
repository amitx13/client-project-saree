import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { IndianRupee, CheckCircle2, XCircle, Clock } from 'lucide-react'
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
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Your Wallet</CardTitle>
            <CardDescription>Manage your balance and withdrawals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Available Balance</p>
                <p className="text-3xl font-bold">{userData && userData.walletBalance}</p>
              </div>
              <IndianRupee className="h-10 w-10 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>Withdraw Funds</CardTitle>
            <CardDescription>Minimum withdrawal amount is ₹200</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                placeholder="Enter amount"
                type="number"
                value={withdrawAmount}
                disabled={userData?.walletBalance === 0 }
                onChange={(e) => setWithdrawAmount(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleWithdraw} disabled={userData?.walletBalance === 0 || parseFloat(withdrawAmount) < 200}>
              Withdraw Funds
            </Button>
          </CardFooter>
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
    <Card>
    <CardHeader>
      <CardTitle className='text-lg'>Withdrawal History</CardTitle>
    </CardHeader>
    <CardContent>
      {userData && userData.withdrawalRequests.length > 0 ? <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userData.withdrawalRequests.map((withdrawal) => (
            <TableRow key={withdrawal.id}>
              <TableCell>{new Date(withdrawal.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>
                <div className='flex items-center'>
                  <IndianRupee size={16} strokeWidth={1.25} />{withdrawal.amount}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(withdrawal.status)}
                  <span>{withdrawal.status}</span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>: <CardDescription >No Withdrawal History Found</CardDescription>}
    </CardContent>
  </Card>
  )
}