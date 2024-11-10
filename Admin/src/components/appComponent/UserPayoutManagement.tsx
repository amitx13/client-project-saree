import { useState } from 'react'
import { Clock, CheckCircle, XCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

type Payout = {
  id: number;
  user: string;
  amount: number;
  status: 'pending' | 'completed' | 'rejected';
  date: string;
}

export default function UserPayoutManagement() {
  const [showHistory, setShowHistory] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [payouts, setPayouts] = useState<Payout[]>([
    { id: 1, user: 'John Doe', amount: 500, status: 'pending', date: '2023-11-01' },
    { id: 2, user: 'Jane Smith', amount: 750, status: 'completed', date: '2023-11-02' },
    { id: 3, user: 'Bob Johnson', amount: 1000, status: 'rejected', date: '2023-11-03' },
    { id: 4, user: 'Alice Brown', amount: 600, status: 'pending', date: '2023-11-04' },
    { id: 5, user: 'Charlie Davis', amount: 850, status: 'completed', date: '2023-11-05' },
    { id: 6, user: 'Eva White', amount: 450, status: 'pending', date: '2023-11-06' },
    { id: 7, user: 'Frank Miller', amount: 1200, status: 'completed', date: '2023-11-07' },
    { id: 8, user: 'Grace Lee', amount: 950, status: 'rejected', date: '2023-11-08' },
    { id: 9, user: 'Henry Wilson', amount: 700, status: 'pending', date: '2023-11-09' },
    { id: 10, user: 'Ivy Taylor', amount: 550, status: 'completed', date: '2023-11-10' },
    { id: 11, user: 'Jack Robinson', amount: 800, status: 'pending', date: '2023-11-11' },
    { id: 12, user: 'Kelly Martinez', amount: 1100, status: 'rejected', date: '2023-11-12' },
  ])

  const payoutsPerPage = 5
  const indexOfLastPayout = currentPage * payoutsPerPage
  const indexOfFirstPayout = indexOfLastPayout - payoutsPerPage
  const currentPayouts = payouts.filter(payout => payout.status === 'pending')
  const historicalPayouts = payouts.filter(payout => payout.status !== 'pending')
  const displayedPayouts = (showHistory ? historicalPayouts : currentPayouts).slice(indexOfFirstPayout, indexOfLastPayout)
  const totalPages = Math.ceil((showHistory ? historicalPayouts.length : currentPayouts.length) / payoutsPerPage)

  const handleStatusChange = (id: number, newStatus: 'pending' | 'completed' | 'rejected') => {
    setPayouts(payouts.map(payout => 
      payout.id === id ? { ...payout, status: newStatus } : payout
    ))
  }

  const getStatusBadge = (status: 'pending' | 'completed' | 'rejected') => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300"><Clock className="w-3 h-3 mr-1" />Pending</Badge>
      case 'completed':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-blue-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="bg-gradient-to-r from-pink-500 to-purple-500 text-white p-6 rounded-t-lg">
          <h1 className="text-2xl sm:text-3xl font-bold">User Payout Management</h1>
          <p className="text-pink-100 mt-2">Manage and track user payouts</p>
        </header>
        <main className="bg-white/80 backdrop-blur-sm shadow-xl p-4 sm:p-6 rounded-b-lg">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
            <Button 
              onClick={() => {setShowHistory(false); setCurrentPage(1);}}
              className={`flex-1 ${!showHistory ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' : 'bg-gray-200 text-gray-800'}`}
              variant={"outline"}
            >
              Current Transactions
            </Button>
            <Button 
              onClick={() => {setShowHistory(true); setCurrentPage(1);}}
              className={`flex-1 ${showHistory ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' : 'bg-gray-200 text-gray-800'}`}
              variant={"outline"}
            >
              Transaction History
            </Button>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">User</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead >Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedPayouts.map((payout) => (
                  <TableRow key={payout.id}>
                    <TableCell className="font-medium">{payout.user}</TableCell>
                    <TableCell>${payout.amount.toFixed(2)}</TableCell>
                    <TableCell>{getStatusBadge(payout.status)}</TableCell>
                    <TableCell>{payout.date}</TableCell>
                    <TableCell>
                      <Select
                        onValueChange={(value) => handleStatusChange(payout.id, value as 'pending' | 'completed' | 'rejected')}
                        defaultValue={payout.status}
                      >
                        <SelectTrigger className="w-[130px]">
                          <SelectValue placeholder="Update status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
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