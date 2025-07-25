import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { DollarSign, TrendingUp, TrendingDown, CreditCard, Download, Search, Calendar } from 'lucide-react'

interface Transaction {
  id: string
  type: 'income' | 'expense'
  category: string
  description: string
  amount: number
  date: string
  status: 'completed' | 'pending' | 'cancelled'
  patientId?: string
  patientName?: string
}

interface RevenueData {
  month: string
  revenue: number
  expenses: number
  profit: number
}

const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'income',
    category: 'Consultation',
    description: 'Patient consultation fee',
    amount: 150,
    date: '2024-01-25',
    status: 'completed',
    patientId: 'P001',
    patientName: 'John Smith'
  },
  {
    id: '2',
    type: 'income',
    category: 'Surgery',
    description: 'Appendectomy procedure',
    amount: 5000,
    date: '2024-01-24',
    status: 'completed',
    patientId: 'P002',
    patientName: 'Emily Johnson'
  },
  {
    id: '3',
    type: 'expense',
    category: 'Medical Supplies',
    description: 'Surgical instruments purchase',
    amount: 2500,
    date: '2024-01-23',
    status: 'completed'
  },
  {
    id: '4',
    type: 'income',
    category: 'Laboratory',
    description: 'Blood test panel',
    amount: 200,
    date: '2024-01-23',
    status: 'completed',
    patientId: 'P003',
    patientName: 'Robert Davis'
  },
  {
    id: '5',
    type: 'expense',
    category: 'Utilities',
    description: 'Monthly electricity bill',
    amount: 800,
    date: '2024-01-22',
    status: 'completed'
  },
  {
    id: '6',
    type: 'income',
    category: 'Pharmacy',
    description: 'Medication sales',
    amount: 450,
    date: '2024-01-22',
    status: 'completed'
  },
  {
    id: '7',
    type: 'expense',
    category: 'Staff Salary',
    description: 'Monthly staff salaries',
    amount: 15000,
    date: '2024-01-21',
    status: 'completed'
  },
  {
    id: '8',
    type: 'income',
    category: 'Insurance',
    description: 'Insurance reimbursement',
    amount: 3200,
    date: '2024-01-20',
    status: 'pending'
  }
]

const revenueData: RevenueData[] = [
  { month: 'Jan', revenue: 45000, expenses: 32000, profit: 13000 },
  { month: 'Feb', revenue: 52000, expenses: 35000, profit: 17000 },
  { month: 'Mar', revenue: 48000, expenses: 33000, profit: 15000 },
  { month: 'Apr', revenue: 61000, expenses: 38000, profit: 23000 },
  { month: 'May', revenue: 55000, expenses: 36000, profit: 19000 },
  { month: 'Jun', revenue: 67000, expenses: 41000, profit: 26000 }
]

const expenseCategories = [
  { name: 'Staff Salary', value: 45000, color: '#0066CC' },
  { name: 'Medical Supplies', value: 18000, color: '#00A86B' },
  { name: 'Utilities', value: 8000, color: '#FF6B6B' },
  { name: 'Equipment', value: 12000, color: '#4ECDC4' },
  { name: 'Maintenance', value: 5000, color: '#45B7D1' },
  { name: 'Other', value: 7000, color: '#96CEB4' }
]

export default function FinancialPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [dateRange, setDateRange] = useState<string>('all')

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (transaction.patientName && transaction.patientName.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter
    return matchesSearch && matchesType && matchesStatus
  })

  const totalRevenue = transactions
    .filter(t => t.type === 'income' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions
    .filter(t => t.type === 'expense' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0)

  const netProfit = totalRevenue - totalExpenses

  const pendingPayments = transactions
    .filter(t => t.type === 'income' && t.status === 'pending')
    .reduce((sum, t) => sum + t.amount, 0)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    return type === 'income' ? 'text-green-600' : 'text-red-600'
  }

  const exportToCSV = () => {
    const headers = ['Date', 'Type', 'Category', 'Description', 'Amount', 'Status', 'Patient']
    const csvContent = [
      headers.join(','),
      ...filteredTransactions.map(t => [
        t.date,
        t.type,
        t.category,
        `"${t.description}"`,
        t.amount,
        t.status,
        t.patientName || ''
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'financial-report.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Financial Reports</h1>
          <p className="text-gray-600">Monitor hospital finances and revenue</p>
        </div>
        <Button onClick={exportToCSV} className="bg-primary hover:bg-primary/90">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">${totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">+12% from last month</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                <p className="text-2xl font-bold text-red-600">${totalExpenses.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">+5% from last month</p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Net Profit</p>
                <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${netProfit.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {netProfit >= 0 ? '+' : ''}
                  {((netProfit / totalRevenue) * 100).toFixed(1)}% margin
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Payments</p>
                <p className="text-2xl font-bold text-yellow-600">${pendingPayments.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {transactions.filter(t => t.status === 'pending').length} transactions
                </p>
              </div>
              <CreditCard className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList>
          <TabsTrigger value="revenue">Revenue Trends</TabsTrigger>
          <TabsTrigger value="expenses">Expense Breakdown</TabsTrigger>
          <TabsTrigger value="profit">Profit Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue vs Expenses</CardTitle>
              <CardDescription>Track revenue and expense trends over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
                  <Bar dataKey="revenue" fill="#00A86B" name="Revenue" />
                  <Bar dataKey="expenses" fill="#FF6B6B" name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Expense Categories</CardTitle>
              <CardDescription>Breakdown of expenses by category</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={expenseCategories}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {expenseCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profit Trends</CardTitle>
              <CardDescription>Monthly profit analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
                  <Line 
                    type="monotone" 
                    dataKey="profit" 
                    stroke="#0066CC" 
                    strokeWidth={3}
                    name="Profit"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Detailed view of all financial transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getTypeColor(transaction.type)}>
                      {transaction.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{transaction.category}</TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate">{transaction.description}</div>
                  </TableCell>
                  <TableCell>
                    {transaction.patientName ? (
                      <div>
                        <div className="font-medium">{transaction.patientName}</div>
                        <div className="text-sm text-gray-500">{transaction.patientId}</div>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className={`font-semibold ${getTypeColor(transaction.type)}`}>
                      {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(transaction.status)}>
                      {transaction.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}