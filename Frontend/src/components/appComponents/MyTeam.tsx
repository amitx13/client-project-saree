import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CopyIcon, Users, UserPlus, Phone, ChevronLeft, ChevronRight, Network, ChevronRightCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useLogout, useUserState } from "@/recoil/user";
import { useNavigate } from "react-router-dom";
import { useUserTeamData } from "@/hooks/useUserTeamData";
import { Input } from "../ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Badge } from "@/components/ui/badge";

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
  referalTree: {
    id: string;
    userId: string;
    level1: string[]|null;
    level2: string[]|null;
    level3: string[]|null;
    level4: string[]|null;
    level5: string[]|null;
    level6: string[]|null;
  }
  referalTreeDetails:{
    level: number;
    name: string;
    mobile: string;
    userId: string;
    status: boolean;
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
            <LevelDetailsDialog {...userData} />
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
                <div className="flex items-center space-x-2">
                <p className="text-sm font-medium leading-none">ID: {member.userId}</p>
                <p className="text-sm text-muted-foreground flex items-center">
                  <Phone className="h-3 w-3 mr-1 text-cyan-500" />
                  {member.mobile}
                </p>
                </div>
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

const LevelDetailsDialog = ( userData:UserDataProps ) => {
  const USERS_PER_PAGE = 5
  const [selectedLevel, setSelectedLevel] = useState<number |null>();
  const [isOpen, setIsOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1)

  const filteredUsers = userData.referalTreeDetails.filter(
    (user) =>
      selectedLevel !== null &&
      selectedLevel !== undefined &&
      user.level === selectedLevel + 1
  )

  // Calculate total pages
  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE)

  // Get current page users
  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  )

  // Reset page when level changes
  const handleLevelSelect = (index: number) => {
    setSelectedLevel(index)
    setCurrentPage(1)
    setIsOpen(true)
  }

  return (
    <div className="mx-4 mb-4">
      <div className="space-y-3 ">
        {[
          { level: 'Level 1', count: userData.referalTree?.level1?.length || 0 },
          { level: 'Level 2', count: userData.referalTree?.level2?.length || 0 },
          { level: 'Level 3', count: userData.referalTree?.level3?.length || 0 },
          { level: 'Level 4', count: userData.referalTree?.level4?.length || 0 },
          { level: 'Level 5', count: userData.referalTree?.level5?.length || 0 },
          { level: 'Level 6', count: userData.referalTree?.level6?.length || 0 },
        ].map((item, index) => (
          <div
            key={index}
            onClick={() => handleLevelSelect(index)}
            className="flex items-center p-3 justify-between rounded-lg bg-gradient-to-r from-blue-500/10 to-cyan-500/10 transition-all duration-300 hover:from-blue-500/20 hover:to-cyan-500/20 cursor-pointer"
          >
            <div className="justify-between flex items-center w-11/12">
            <p className="text-sm font-medium">{item.level}</p>
            <span className="font-semibold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
              {item.count}
            </span>
            </div>
            <ChevronRightCircle />
          </div>
        ))}
      </div>

      <Dialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader className="-translate-y-2">
            <DialogTitle>
              Level{" "}
              {selectedLevel !== null && selectedLevel !== undefined
                ? selectedLevel + 1
                : "N/A"}
            </DialogTitle>
            <DialogDescription>
              Level{" "}
              {selectedLevel !== null && selectedLevel !== undefined
                ? selectedLevel + 1
                : "N/A"}{" "}
              Members
            </DialogDescription>
          </DialogHeader>
          {userData.referalTreeDetails.length !== 0 ?
          <div className="mt-4 w-full">
            <div className="w-full overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-200 rounded-md">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 py-3 text-left text-sm font-medium text-gray-700">
                      User ID
                    </th>
                    <th className="px-3 py-3 text-left text-sm font-medium text-gray-700">
                      Name
                    </th>
                    <th className="px-3 py-3 text-left text-sm font-medium text-gray-700">
                      Mobile
                    </th>
                    <th className="px-3 py-3 text-left text-sm font-medium text-gray-700">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentUsers.map((user, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-3 py-3 text-sm font-medium">
                        {user.userId}
                      </td>
                      <td className="px-3 py-3 text-sm font-medium">
                        {user.name}
                      </td>
                      <td className="px-3 py-3 text-sm ">{user.mobile}</td>
                      <td>
                        <Badge
                          className={`px-3 py-1 rounded-md ${
                            user.status
                              ? "bg-green-500 hover:bg-green-600"
                              : "bg-red-500 hover:bg-red-600"
                          }`}
                        >
                          {user.status ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-between space-x-2 py-4">
                <div className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
          :
          <div className="flex items-center justify-center">
            <p className="text-lg text-gray-500">No members found</p>
          </div>}
        </DialogContent>
      </Dialog>
    </div>
  );
};