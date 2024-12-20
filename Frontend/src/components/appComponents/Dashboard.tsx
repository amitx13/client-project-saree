import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { CopyIcon, CheckCircle } from 'lucide-react'
import { User } from "lucide-react"
import { useNavigate } from 'react-router-dom'
import { useUserState } from '@/recoil/user'
import { useUserData } from '@/hooks/useUserData'
import ActivationPaymentModal from './ActivationPaymentModel'

export default function Dashboard() {
  const [user,updateUser] = useUserState()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [userData, setUserData] = useState<any>(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return
    } else {
      const fetchUserData = async () => {
        const data = await useUserData(user.id, user.token);
        setUserData(data.user);
      };
      fetchUserData()
    }
  }, [user])

  useEffect(() => {
    const fetchdata = async () => {
      const data = await useUserData(user.id, user.token);
      if (data && data.user) {
        const { id, name, email, membershipStatus, orderStatus } = data.user;
        const updatedUserDate = { id, name, email, membershipStatus, orderStatus };
        updateUser(updatedUserDate);
      }
    }
    fetchdata()
  },[])

  const activateAccount = () => {
    setIsOpen(true)
  }

  const copyReferralCode = async () => {
    try {
      await navigator.clipboard.writeText(user.id)
      toast({
        title: "Copied!",
        description: "Referral code copied to clipboard",
      })
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      })
    }
  }

  const renderUserIcons = (count: number, maxDisplay: number) => {
    const displayCount = Math.min(count, maxDisplay)
    const remainingCount = count - maxDisplay

    return (
      <div className="flex items-center">
        {[...Array(displayCount)].map((_, index) => (
          <User key={index} className="w-4 h-4 text-gray-400 -ml-1 first:ml-0" />
        ))}
        {remainingCount > 0 && (
          <span className="text-xs text-gray-500 ml-1">+{remainingCount}</span>
        )}
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <ActivationPaymentModal isOpen={isOpen} setIsOpen={setIsOpen}/>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Account Activation Card */}
        <Card>
          <CardHeader>
            <CardTitle>Account Status</CardTitle>
            <CardDescription>Activate your account to start earning</CardDescription>
          </CardHeader>
          <CardContent>
            {user && user?.membershipStatus ? (
              <Badge className="w-full justify-center py-2">
                <CheckCircle className="mr-2 h-4 w-4" /> Activated
              </Badge>
            ) : (
              <Button onClick={activateAccount} className="w-full" >
                Activate Account (₹750)
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Saree Claim Card */}
        <Card>
          <CardHeader>
            <CardTitle>Reward</CardTitle>
            <CardDescription>Claim your exclusive rewards</CardDescription>
          </CardHeader>
          <CardContent>
            {false ? (
              <Badge className="w-full justify-center py-2">
                <CheckCircle className="mr-2 h-4 w-4" /> Claimed
              </Badge>
            ) : (
              <Button onClick={()=>navigate("/rewards") } disabled={!user?.membershipStatus || false} className="w-full">
                Claim
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Referral Card */}
        {user && <Card>
          <CardHeader>
            <CardTitle>Referral Program</CardTitle>
            <CardDescription>Earn ₹300 for each referral</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-4">
              <input
                value={user?.id}
                readOnly
                className="flex-grow p-2 border rounded text-black"
              />
              <Button variant="outline" size="icon" onClick={copyReferralCode}>
                <CopyIcon className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription>Total Reward earned through referral</CardDescription>
            <p className="text-2xl font-bold">₹{userData?.levelIncome || 0} earned</p>  {/* todo */}
          </CardContent>
        </Card>}

        {/* Team Size and Rewards Card */}
        {user && <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle>Team</CardTitle>
            <CardDescription>Grow your team to unlock bigger rewards</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
        {userData && <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm">First Line</span>
            <span className="font-semibold">{userData?.referrals.length || 0}</span>
          </div>
          {renderUserIcons(userData?.referrals.length || 0, 5)}
          <div className="flex justify-between items-center">
            <span className="text-sm ">All Team</span>
            <span className="font-semibold">{userData.networkSize}</span>
          </div>
          {renderUserIcons(userData?.networkSize || 0, 8)}
        </div>}
      </CardContent>
        </Card>}

        {/* Total Earnings Card */}
        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle>Wallet Balance</CardTitle>
            <CardDescription>Amount in INR</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-center">
              ₹{userData?.walletBalance || 0 } {/* todo */}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// api call to check for referal earnings
