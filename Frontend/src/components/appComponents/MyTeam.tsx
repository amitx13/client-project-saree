import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CopyIcon, User } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Phone, ChevronLeft, ChevronRight } from 'lucide-react'
import { useUserState } from "@/recoil/user";
import { useNavigate } from "react-router-dom";
import { useUserTeamData } from "@/hooks/useUserTeamData";

interface UserDataProps {
  sponsored: {
    name: string
    email: string
    phone: string
  }
  referrals: {
    name: string
    mobile: string
  }[]
  networkSize: number
}

const MyTeam = () => {
  const [user,] = useUserState()
  const { toast } = useToast()
  const navigate = useNavigate()

  const [userData, setUserData] = useState<UserDataProps | null>(null)

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return
    } else {
      const fetchUserData = async () => {
        const userData = await useUserTeamData(user.id, user.token);
        setUserData(userData);
      };
      fetchUserData()
    }
  }, [user])

  const copyReferralCode = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content)
      toast({
        title: "Copied!",
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
      <h1 className="text-3xl font-bold mb-6">My Team</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Referral Card */}
        {!userData?.sponsored ? (
          <Card>
            <CardHeader>
              <CardTitle>No Sponsor</CardTitle>
            </CardHeader>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>{userData.sponsored.name}</CardTitle>
              <CardDescription>Sponsor</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <input
                  value={userData.sponsored.email}
                  readOnly
                  className="flex-grow p-2 border rounded text-black"
                />
                <Button variant="outline" size="icon" onClick={() => copyReferralCode(userData.sponsored.email.toString())}>
                  <CopyIcon className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center space-x-2 mb-4">
                <input
                  value={userData.sponsored.phone}
                  readOnly
                  className="flex-grow p-2 border rounded text-black"
                />
                <Button variant="outline" size="icon" onClick={() => copyReferralCode(userData.sponsored.phone.toString())}>
                  <CopyIcon className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Team Size and Rewards Card */}
        {userData && <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle>My Team Size</CardTitle>
            <CardDescription>Grow your team through referrals to unlock even greater rewards!</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            {userData.networkSize ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">First Line</span>
                  <span className="font-semibold">{userData.referrals.length || 0}</span>
                </div>
                {renderUserIcons(userData?.referrals.length || 0, 5)}
                <div className="flex justify-between items-center">
                  <span className="text-sm ">All Team</span>
                  <span className="font-semibold">{userData.networkSize}</span>
                </div>
                {renderUserIcons(userData?.networkSize || 0, 8)}
              </div>
            ) :
              (
                <div>
                  <p className="text-base font-bold">No Team Data Found</p>
                </div>
              )}
          </CardContent>
        </Card>
        }

        {userData && userData.referrals.length > 0 && <FirstLineTeamCard teamMembers={userData.referrals} />}
      </div>
    </div>
  );
};

export default MyTeam;


interface TeamMember {
  name: string
  mobile: string
}

interface FirstLineTeamCardProps {
  teamMembers: TeamMember[]
}

export function FirstLineTeamCard({ teamMembers }: FirstLineTeamCardProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const membersPerPage = 3
  const totalPages = Math.ceil(teamMembers.length / membersPerPage)

  const getCurrentMembers = () => {
    const start = (currentPage - 1) * membersPerPage
    const end = start + membersPerPage
    return teamMembers.slice(start, end)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">First Line Team Members</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="max-h-fit w-full rounded-md border p-4 ">
          {getCurrentMembers().map((member) => (
            <div className="flex items-center space-x-4 mb-4">
              <Avatar>
                <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">{member.name}</p>
                <p className="text-sm text-muted-foreground">
                  <Phone className="h-3 w-3 inline-block mr-1" />
                  {member.mobile}
                </p>
              </div>
            </div>
          ))}
        </ScrollArea>
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}