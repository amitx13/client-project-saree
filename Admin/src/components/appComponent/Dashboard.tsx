import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, Line, LineChart, ResponsiveContainer } from "recharts"

export default function Dashboard() {
  // Sample data - replace with actual data in a real application
  const revenueData = [
    { name: "Jan", total: 1500 },
    { name: "Feb", total: 2300 },
    { name: "Mar", total: 3200 },
    { name: "Apr", total: 2800 },
    { name: "May", total: 3600 },
    { name: "Jun", total: 4200 },
  ]

  const userActivityData = [
    { name: "Mon", newUsers: 120, activatedAccounts: 95, pendingOrders: 35 },
    { name: "Tue", newUsers: 150, activatedAccounts: 110, pendingOrders: 40 },
    { name: "Wed", newUsers: 180, activatedAccounts: 130, pendingOrders: 45 },
    { name: "Thu", newUsers: 190, activatedAccounts: 150, pendingOrders: 50 },
    { name: "Fri", newUsers: 210, activatedAccounts: 170, pendingOrders: 55 },
    { name: "Sat", newUsers: 160, activatedAccounts: 120, pendingOrders: 30 },
    { name: "Sun", newUsers: 140, activatedAccounts: 100, pendingOrders: 25 },
  ]

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics" disabled>Analytics</TabsTrigger>
          <TabsTrigger value="reports" disabled>Reports</TabsTrigger>
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
                <div className="text-2xl font-bold text-white">45,231</div>
                <p className="text-xs text-white/80">+20.1% from last month</p>
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
                <div className="text-2xl font-bold text-white">32,845</div>
                <p className="text-xs text-white/80">+18.7% from last month</p>
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
                <div className="text-2xl font-bold text-white">12,234</div>
                <p className="text-xs text-white/80">+7.4% from last month</p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <ChartContainer
                  config={{
                    total: {
                      label: "Total Revenue",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[200px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData}>
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="total" fill="var(--color-total)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Top Referrers</CardTitle>
                <CardDescription>Top 5 users with most referrals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Alice Johnson", referrals: 45 },
                    { name: "Bob Smith", referrals: 38 },
                    { name: "Charlie Brown", referrals: 32 },
                    { name: "Diana Ross", referrals: 28 },
                    { name: "Ethan Hunt", referrals: 25 },
                  ].map((user, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-[50%] text-sm font-medium">{user.name}</div>
                      <div className="w-[30%] bg-slate-100 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${(user.referrals / 45) * 100}%` }}
                        ></div>
                      </div>
                      <div className="w-[20%] text-right text-sm text-muted-foreground">
                        {user.referrals}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>User Activity</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <ChartContainer
                  config={{
                    newUsers: {
                      label: "New Users",
                      color: "hsl(var(--chart-1))",
                    },
                    activatedAccounts: {
                      label: "Activated Accounts",
                      color: "hsl(var(--chart-2))",
                    },
                    pendingOrders: {
                      label: "Pending Orders",
                      color: "hsl(var(--chart-3))",
                    },
                  }}
                  className="h-[200px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={userActivityData}>
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="newUsers" stroke="var(--color-newUsers)" strokeWidth={2} />
                      <Line type="monotone" dataKey="activatedAccounts" stroke="var(--color-activatedAccounts)" strokeWidth={2} />
                      <Line type="monotone" dataKey="pendingOrders" stroke="var(--color-pendingOrders)" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Network Growth</CardTitle>
                <CardDescription>Monthly network growth rate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-5xl font-bold text-primary">8.7%</div>
                  <p className="text-sm text-muted-foreground mt-2">Average monthly growth</p>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">New Connections</span>
                    <span className="text-sm text-muted-foreground">1,234</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Active Partnerships</span>
                    <span className="text-sm text-muted-foreground">567</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Community Engagement</span>
                    <span className="text-sm text-muted-foreground">89%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}