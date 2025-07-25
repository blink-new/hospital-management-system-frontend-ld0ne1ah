import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TestTube, Clock, CheckCircle, AlertCircle, Plus, Search, Download, Eye } from 'lucide-react'

interface LabTest {
  id: string
  patientName: string
  patientId: string
  testType: string
  category: string
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled'
  priority: 'normal' | 'urgent' | 'stat'
  orderedBy: string
  orderedDate: string
  completedDate?: string
  results?: string
  notes?: string
  normalRange?: string
  value?: string
}

const mockLabTests: LabTest[] = [
  {
    id: '1',
    patientName: 'John Smith',
    patientId: 'P001',
    testType: 'Complete Blood Count',
    category: 'Hematology',
    status: 'completed',
    priority: 'normal',
    orderedBy: 'Dr. Sarah Wilson',
    orderedDate: '2024-01-23',
    completedDate: '2024-01-24',
    results: 'Normal',
    value: 'WBC: 7.2, RBC: 4.5, Hgb: 14.2',
    normalRange: 'WBC: 4.0-11.0, RBC: 4.2-5.4, Hgb: 12.0-15.5',
    notes: 'All values within normal limits'
  },
  {
    id: '2',
    patientName: 'Emily Johnson',
    patientId: 'P002',
    testType: 'Lipid Panel',
    category: 'Chemistry',
    status: 'in-progress',
    priority: 'normal',
    orderedBy: 'Dr. Michael Brown',
    orderedDate: '2024-01-24',
    normalRange: 'Total Cholesterol: <200, LDL: <100, HDL: >40'
  },
  {
    id: '3',
    patientName: 'Robert Davis',
    patientId: 'P003',
    testType: 'Troponin I',
    category: 'Cardiology',
    status: 'pending',
    priority: 'stat',
    orderedBy: 'Dr. James Miller',
    orderedDate: '2024-01-25',
    normalRange: '<0.04 ng/mL'
  },
  {
    id: '4',
    patientName: 'Lisa Anderson',
    patientId: 'P004',
    testType: 'Thyroid Function',
    category: 'Endocrinology',
    status: 'completed',
    priority: 'normal',
    orderedBy: 'Dr. Sarah Wilson',
    orderedDate: '2024-01-22',
    completedDate: '2024-01-23',
    results: 'Abnormal',
    value: 'TSH: 8.5, T4: 0.8',
    normalRange: 'TSH: 0.4-4.0, T4: 0.8-1.8',
    notes: 'Elevated TSH suggests hypothyroidism'
  },
  {
    id: '5',
    patientName: 'Michael Wilson',
    patientId: 'P005',
    testType: 'Glucose Tolerance Test',
    category: 'Endocrinology',
    status: 'in-progress',
    priority: 'normal',
    orderedBy: 'Dr. Lisa Davis',
    orderedDate: '2024-01-25',
    normalRange: 'Fasting: <100, 2hr: <140 mg/dL'
  }
]

export default function LaboratoryPage() {
  const [labTests, setLabTests] = useState<LabTest[]>(mockLabTests)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedTest, setSelectedTest] = useState<LabTest | null>(null)
  const [isResultsDialogOpen, setIsResultsDialogOpen] = useState(false)

  const filteredTests = labTests.filter(test => {
    const matchesSearch = test.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         test.testType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         test.patientId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || test.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || test.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />
      case 'in-progress': return <TestTube className="w-4 h-4" />
      case 'completed': return <CheckCircle className="w-4 h-4" />
      case 'cancelled': return <AlertCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'in-progress': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'stat': return 'bg-red-100 text-red-800'
      case 'urgent': return 'bg-orange-100 text-orange-800'
      case 'normal': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleNewTest = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const newTest: LabTest = {
      id: Date.now().toString(),
      patientName: formData.get('patientName') as string,
      patientId: formData.get('patientId') as string,
      testType: formData.get('testType') as string,
      category: formData.get('category') as string,
      status: 'pending',
      priority: formData.get('priority') as 'normal' | 'urgent' | 'stat',
      orderedBy: formData.get('orderedBy') as string,
      orderedDate: new Date().toISOString().split('T')[0],
      notes: formData.get('notes') as string,
      normalRange: formData.get('normalRange') as string
    }
    setLabTests([newTest, ...labTests])
    setIsDialogOpen(false)
  }

  const updateTestStatus = (id: string, newStatus: LabTest['status'], results?: string, value?: string) => {
    setLabTests(labTests.map(test => 
      test.id === id ? { 
        ...test, 
        status: newStatus,
        completedDate: newStatus === 'completed' ? new Date().toISOString().split('T')[0] : test.completedDate,
        results,
        value
      } : test
    ))
  }

  const handleAddResults = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTest) return
    
    const formData = new FormData(e.target as HTMLFormElement)
    updateTestStatus(
      selectedTest.id,
      'completed',
      formData.get('results') as string,
      formData.get('value') as string
    )
    setIsResultsDialogOpen(false)
    setSelectedTest(null)
  }

  const pendingTests = labTests.filter(test => test.status === 'pending').length
  const inProgressTests = labTests.filter(test => test.status === 'in-progress').length
  const completedTests = labTests.filter(test => test.status === 'completed').length
  const statTests = labTests.filter(test => test.priority === 'stat').length

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Laboratory</h1>
          <p className="text-gray-600">Manage lab tests and results</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              New Test Order
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Order New Lab Test</DialogTitle>
              <DialogDescription>
                Create a new laboratory test order
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleNewTest} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="patientName">Patient Name</Label>
                  <Input id="patientName" name="patientName" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="patientId">Patient ID</Label>
                  <Input id="patientId" name="patientId" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="testType">Test Type</Label>
                <Select name="testType" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select test type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Complete Blood Count">Complete Blood Count</SelectItem>
                    <SelectItem value="Lipid Panel">Lipid Panel</SelectItem>
                    <SelectItem value="Liver Function Test">Liver Function Test</SelectItem>
                    <SelectItem value="Kidney Function Test">Kidney Function Test</SelectItem>
                    <SelectItem value="Thyroid Function">Thyroid Function</SelectItem>
                    <SelectItem value="Glucose Tolerance Test">Glucose Tolerance Test</SelectItem>
                    <SelectItem value="Troponin I">Troponin I</SelectItem>
                    <SelectItem value="Urinalysis">Urinalysis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select name="category" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Hematology">Hematology</SelectItem>
                      <SelectItem value="Chemistry">Chemistry</SelectItem>
                      <SelectItem value="Cardiology">Cardiology</SelectItem>
                      <SelectItem value="Endocrinology">Endocrinology</SelectItem>
                      <SelectItem value="Microbiology">Microbiology</SelectItem>
                      <SelectItem value="Immunology">Immunology</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select name="priority" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="stat">STAT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="orderedBy">Ordered By</Label>
                <Select name="orderedBy" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dr. Sarah Wilson">Dr. Sarah Wilson</SelectItem>
                    <SelectItem value="Dr. Michael Brown">Dr. Michael Brown</SelectItem>
                    <SelectItem value="Dr. James Miller">Dr. James Miller</SelectItem>
                    <SelectItem value="Dr. Lisa Davis">Dr. Lisa Davis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="normalRange">Normal Range</Label>
                <Input id="normalRange" name="normalRange" placeholder="e.g., 4.0-11.0 x10³/μL" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" name="notes" placeholder="Additional notes..." />
              </div>
              <Button type="submit" className="w-full">Order Test</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Tests</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingTests}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">{inProgressTests}</p>
              </div>
              <TestTube className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{completedTests}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">STAT Orders</p>
                <p className="text-2xl font-bold text-red-600">{statTests}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search tests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="stat">STAT</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lab Tests Table */}
      <Card>
        <CardHeader>
          <CardTitle>Laboratory Tests</CardTitle>
          <CardDescription>Manage and track laboratory test orders</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Test Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ordered Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTests.map((test) => (
                <TableRow key={test.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{test.patientName}</div>
                      <div className="text-sm text-gray-500">{test.patientId}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{test.testType}</div>
                      <div className="text-sm text-gray-500">{test.orderedBy}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{test.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(test.priority)}>
                      {test.priority.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(test.status)}>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(test.status)}
                        <span>{test.status}</span>
                      </div>
                    </Badge>
                  </TableCell>
                  <TableCell>{test.orderedDate}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {test.status === 'pending' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateTestStatus(test.id, 'in-progress')}
                        >
                          Start
                        </Button>
                      )}
                      {test.status === 'in-progress' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedTest(test)
                            setIsResultsDialogOpen(true)
                          }}
                        >
                          Add Results
                        </Button>
                      )}
                      {test.status === 'completed' && (
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Results Dialog */}
      <Dialog open={isResultsDialogOpen} onOpenChange={setIsResultsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Test Results</DialogTitle>
            <DialogDescription>
              Enter the results for {selectedTest?.testType}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddResults} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="value">Test Values</Label>
              <Textarea 
                id="value" 
                name="value" 
                placeholder="Enter test values..."
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="results">Interpretation</Label>
              <Select name="results" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select interpretation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Normal">Normal</SelectItem>
                  <SelectItem value="Abnormal">Abnormal</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                  <SelectItem value="Inconclusive">Inconclusive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <Label className="text-sm font-medium">Normal Range:</Label>
              <p className="text-sm text-gray-600">{selectedTest?.normalRange || 'Not specified'}</p>
            </div>
            <Button type="submit" className="w-full">Complete Test</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}