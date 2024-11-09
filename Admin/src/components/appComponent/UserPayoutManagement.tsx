import { useState } from 'react'
import { Clock, CheckCircle, XCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

export default function Component() {
  const [showHistory, setShowHistory] = useState(false)
  const [payouts, setPayouts] = useState([
    { id: 1, user: 'John Doe', amount: 500, status: 'pending', date: '2023-11-01' },
    { id: 2, user: 'Jane Smith', amount: 750, status: 'completed', date: '2023-11-02' },
    { id: 3, user: 'Bob Johnson', amount: 1000, status: 'rejected', date: '2023-11-03' },
    { id: 4, user: 'Alice Brown', amount: 600, status: 'pending', date: '2023-11-04' },
    { id: 5, user: 'Charlie Davis', amount: 850, status: 'completed', date: '2023-11-05' },
  ])

  const currentPayouts = payouts.filter(payout => payout.status === 'pending')
  const historicalPayouts = payouts.filter(payout => payout.status !== 'pending')

  const handleStatusChange = (id: number, newStatus: string) => {
    setPayouts(payouts.map(payout => 
      payout.id === id ? { ...payout, status: newStatus } : payout
    ))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300"><Clock className="w-3 h-3 mr-1" />Pending</Badge>
      case 'completed':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>
      default:
        return null
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">User Payout Management</h1>
      <div className="flex space-x-4 mb-6">
        <Button 
          onClick={() => setShowHistory(false)}
          className={`flex-1 ${!showHistory ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
        >
          Current Transactions
        </Button>
        <Button 
          onClick={() => setShowHistory(true)}
          className={`flex-1 ${showHistory ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-800'}`}
        >
          Transaction History
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">User</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(showHistory ? historicalPayouts : currentPayouts).map((payout) => (
            <TableRow key={payout.id}>
              <TableCell className="font-medium">{payout.user}</TableCell>
              <TableCell>${payout.amount.toFixed(2)}</TableCell>
              <TableCell>{getStatusBadge(payout.status)}</TableCell>
              <TableCell>{payout.date}</TableCell>
              <TableCell className="text-right">
                <Select
                  onValueChange={(value) => handleStatusChange(payout.id, value)}
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
  )
}