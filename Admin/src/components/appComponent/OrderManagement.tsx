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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type Order = {
  id: number
  userName: string
  sareeName: string
  orderPlacedAt: string
  price: number
  image: string
  dispatched: boolean
}

const initialOrders: Order[] = [
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
  {
    id: 5,
    userName: "Ethan Hunt",
    sareeName: "Patola Silk",
    orderPlacedAt: "2023-07-19T16:00:00Z",
    price: 2099.99,
    image: "/placeholder.svg?height=100&width=100",
    dispatched: false,
  },
  {
    id: 6,
    userName: "Fiona Gallagher",
    sareeName: "Bandhani Silk",
    orderPlacedAt: "2023-07-20T13:30:00Z",
    price: 1399.99,
    image: "/placeholder.svg?height=100&width=100",
    dispatched: false,
  },
  {
    id: 7,
    userName: "George Weasley",
    sareeName: "Tussar Silk",
    orderPlacedAt: "2023-07-21T10:45:00Z",
    price: 1699.99,
    image: "/placeholder.svg?height=100&width=100",
    dispatched: true,
  },
  {
    id: 8,
    userName: "Hermione Granger",
    sareeName: "Uppada Silk",
    orderPlacedAt: "2023-07-22T09:00:00Z",
    price: 1899.99,
    image: "/placeholder.svg?height=100&width=100",
    dispatched: false,
  },
]

export default function OrderManagement() {
  const { toast } = useToast()
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [searchTerm, setSearchTerm] = useState("")
  const [showHistory, setShowHistory] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const ordersPerPage = 5

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
    (showHistory ? order.dispatched : !order.dispatched)
  )

  const indexOfLastOrder = currentPage * ordersPerPage
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder)
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage)

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-blue-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="bg-gradient-to-r from-pink-500 to-purple-500 text-white p-6 rounded-t-lg">
          <h1 className="text-2xl sm:text-3xl font-bold">Order Management</h1>
          <p className="text-pink-100 mt-2">View and manage customer orders</p>
        </header>
        <main className="bg-white/80 backdrop-blur-sm shadow-xl p-4 sm:p-6 rounded-b-lg">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
            <Button 
              onClick={() => {setShowHistory(false); setCurrentPage(1);}}
              className={`flex-1 ${!showHistory ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' : 'bg-gray-200 text-gray-800'}`}
              variant={"outline"}
            >
              Current Orders
            </Button>
            <Button 
              onClick={() => {setShowHistory(true); setCurrentPage(1);}}
              className={`flex-1 ${showHistory ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' : 'bg-gray-200 text-gray-800'}`}
              variant={"outline"}
            >
              Order History
            </Button>
          </div>
          <div className="mb-4">
            <Label htmlFor="search">Search Orders</Label>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                id="search"
                placeholder="Search by customer name or saree name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
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
                  {!showHistory && <TableHead className="w-[150px]">Action</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentOrders.map((order) => (
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
                    {!showHistory && (
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
          <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
            <Button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white w-full sm:w-auto"
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
            <span className="text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
            <Button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white w-full sm:w-auto"
            >
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </main>
      </div>
    </div>
  )
}