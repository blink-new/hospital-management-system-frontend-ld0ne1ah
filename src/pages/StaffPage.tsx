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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Users, UserPlus, Search, Mail, Phone, Calendar, MapPin, Edit, Trash2 } from 'lucide-react'

interface Staff {
  id: string
  name: string
  email: string
  phone: string
  role: 'admin' | 'doctor' | 'nurse' | 'pharmacist' | 'lab-technician' | 'receptionist'
  department: string
  status: 'active' | 'inactive' | 'on-leave'
  joinDate: string
  address: string
  emergencyContact: string
  specialization?: string
  licenseNumber?: string
  avatar?: string
}

const mockStaff: Staff[] = [
  {
    id: '1',
    name: 'Dr. Sarah Wilson',
    email: 'sarah.wilson@hospital.com',
    phone: '+1 (555) 123-4567',
    role: 'doctor',
    department: 'Cardiology',
    status: 'active',
    joinDate: '2020-03-15',
    address: '123 Medical Ave, City, State 12345',
    emergencyContact: '+1 (555) 987-6543',
    specialization: 'Interventional Cardiology',
    licenseNumber: 'MD123456',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '2',
    name: 'Dr. Michael Brown',
    email: 'michael.brown@hospital.com',
    phone: '+1 (555) 234-5678',
    role: 'doctor',
    department: 'Surgery',
    status: 'active',
    joinDate: '2019-08-22',
    address: '456 Health St, City, State 12345',
    emergencyContact: '+1 (555) 876-5432',
    specialization: 'General Surgery',
    licenseNumber: 'MD234567',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '3',
    name: 'Jennifer Davis',
    email: 'jennifer.davis@hospital.com',
    phone: '+1 (555) 345-6789',
    role: 'nurse',
    department: 'Emergency',
    status: 'active',
    joinDate: '2021-01-10',
    address: '789 Care Blvd, City, State 12345',
    emergencyContact: '+1 (555) 765-4321',
    licenseNumber: 'RN345678'
  },
  {
    id: '4',
    name: 'Robert Johnson',
    email: 'robert.johnson@hospital.com',
    phone: '+1 (555) 456-7890',
    role: 'pharmacist',
    department: 'Pharmacy',
    status: 'active',
    joinDate: '2020-11-05',
    address: '321 Pharmacy Rd, City, State 12345',
    emergencyContact: '+1 (555) 654-3210',
    licenseNumber: 'PharmD456789'
  },
  {
    id: '5',
    name: 'Lisa Anderson',
    email: 'lisa.anderson@hospital.com',
    phone: '+1 (555) 567-8901',
    role: 'lab-technician',
    department: 'Laboratory',
    status: 'on-leave',
    joinDate: '2022-02-14',
    address: '654 Lab Lane, City, State 12345',
    emergencyContact: '+1 (555) 543-2109',
    licenseNumber: 'MLT567890'
  },
  {
    id: '6',
    name: 'Amanda White',
    email: 'amanda.white@hospital.com',
    phone: '+1 (555) 678-9012',
    role: 'receptionist',
    department: 'Administration',
    status: 'active',
    joinDate: '2023-06-01',
    address: '987 Admin Ave, City, State 12345',
    emergencyContact: '+1 (555) 432-1098'
  }
]

export default function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>(mockStaff)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const filteredStaff = staff.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.department.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'all' || member.role === roleFilter
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800'
      case 'doctor': return 'bg-blue-100 text-blue-800'
      case 'nurse': return 'bg-green-100 text-green-800'
      case 'pharmacist': return 'bg-orange-100 text-orange-800'
      case 'lab-technician': return 'bg-cyan-100 text-cyan-800'
      case 'receptionist': return 'bg-pink-100 text-pink-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-red-100 text-red-800'
      case 'on-leave': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const newStaff: Staff = {
      id: Date.now().toString(),
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      role: formData.get('role') as Staff['role'],
      department: formData.get('department') as string,
      status: 'active',
      joinDate: new Date().toISOString().split('T')[0],
      address: formData.get('address') as string,
      emergencyContact: formData.get('emergencyContact') as string,
      specialization: formData.get('specialization') as string,
      licenseNumber: formData.get('licenseNumber') as string
    }
    setStaff([newStaff, ...staff])
    setIsDialogOpen(false)
  }

  const handleEditStaff = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedStaff) return
    
    const formData = new FormData(e.target as HTMLFormElement)
    const updatedStaff = {
      ...selectedStaff,
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      department: formData.get('department') as string,
      address: formData.get('address') as string,
      emergencyContact: formData.get('emergencyContact') as string,
      specialization: formData.get('specialization') as string,
      licenseNumber: formData.get('licenseNumber') as string,
      status: formData.get('status') as Staff['status']
    }
    
    setStaff(staff.map(member => 
      member.id === selectedStaff.id ? updatedStaff : member
    ))
    setIsEditDialogOpen(false)
    setSelectedStaff(null)
  }

  const deleteStaff = (id: string) => {
    setStaff(staff.filter(member => member.id !== id))
  }

  const activeStaff = staff.filter(member => member.status === 'active').length
  const onLeaveStaff = staff.filter(member => member.status === 'on-leave').length
  const doctors = staff.filter(member => member.role === 'doctor').length
  const nurses = staff.filter(member => member.role === 'nurse').length

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-gray-600">Manage hospital staff and personnel</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <UserPlus className="w-4 h-4 mr-2" />
              Add Staff Member
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Staff Member</DialogTitle>
              <DialogDescription>
                Add a new staff member to the hospital
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddStaff} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="phone" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select name="role" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="doctor">Doctor</SelectItem>
                      <SelectItem value="nurse">Nurse</SelectItem>
                      <SelectItem value="pharmacist">Pharmacist</SelectItem>
                      <SelectItem value="lab-technician">Lab Technician</SelectItem>
                      <SelectItem value="receptionist">Receptionist</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input id="department" name="department" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="licenseNumber">License Number</Label>
                  <Input id="licenseNumber" name="licenseNumber" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization</Label>
                <Input id="specialization" name="specialization" placeholder="If applicable" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea id="address" name="address" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Emergency Contact</Label>
                <Input id="emergencyContact" name="emergencyContact" required />
              </div>
              <Button type="submit" className="w-full">Add Staff Member</Button>
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
                <p className="text-sm font-medium text-gray-600">Total Staff</p>
                <p className="text-2xl font-bold">{staff.length}</p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Staff</p>
                <p className="text-2xl font-bold text-green-600">{activeStaff}</p>
              </div>
              <Users className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Doctors</p>
                <p className="text-2xl font-bold text-blue-600">{doctors}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">On Leave</p>
                <p className="text-2xl font-bold text-yellow-600">{onLeaveStaff}</p>
              </div>
              <Calendar className="w-8 h-8 text-yellow-500" />
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
                placeholder="Search staff..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="doctor">Doctor</SelectItem>
                <SelectItem value="nurse">Nurse</SelectItem>
                <SelectItem value="pharmacist">Pharmacist</SelectItem>
                <SelectItem value="lab-technician">Lab Technician</SelectItem>
                <SelectItem value="receptionist">Receptionist</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="on-leave">On Leave</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Staff Table */}
      <Card>
        <CardHeader>
          <CardTitle>Staff Directory</CardTitle>
          <CardDescription>Manage hospital staff members and their information</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Staff Member</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStaff.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-gray-500">{member.email}</div>
                        {member.specialization && (
                          <div className="text-sm text-gray-500">{member.specialization}</div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRoleColor(member.role)}>
                      {member.role.replace('-', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>{member.department}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Phone className="w-3 h-3 mr-1" />
                        {member.phone}
                      </div>
                      <div className="flex items-center text-sm">
                        <Mail className="w-3 h-3 mr-1" />
                        {member.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(member.status)}>
                      {member.status.replace('-', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>{member.joinDate}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedStaff(member)
                          setIsEditDialogOpen(true)
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteStaff(member.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Staff Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Staff Member</DialogTitle>
            <DialogDescription>
              Update staff member information
            </DialogDescription>
          </DialogHeader>
          {selectedStaff && (
            <form onSubmit={handleEditStaff} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Full Name</Label>
                  <Input id="edit-name" name="name" defaultValue={selectedStaff.name} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input id="edit-email" name="email" type="email" defaultValue={selectedStaff.email} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-phone">Phone</Label>
                  <Input id="edit-phone" name="phone" defaultValue={selectedStaff.phone} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-department">Department</Label>
                  <Input id="edit-department" name="department" defaultValue={selectedStaff.department} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select name="status" defaultValue={selectedStaff.status}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="on-leave">On Leave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-licenseNumber">License Number</Label>
                  <Input id="edit-licenseNumber" name="licenseNumber" defaultValue={selectedStaff.licenseNumber} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-specialization">Specialization</Label>
                <Input id="edit-specialization" name="specialization" defaultValue={selectedStaff.specialization} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-address">Address</Label>
                <Textarea id="edit-address" name="address" defaultValue={selectedStaff.address} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-emergencyContact">Emergency Contact</Label>
                <Input id="edit-emergencyContact" name="emergencyContact" defaultValue={selectedStaff.emergencyContact} required />
              </div>
              <Button type="submit" className="w-full">Update Staff Member</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}