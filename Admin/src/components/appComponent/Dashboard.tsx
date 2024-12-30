import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { useUserState } from "@/recoil/user"
import { useDashboardData } from "@/hooks/useDashboardData"
import { useEffect, useState } from "react"
import { Users, ShoppingCart, Users2 } from 'lucide-react'
import { useNavigate } from "react-router-dom"

interface DashboardData {
  totalUsers: number
  totalActiveUsers: number
  totalActiveUsersOrders: number
  Top5UserWithMostReferralsData: {
    name: string
    id: string
    referralsCount: number
  }[]
  todayActivity: {
    newUsers: number
    pendingOrders: number
  }
}

function ActivityItem({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: number
  color: string
}) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-white/60 p-4 backdrop-blur-sm transition-transform duration-300 hover:scale-105 dark:bg-black/60">
      <div className="flex items-center gap-3">
        <Icon className={`h-5 w-5 ${color}`} />
        <p className="font-medium text-gray-700 dark:text-gray-200">{label}</p>
      </div>
      <span className={`text-lg font-bold ${color}`}>{value}</span>
    </div>
  )
}

export default function AdminDashboard() {
  const [user] = useUserState()
  const navigate = useNavigate()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)

  const fetchDashboardData = async () => {
    const data = await useDashboardData(user.token)
    if (data.success) {
      setDashboardData(data.data)
    }
  }

  useEffect(() => {
    if(!user){
      navigate("/login")
      return
    }
    fetchDashboardData()
  }, [])

  return (
    <div className="flex min-h-screen  w-full items-center justify-center bg-gradient-to-br from-pink-100 to-blue-100 p-4 md:p-6">
      <div className="w-full max-w-screen-xl lg:-translate-y-20">
        <div className="rounded-xl bg-white/30 p-6 backdrop-blur-sm">
          <Tabs defaultValue="overview" className="space-y-8">
            <TabsContent value="overview" className="space-y-8">
              {/* Stats Cards */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="cursor-pointer bg-gradient-to-br from-pink-500 to-orange-400 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <CardTitle className="text-sm font-medium text-white">Total Users</CardTitle>
                    <Users2 className="h-4 w-4 text-white" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white">{dashboardData?.totalUsers || 0}</div>
                  </CardContent>
                </Card>

                <Card
                  className="cursor-pointer bg-gradient-to-br from-cyan-500 to-blue-500 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
                  onClick={() => navigate("/users")}
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <CardTitle className="text-sm font-medium text-white">Total Active Users</CardTitle>
                    <Users className="h-4 w-4 text-white" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white">{dashboardData?.totalActiveUsers || 0}</div>
                  </CardContent>
                </Card>

                <Card
                  className="cursor-pointer bg-gradient-to-br from-green-400 to-emerald-500 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
                  onClick={() => navigate("/orders")}
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <CardTitle className="text-sm font-medium text-white">Total Orders</CardTitle>
                    <ShoppingCart className="h-4 w-4 text-white" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white">{dashboardData?.totalActiveUsersOrders || 0}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Activity and Referrals Section */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-8">
                {dashboardData && (
                  <Card className="col-span-4 overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 transition-all duration-300 hover:shadow-xl dark:from-blue-900 dark:to-purple-900">
                    <CardHeader className="bg-white/40 backdrop-blur-sm dark:bg-black/40">
                      <CardTitle className="text-xl font-bold dark:text-blue-300">User Activity</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <ActivityItem
                          icon={Users}
                          label="Users Joined Today"
                          value={dashboardData?.todayActivity.newUsers}
                          color="text-green-500"
                        />
                        <ActivityItem
                          icon={ShoppingCart}
                          label="Current Pending Orders"
                          value={dashboardData?.todayActivity.pendingOrders}
                          color="text-orange-500"
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card className="col-span-4 transition-all duration-300 hover:shadow-xl">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl">Top Referrers</CardTitle>
                    <CardDescription>Top 5 users with most referrals</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-5">
                      {dashboardData?.Top5UserWithMostReferralsData.map((user, index) => (
                        <div 
                          key={index} 
                          className="group flex flex-col gap-2 rounded-lg p-2 transition-colors hover:bg-slate-50 sm:flex-row sm:items-center sm:gap-4"
                        >
                          <div className="flex min-w-[180px] flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
                            <div className="font-medium">{user?.name}</div>
                            <div className="text-sm text-muted-foreground">{user?.id}</div>
                          </div>
                          <div className="flex flex-1 items-center gap-3">
                            <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                              <div
                                className="h-2 rounded-full bg-primary transition-all duration-500 group-hover:opacity-80"
                                style={{ width: `${(user?.referralsCount / 100) * 100}%` }}
                              />
                            </div>
                            <div className="min-w-[3rem] text-right text-sm font-medium text-muted-foreground">
                              {user?.referralsCount}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

