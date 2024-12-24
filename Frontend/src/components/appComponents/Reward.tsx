import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Gift, Users, Lock, Check } from 'lucide-react'
import { useUserState } from '@/recoil/user'
import { useUpdateUserReward, useUserReward } from '@/hooks/useUserReward'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useNavigate } from 'react-router-dom'


interface UserReward {
  id: string;
  userId: string;
  rewardId: string;
  isClaimable: boolean;
  isClaimed: boolean;
  claimDate: Date | null;
}


interface reward {
  id: string;
  name: string;
  amount: number;
  description: string;
  level: number;
}

interface UserRewardDataProps {
  id: string;
  name: string;
  amount: number;
  description: string;
  level: number
  userId: string;
  rewardId: string;
  isClaimable: boolean;
  isClaimed: boolean;
  claimDate: Date | null;
}
type UserRewardData = UserRewardDataProps[]

interface LevelCountProps {
    id: string;
    userId: string;
    level1Count: number;
    level2Count: number;
    level3Count: number;
    level4Count: number;
    level5Count: number;
    level6Count: number;
    updatedAt: Date;
}

export default function RewardsPage() {

  const [user,] = useUserState()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [rewardData, setRewardData] = useState<UserRewardData | null>(null)
  const [levelCounts, setLevelCounts] = useState<LevelCountProps| null>(null)
  const fetchUserReward = async () => {
    const userRewardData = await useUserReward(user.id, user.token);
    if (userRewardData.success) {
      const rewards = userRewardData.rewards
      const userRewards = userRewardData.userData
      const combinedData = userRewards.map((userReward: UserReward) => {
        const reward = rewards.find((r: reward) => r.id === userReward.rewardId);
        return {
          ...userReward,
          ...reward
        };
      });
      setLevelCounts(userRewardData.levelRewards)
      setRewardData(combinedData.sort((a:UserRewardDataProps, b:UserRewardDataProps) => a.amount - b.amount));
    } else {
      toast({
        title: "Failed to fetch rewards",
        description: "Please try again",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    if (!user) {
      navigate("/login")
      return
    }
    if(user.membershipStatus === false){
      navigate("/activation")
      return
    }
    fetchUserReward()
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount)
  }

  const handleClaim = async(rewardId: string) => {
      const res = await useUpdateUserReward(user.token, user.id, rewardId)
      if (res.success) {
        fetchUserReward()
        toast({
          title: "Reward claimed successfully",
          description: "You have successfully claimed the reward",
        })
        return
      } else {
        toast({
          title: "Failed to claim reward",
          description: `${res.message}`,
          variant: "destructive",
        })
      }
  }


    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Referral Rewards</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rewardData && rewardData.map((reward) => (
            <Card key={reward.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {<Users className="h-6 w-6" />}
                  {reward.name}
                </CardTitle>
                <CardDescription>{reward.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="mt-4 text-2xl font-bold text-center">{formatCurrency(reward.amount)}</p>
              </CardContent>
              <CardFooter>
                {reward.isClaimed ? (
                  <Button className="w-full" disabled>
                    <Check className="mr-2 h-4 w-4" /> Claimed
                  </Button>
                ) : reward.isClaimable ? (
                  <Button className="w-full" onClick={() => handleClaim(reward.rewardId)}>
                    <Gift className="mr-2 h-4 w-4" /> Claim Reward
                  </Button>
                ) : (
                  <Button className="w-full" disabled>
                    <Lock className="mr-2 h-4 w-4" /> Locked
                  </Button>
                )}
              </CardFooter>
            </Card>
          )
          )}
        </div>
        <div className="mt-6 text-center">
          {levelCounts && <LevelCountTable levels={levelCounts} userId={user.id}/>}
        </div>
      </div>
    )
}


export function LevelCountTable({levels,userId}: {levels:LevelCountProps,userId:string}) {
  const levelCounts = Object.entries(levels).map(([key, value], index) => {
    return { index:index+1, value };
  });

return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="flex flex-row items-center space-y-0 gap-4">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Users className="w-6 h-6 text-primary" />
        </div>
        <div className='flex items-center justify-between w-full'>
          <CardTitle className="text-2xl">Levels</CardTitle>
          <p className="text-sm text-muted-foreground">User ID: {userId}</p>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='text-center'>Level</TableHead>
              <TableHead className='text-center'>Members</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {levelCounts.map(({index,value}) => (
              <TableRow key={index}>
                <TableCell className="font-medium">Level {index}</TableCell>
                <TableCell>{value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}