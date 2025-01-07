import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { CopyIcon, CheckCircle, Wallet, Users, Gift, Shield, TrendingUp } from 'lucide-react'
import { User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useLogout, useUserState } from '@/recoil/user'
import { useUserData } from '@/hooks/useUserData'
import ActivationPaymentModal from './ActivationPaymentModel'

interface UserDataProps{
  id: string;
  name: string;
  email: string;
  membershipStatus: boolean;
  orderStatus: boolean;
  levelIncome: number;
  networkSize: number;
  role: "ADMIN" | "USER";
  walletBalance: number;
  levelRewards: {
    id: string;
    userId: string;
    level1Count: number;
    level2Count: number;
    level3Count: number;
    level4Count: number;
    level5Count: number;
    level6Count: number;
    updatedAt: Date;
}[];
}

export default function Dashboard() {
  const [user,updateUser] = useUserState()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [userData, setUserData] = useState<UserDataProps | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const logout = useLogout()

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return
    } else {
      const fetchUserData = async () => {
        const data = await useUserData(user.id, user.token);
        if(data && data.success === false ){
          toast({
            title: "Failed to fetch user data",
            description: "Please try Login again",
            variant: "destructive",
          })
          logout()
          navigate("/login");
        }
        setUserData(data.user);
      };
      fetchUserData()
    }
  }, [user])

  useEffect(() => {
    const fetchdata = async () => {
      const data = await useUserData(user.id, user.token);
      if (data && data.user) {
        const { id, Username, email, membershipStatus, orderStatus } = data.user;
        const updatedUserDate = { id, Username, email, membershipStatus, orderStatus };
        updateUser(updatedUserDate);
      }
    }
    fetchdata()
  },[])

  const activateAccount = () => {
    setIsOpen(true)
  }

  const copyReferralCode = async (value:string) => {
    try {
      const textToCopy = value || '';
      const copyText = document.getElementById('referralCode') as HTMLInputElement;
      
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        copyText.select();
        copyText.setSelectionRange(0, 99999);
        document.execCommand('copy');
        copyText.blur();
      }
      
      toast({
        title: "Copied!",
        description: "Referral code copied to clipboard",
      });
    } catch (err: any) {
      toast({
        title: "Failed to copy",
        description: "Please manually copy the referral code",
        variant: "destructive",
      });
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
    <div className="container mx-auto p-4 min-h-screen bg-gradient-to-b from-background to-background/50 dark:from-background dark:to-background/50">
      <ActivationPaymentModal isOpen={isOpen} setIsOpen={setIsOpen}/>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Account Activation Card */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-white/50 dark:from-gray-900 dark:to-gray-900/50 backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-purple-500" />
              <CardTitle>Account Status</CardTitle>
            </div>
            <CardDescription>Activate your account to start earning</CardDescription>
          </CardHeader>
          <CardContent>
            {user && user?.membershipStatus ? (
              <Badge className="w-full justify-center py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 transition-all duration-300 cursor-pointer"
               onClick={activateAccount} >
                <CheckCircle className="mr-2 h-4 w-4" /> Activated
              </Badge>
            ) : (
              <Button 
                onClick={activateAccount} 
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 transition-all duration-300"
              >
                Activate Account (₹580)
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Saree Claim Card */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-white/50 dark:from-gray-900 dark:to-gray-900/50 backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Gift className="w-5 h-5 text-blue-500" />
              <CardTitle>Reward</CardTitle>
            </div>
            <CardDescription>Claim your exclusive rewards</CardDescription>
          </CardHeader>
          <CardContent>
            {false ? (
              <Badge className="w-full justify-center py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 transition-all duration-300">
                <CheckCircle className="mr-2 h-4 w-4" /> Claimed
              </Badge>
            ) : (
              <Button 
                onClick={()=>navigate("/rewards")} 
                disabled={!user?.membershipStatus || false} 
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 transition-all duration-300"
              >
                Claim
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Referral Card */}
        {user && <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-white/50 dark:from-gray-900 dark:to-gray-900/50 backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-cyan-500" />
              <CardTitle>Referral Program</CardTitle>
            </div>
            <CardDescription>Earn ₹200 for each referral</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-4">
              <input
                id='referralCode'
                value={`https://www.jdlifestyle.store/register?referral_id=${user?.id}`}
                readOnly
                className="flex-grow p-2 border-2 rounded-md bg-background/50 backdrop-blur-sm transition-all duration-300 focus:border-cyan-500 dark:focus:border-cyan-400"
              />
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => copyReferralCode(`https://www.jdlifestyle.store/register?referral_id=${user?.id}`)}
                className="hover:bg-cyan-500/10 hover:text-cyan-500 transition-colors"
              >
                <CopyIcon className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription>Total Reward earned through referral</CardDescription>
            <p className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
              ₹{userData?.levelIncome || 0} earned
            </p>
          </CardContent>
        </Card>}

        {/* Team Size and Rewards Card */}
        {user && <Card className="md:col-span-2 lg:col-span-3 border-0 shadow-lg bg-gradient-to-br from-white to-white/50 dark:from-gray-900 dark:to-gray-900/50 backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-500" />
              <CardTitle>Team</CardTitle>
            </div>
            <CardDescription>Grow your team to unlock bigger rewards</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
          {userData?.levelRewards[0] ? (
              (() => {
                const level2to6 = userData.levelRewards[0].level2Count + userData.levelRewards[0].level3Count + userData.levelRewards[0].level4Count + userData.levelRewards[0].level5Count + userData.levelRewards[0].level6Count;
                return (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-blue-500/10 transition-all duration-300 hover:from-purple-500/20 hover:to-blue-500/20">
                      <span className="text-sm font-medium">Level 1</span>
                      <span className="font-semibold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                        {userData.levelRewards[0].level1Count || 0}
                      </span>
                    </div>
                    <div className="pl-3">{renderUserIcons(userData.levelRewards[0].level1Count || 0, 5)}</div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-blue-500/10 to-cyan-500/10 transition-all duration-300 hover:from-blue-500/20 hover:to-cyan-500/20">
                      <span className="text-sm font-medium">Level 2 - 6</span>
                      <span className="font-semibold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                        {level2to6}
                      </span>
                    </div>
                    <div className="pl-3">{renderUserIcons(level2to6, 8)}</div>
                  </div>
                );
              })()
            ) : (
              <div className="text-center p-6 rounded-lg bg-gradient-to-r from-gray-500/10 to-gray-500/10">
                <p className="text-base font-bold text-gray-500">No Team Data Found</p>
              </div>
            )}
          </CardContent>
        </Card>}

        {/* Total Earnings Card */}
        <Card className="md:col-span-2 lg:col-span-3 border-0 shadow-lg bg-gradient-to-br from-white to-white/50 dark:from-gray-900 dark:to-gray-900/50 backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Wallet className="w-5 h-5 text-green-500" />
              <CardTitle>Wallet Balance</CardTitle>
            </div>
            <CardDescription>Amount in INR</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-center bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent transition-all duration-300">
              ₹{userData?.walletBalance || 0} 
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

