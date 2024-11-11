import { useEffect, useState } from "react"
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
import { useUserOrdersDetails } from "@/hooks/useUserOrdersDetails"
import { useUserState } from "@/recoil/user"
import API_BASE_URL from "@/config"
import { useOrderDispatch } from "@/hooks/useOrderDispatch"

type Order = {
  id: string
  userName: string
  sareeName: string
  orderPlacedAt: string
  price: number
  image: string
  status: boolean
}


export default function OrderManagement() {
  const [user,] = useUserState()
  const { toast } = useToast()
  const [orders, setOrders] = useState<Order[]>()
  const [searchTerm, setSearchTerm] = useState("")
  const [showHistory, setShowHistory] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const ordersPerPage = 5
  const [isLoading,setIsLoading] = useState(false)

  const fetchAllUserOrdersDetails = async () => {
    const res = await useUserOrdersDetails(user.token)
    if(res && res.success){
      setOrders(res.ordersData)
    }
  }

  useEffect(()=>{
    fetchAllUserOrdersDetails()
  },[])

  const handleDispatchToggle = async(Id: string) => {
    setIsLoading(true)
    const responce = await useOrderDispatch(user.token,Id)
    if (responce && responce.success) {
      fetchAllUserOrdersDetails()
      toast({
        title: "Order Dispatched",
        description: "Order has been dispatched successfully",
      })
    }else{
      toast({
        title: "Error",
        description: "Something went wrong, please try again",
        variant: "destructive",
      })
    }
    setIsLoading(false)
  }

  if(!orders){
    return <div>Loading...</div>
  }

  const filteredOrders = orders.filter(order =>
    (order.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.sareeName.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (showHistory ? order.status : !order.status)
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
                        src={`${API_BASE_URL}/${order.image}`}
                        alt={order.sareeName}
                        width={50}
                        height={50}
                        className="rounded-md"
                      />
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={order.status ? "default" : "outline"}
                        className={`${order.status ? "bg-green-500 hover:bg-green-600" : "bg-yellow-500 hover:bg-yellow-600"} text-white`}
                      >
                        {order.status ? "Dispatched" : "Pending"}
                      </Badge>
                    </TableCell>
                    {!showHistory && (
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={order.status}
                            disabled={isLoading}
                            onCheckedChange={() => handleDispatchToggle(order.id)}
                          />
                          <span className="text-sm text-muted-foreground">
                            {order.status ? "Dispatched" : "Dispatch"}
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