import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Gift, Users, Lock, Check } from 'lucide-react'
import { useUserState } from '@/recoil/user'
import { useUpdateUserReward, useUserReward } from '@/hooks/useUserReward'

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

export default function RewardsPage() {

  const [user,] = useUserState()
  const { toast } = useToast()

  const [rewardData, setRewardData] = useState<UserRewardData | null>(null)
  const [teamSize, setTeamSize] = useState<number>(0)

  const fetchUserReward = async () => {
    const userRewardData = await useUserReward(user.id, user.token);
    if (userRewardData.success) {
      const rewards = userRewardData.rewards
      const userRewards = userRewardData.userData
      setTeamSize(userRewardData.networkSize)
      const combinedData = userRewards.map((userReward: UserReward) => {
        const reward = rewards.find((r: reward) => r.id === userReward.rewardId);
        return {
          ...userReward,
          ...reward
        };
      });
      setRewardData(combinedData);
    } else {
      toast({
        title: "Failed to fetch rewards",
        description: "Please try again",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
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
        <div className="mb-6 text-center">
          <p className="text-lg mb-2">Current Team Size: <span className="font-bold">{teamSize}</span></p>
        </div>
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
      </div>
    )
}