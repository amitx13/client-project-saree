import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useUserState } from "@/recoil/user"
import { useDashboardData } from "@/hooks/useDashboardData"
import { useEffect, useState } from "react"
import { Users, ShoppingCart } from "lucide-react"

interface DashboardData {
  totalUsers: number;
  totalActiveUsers: number;
  totalActiveUsersOrders: number;
  Top5UserWithMostReferralsData: {
    name: string;
    referralsCount: number;
  }[];
  todayActivity: {
    newUsers: number;
    pendingOrders: number;
  };
}



export default function AdminDashboard() {
  const [user] = useUserState()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)

  const fetchDashboardData = async () => {
    const data = await useDashboardData(user.token)
    if (data.success) {
      setDashboardData(data.data)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  function ActivityItem({ icon: Icon, label, value, color }: { icon: React.ComponentType<{ className?: string }>, label: string, value: number, color: string }) {
    return (
      <div className="flex items-center justify-between p-3 bg-white/60 dark:bg-black/60 rounded-lg backdrop-blur-sm transition-transform duration-300 hover:scale-105">
        <div className="flex items-center space-x-3">
          <Icon className={`h-6 w-6 ${color}`} />
          <p className="font-medium text-gray-700 dark:text-gray-200">{label}</p>
        </div>
        <span className={`text-lg font-bold ${color}`}>{value}</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-blue-100 flex-1 space-y-4 p-5">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <Tabs defaultValue="overview" className="space-y-4 ">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

            <Card className="bg-gradient-to-br from-pink-500 to-orange-400">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Total Users</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-white"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{dashboardData?.totalUsers}</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-cyan-500 to-blue-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Active Users</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-white"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{dashboardData?.totalActiveUsers}</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-400 to-emerald-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Total Orders</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-white"
                >
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <path d="M2 10h20" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{dashboardData?.totalActiveUsersOrders}</div>
              </CardContent>
            </Card>

          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          {dashboardData && <Card className="col-span-4 overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 transition-all duration-300 hover:shadow-lg">
              <CardHeader className="bg-white/40 dark:bg-black/40 backdrop-blur-sm">
                <CardTitle className="text-2xl font-bold dark:text-blue-300">User Activity</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <ActivityItem icon={Users} label="New Users" value={dashboardData?.todayActivity.newUsers} color="text-green-500" />
                  <ActivityItem icon={ShoppingCart} label="Pending Orders" value={dashboardData?.todayActivity.pendingOrders} color="text-orange-500" />
                </div>
              </CardContent>
            </Card>}
            
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Top Referrers</CardTitle>
                <CardDescription>Top 5 users with most referrals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData?.Top5UserWithMostReferralsData.map((user, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-[50%] text-sm font-medium">{user.name}</div>
                      <div className="w-[30%] bg-slate-100 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${( user.referralsCount/ 100) * 100}%` }}
                        ></div>
                      </div>
                      <div className="w-[20%] text-right text-sm text-muted-foreground">
                        {user.referralsCount}
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
  )
}