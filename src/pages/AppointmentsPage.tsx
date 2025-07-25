import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Calendar } from '@/components/ui/calendar'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { CalendarDays, Clock, User, Plus, Search, Filter } from 'lucide-react'

interface Appointment {
  id: string
  patientName: string
  doctorName: string
  date: string
  time: string
  type: string
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show'
  notes?: string
}

const mockAppointments: Appointment[] = [
  {
    id: '1',
    patientName: 'John Smith',
    doctorName: 'Dr. Sarah Wilson',
    date: '2024-01-25',
    time: '09:00',
    type: 'Consultation',
    status: 'scheduled',
    notes: 'Follow-up for hypertension'
  },
  {
    id: '2',
    patientName: 'Emily Johnson',
    doctorName: 'Dr. Michael Brown',
    date: '2024-01-25',
    time: '10:30',
    type: 'Surgery',
    status: 'scheduled',
    notes: 'Appendectomy procedure'
  },
  {
    id: '3',
    patientName: 'Robert Davis',
    doctorName: 'Dr. Sarah Wilson',
    date: '2024-01-24',
    time: '14:00',
    type: 'Check-up',
    status: 'completed'
  },
  {
    id: '4',
    patientName: 'Lisa Anderson',
    doctorName: 'Dr. James Miller',
    date: '2024-01-24',
    time: '11:00',
    type: 'Consultation',
    status: 'no-show'
  }
]

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      case 'no-show': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleNewAppointment = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const newAppointment: Appointment = {
      id: Date.now().toString(),
      patientName: formData.get('patientName') as string,
      doctorName: formData.get('doctorName') as string,
      date: formData.get('date') as string,
      time: formData.get('time') as string,
      type: formData.get('type') as string,
      status: 'scheduled',
      notes: formData.get('notes') as string
    }
    setAppointments([newAppointment, ...appointments])
    setIsDialogOpen(false)
  }

  const updateAppointmentStatus = (id: string, newStatus: Appointment['status']) => {
    setAppointments(appointments.map(apt => 
      apt.id === id ? { ...apt, status: newStatus } : apt
    ))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-600">Manage patient appointments and scheduling</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              New Appointment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Schedule New Appointment</DialogTitle>
              <DialogDescription>
                Create a new appointment for a patient
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleNewAppointment} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="patientName">Patient Name</Label>
                <Input id="patientName" name="patientName" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="doctorName">Doctor</Label>
                <Select name="doctorName" required>
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" name="date" type="date" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input id="time" name="time" type="time" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Appointment Type</Label>
                <Select name="type" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Consultation">Consultation</SelectItem>
                    <SelectItem value="Check-up">Check-up</SelectItem>
                    <SelectItem value="Surgery">Surgery</SelectItem>
                    <SelectItem value="Follow-up">Follow-up</SelectItem>
                    <SelectItem value="Emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" name="notes" placeholder="Additional notes..." />
              </div>
              <Button type="submit" className="w-full">Schedule Appointment</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search appointments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="no-show">No Show</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Appointments List */}
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => (
              <Card key={appointment.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <User className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{appointment.patientName}</h3>
                        <p className="text-gray-600">{appointment.doctorName}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <div className="flex items-center">
                            <CalendarDays className="w-4 h-4 mr-1" />
                            {appointment.date}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {appointment.time}
                          </div>
                          <Badge variant="outline">{appointment.type}</Badge>
                        </div>
                        {appointment.notes && (
                          <p className="text-sm text-gray-600 mt-2">{appointment.notes}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status}
                      </Badge>
                      {appointment.status === 'scheduled' && (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                          >
                            Complete
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                          >
                            Cancel
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Calendar Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
              <CardDescription>Select a date to view appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Today's Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Appointments</span>
                <span className="font-semibold">{appointments.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Scheduled</span>
                <span className="font-semibold text-blue-600">
                  {appointments.filter(a => a.status === 'scheduled').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Completed</span>
                <span className="font-semibold text-green-600">
                  {appointments.filter(a => a.status === 'completed').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">No Shows</span>
                <span className="font-semibold text-yellow-600">
                  {appointments.filter(a => a.status === 'no-show').length}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}