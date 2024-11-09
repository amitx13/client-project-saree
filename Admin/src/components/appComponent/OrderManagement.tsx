"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

// Sample order data
const initialOrders = [
  {
    id: 1,
    userName: "Alice Johnson",
    sareeName: "Banarasi Silk",
    orderPlacedAt: "2023-07-15T10:30:00Z",
    price: 1299.99,
    image: "/placeholder.svg?height=100&width=100",
    dispatched: false,
  },
  {
    id: 2,
    userName: "Bob Smith",
    sareeName: "Kanjivaram Silk",
    orderPlacedAt: "2023-07-16T14:45:00Z",
    price: 1599.99,
    image: "/placeholder.svg?height=100&width=100",
    dispatched: false,
  },
  {
    id: 3,
    userName: "Charlie Brown",
    sareeName: "Chanderi Silk",
    orderPlacedAt: "2023-07-17T09:15:00Z",
    price: 999.99,
    image: "/placeholder.svg?height=100&width=100",
    dispatched: true,
  },
  {
    id: 4,
    userName: "Diana Prince",
    sareeName: "Mysore Silk",
    orderPlacedAt: "2023-07-18T11:20:00Z",
    price: 1799.99,
    image: "/placeholder.svg?height=100&width=100",
    dispatched: true,
  },
]

export default function OrderManagement() {

    const { toast } = useToast()
  const [orders, setOrders] = useState(initialOrders)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("current")

  const handleDispatchToggle = (orderId: number) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, dispatched: !order.dispatched } : order
    ))
    const order = orders.find(o => o.id === orderId)
    toast({
      title: `Order ${order?.dispatched ? "Undispatched" : "Dispatched"}`,
      description: `Order #${orderId} has been ${order?.dispatched ? "undispatched" : "dispatched"}.`,
    })
  }

  const filteredOrders = orders.filter(order =>
    (order.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.sareeName.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (activeTab === "current" ? !order.dispatched : order.dispatched)
  )

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Order Management</CardTitle>
        <CardDescription>View and manage customer orders</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="current" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="current">Current Orders</TabsTrigger>
            <TabsTrigger value="history">Order History</TabsTrigger>
          </TabsList>
          <TabsContent value="current">
            <OrderTable
              orders={filteredOrders}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              handleDispatchToggle={handleDispatchToggle}
              showDispatchToggle={true}
            />
          </TabsContent>
          <TabsContent value="history">
            <OrderTable
              orders={filteredOrders}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              handleDispatchToggle={handleDispatchToggle}
              showDispatchToggle={false}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function OrderTable({ orders, searchTerm, setSearchTerm, handleDispatchToggle, showDispatchToggle }: { orders: typeof initialOrders, searchTerm: string, setSearchTerm: (value: string) => void, handleDispatchToggle: (orderId: number) => void, showDispatchToggle: boolean }) {
  return (
    <>
      <div className="mb-4">
        <Label htmlFor="search">Search Orders</Label>
        <Input
          id="search"
          placeholder="Search by customer name or saree name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px]">Customer Name</TableHead>
              <TableHead className="w-[150px]">Saree Name</TableHead>
              <TableHead className="w-[180px]">Order Placed At</TableHead>
              <TableHead className="w-[100px]">Price</TableHead>
              <TableHead className="w-[100px]">Image</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              {showDispatchToggle && <TableHead className="w-[150px]">Action</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.userName}</TableCell>
                <TableCell>{order.sareeName}</TableCell>
                <TableCell>{new Date(order.orderPlacedAt).toLocaleString()}</TableCell>
                <TableCell>₹{order.price.toFixed(2)}</TableCell>
                <TableCell>
                  <img
                    src={order.image}
                    alt={order.sareeName}
                    width={50}
                    height={50}
                    className="rounded-md"
                  />
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={order.dispatched ? "default" : "outline"}
                    className={`${order.dispatched ? "bg-green-500 hover:bg-green-600" : "bg-yellow-500 hover:bg-yellow-600"} text-white`}
                  >
                    {order.dispatched ? "Dispatched" : "Pending"}
                  </Badge>
                </TableCell>
                {showDispatchToggle && (
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={order.dispatched}
                        onCheckedChange={() => handleDispatchToggle(order.id)}
                      />
                      <span className="text-sm text-muted-foreground">
                        {order.dispatched ? "Dispatched" : "Dispatch"}
                      </span>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}