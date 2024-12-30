import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CopyIcon, Users, UserPlus, Phone, ChevronLeft, ChevronRight, Network } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useLogout, useUserState } from "@/recoil/user";
import { useNavigate } from "react-router-dom";
import { useUserTeamData } from "@/hooks/useUserTeamData";
import { Input } from "../ui/input";

interface UserDataProps {
  sponsored: {
    name: string
    userId: string
    phone: string
  }
  referrals: {
    userId: string
    status:boolean
    name: string
    mobile: string
  }[]
  level: {
    id: string;
    userId: string;
    level1Count: number;
    level2Count: number;
    level3Count: number;
    level4Count: number;
    level5Count: number;
    level6Count: number;
    updatedAt: Date;
}[]
}

const MyTeam = () => {
  const [user,] = useUserState()
  const { toast } = useToast()
  const navigate = useNavigate()
  const logout = useLogout()

  const [userData, setUserData] = useState<UserDataProps | null>(null)

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return
    } else {
      const fetchUserData = async () => {
        const userData = await useUserTeamData(user.id, user.token);
        if(userData && userData.success === false ){
          toast({
            title: "Failed to fetch user data",
            description: "Please try Login again",
            variant: "destructive",
          })
          logout()
          navigate("/login");
        }
        setUserData(userData);
      };
      fetchUserData()
    }
  }, [user])

  console.log("userData:",userData)

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

  return (
    <div className="container mx-auto p-4 min-h-screen bg-gradient-to-b from-background to-background/50 dark:from-background dark:to-background/50">    
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Sponsor Card */}
        <Card className="flex flex-col h-full border-0 shadow-lg bg-gradient-to-br from-white to-white/50 dark:from-gray-900 dark:to-gray-900/50 backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <UserPlus className="w-5 h-5 text-purple-500" />
              <div>
                <CardTitle>{userData?.sponsored ? userData.sponsored.name : "No Sponsor"}</CardTitle>
                {userData?.sponsored && <CardDescription>Sponsor</CardDescription>}
              </div>
            </div>
          </CardHeader>
          {userData?.sponsored && (
            <CardContent className="flex-grow">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Input
                    value={userData.sponsored.userId}
                    readOnly
                    className="flex-grow border-2 transition-all duration-300 focus:border-purple-500 dark:focus:border-purple-400"
                  />
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => copyReferralCode(userData.sponsored.userId.toString())}
                    className="hover:bg-purple-500/10 hover:text-purple-500 transition-colors"
                  >
                    <CopyIcon className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <Input
                    value={userData.sponsored.phone}
                    readOnly
                    className="flex-grow border-2 transition-all duration-300 focus:border-purple-500 dark:focus:border-purple-400"
                  />
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => copyReferralCode(userData.sponsored.phone.toString())}
                    className="hover:bg-purple-500/10 hover:text-purple-500 transition-colors"
                  >
                    <CopyIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
    
        {/* Team Size Card */}
        {userData && (
          <Card className="flex flex-col h-full md:col-span-2 lg:col-span-1 border-0 shadow-lg bg-gradient-to-br from-white to-white/50 dark:from-gray-900 dark:to-gray-900/50 backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Network className="w-5 h-5 text-blue-500" />
                <div>
                  <CardTitle>My Team Size</CardTitle>
                  <CardDescription>Grow your team through referrals to unlock even greater rewards!</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              {userData.level && userData.level[0] ? (
                <div className="space-y-3">
                  {[
                    { level: 'Level 1', count: userData.level[0].level1Count },
                    { level: 'Level 2', count: userData.level[0].level2Count },
                    { level: 'Level 3', count: userData.level[0].level3Count },
                    { level: 'Level 4', count: userData.level[0].level4Count },
                    { level: 'Level 5', count: userData.level[0].level5Count },
                    { level: 'Level 6', count: userData.level[0].level6Count },
                  ].map((item, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-blue-500/10 to-cyan-500/10 transition-all duration-300 hover:from-blue-500/20 hover:to-cyan-500/20"
                    >
                      <p className="text-sm font-medium">{item.level}</p>
                      <span className="font-semibold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-6 rounded-lg bg-gradient-to-r from-gray-500/10 to-gray-500/10">
                  <p className="text-base font-bold text-gray-500">No Team Data Found</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
    
        {/* First Line Team Card */}
        {userData && userData.referrals.length > 0 && (
          <Card className="flex flex-col h-full md:col-span-2 lg:col-span-1 border-0 shadow-lg bg-gradient-to-br from-white to-white/50 dark:from-gray-900 dark:to-gray-900/50 backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
            <FirstLineTeamCard teamMembers={userData.referrals} />
          </Card>
        )}
      </div>
    </div>
  );
};

export default MyTeam;

interface TeamMember {
  name: string
  userId: string
  status:boolean
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
    <>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-cyan-500" />
          <CardTitle className="text-2xl font-bold">First Line Team Members</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full rounded-md border bg-card/50 p-4">
          {getCurrentMembers().map((member,index) => (
            <div 
              key={index} 
              className="flex items-center space-x-4 mb-4 p-3 rounded-lg bg-gradient-to-r from-cyan-500/5 to-pink-500/5 transition-all duration-300 hover:from-cyan-500/10 hover:to-pink-500/10"
            >
              <Avatar className="border-2 border-cyan-500/20">
                <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-pink-500 text-white">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <span className="flex items-center justify-between">
                <p className="text-sm font-medium leading-none">{member.name}</p>
                <p className={`${member.status?"text-green-500":"text-red-500"}`}>{member.status?"Active":"InActive"}</p>
                </span>
                <p className="text-sm text-muted-foreground flex items-center">
                  <Phone className="h-3 w-3 mr-1 text-cyan-500" />
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
              className="hover:bg-cyan-500/10 hover:text-cyan-500 transition-colors"
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
              className="hover:bg-pink-500/10 hover:text-pink-500 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </>
  )
}