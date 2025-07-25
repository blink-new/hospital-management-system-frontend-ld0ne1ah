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
import { Pill, AlertTriangle, Plus, Search, Package, TrendingDown, TrendingUp } from 'lucide-react'

interface Medicine {
  id: string
  name: string
  category: string
  stock: number
  minStock: number
  price: number
  expiryDate: string
  supplier: string
  batchNumber: string
}

const mockMedicines: Medicine[] = [
  {
    id: '1',
    name: 'Paracetamol 500mg',
    category: 'Pain Relief',
    stock: 150,
    minStock: 50,
    price: 0.25,
    expiryDate: '2025-06-15',
    supplier: 'PharmaCorp',
    batchNumber: 'PC2024001'
  },
  {
    id: '2',
    name: 'Amoxicillin 250mg',
    category: 'Antibiotic',
    stock: 25,
    minStock: 30,
    price: 1.50,
    expiryDate: '2024-12-20',
    supplier: 'MediSupply',
    batchNumber: 'MS2024015'
  },
  {
    id: '3',
    name: 'Insulin Glargine',
    category: 'Diabetes',
    stock: 80,
    minStock: 20,
    price: 45.00,
    expiryDate: '2025-03-10',
    supplier: 'DiabetesCare',
    batchNumber: 'DC2024008'
  },
  {
    id: '4',
    name: 'Lisinopril 10mg',
    category: 'Cardiovascular',
    stock: 5,
    minStock: 25,
    price: 0.75,
    expiryDate: '2024-11-30',
    supplier: 'CardioMed',
    batchNumber: 'CM2024022'
  },
  {
    id: '5',
    name: 'Omeprazole 20mg',
    category: 'Gastric',
    stock: 200,
    minStock: 40,
    price: 0.85,
    expiryDate: '2025-08-25',
    supplier: 'GastroPharm',
    batchNumber: 'GP2024011'
  }
]

export default function PharmacyPage() {
  const [medicines, setMedicines] = useState<Medicine[]>(mockMedicines)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         medicine.supplier.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || medicine.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const lowStockMedicines = medicines.filter(med => med.stock <= med.minStock)
  const expiringMedicines = medicines.filter(med => {
    const expiryDate = new Date(med.expiryDate)
    const threeMonthsFromNow = new Date()
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3)
    return expiryDate <= threeMonthsFromNow
  })

  const getStockStatus = (medicine: Medicine) => {
    if (medicine.stock <= medicine.minStock * 0.5) return 'critical'
    if (medicine.stock <= medicine.minStock) return 'low'
    return 'normal'
  }

  const getStockBadge = (medicine: Medicine) => {
    const status = getStockStatus(medicine)
    switch (status) {
      case 'critical':
        return <Badge className="bg-red-100 text-red-800">Critical</Badge>
      case 'low':
        return <Badge className="bg-yellow-100 text-yellow-800">Low Stock</Badge>
      default:
        return <Badge className="bg-green-100 text-green-800">In Stock</Badge>
    }
  }

  const handleAddMedicine = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const newMedicine: Medicine = {
      id: Date.now().toString(),
      name: formData.get('name') as string,
      category: formData.get('category') as string,
      stock: parseInt(formData.get('stock') as string),
      minStock: parseInt(formData.get('minStock') as string),
      price: parseFloat(formData.get('price') as string),
      expiryDate: formData.get('expiryDate') as string,
      supplier: formData.get('supplier') as string,
      batchNumber: formData.get('batchNumber') as string
    }
    setMedicines([newMedicine, ...medicines])
    setIsDialogOpen(false)
  }

  const updateStock = (id: string, newStock: number) => {
    setMedicines(medicines.map(med => 
      med.id === id ? { ...med, stock: Math.max(0, newStock) } : med
    ))
  }

  const totalValue = medicines.reduce((sum, med) => sum + (med.stock * med.price), 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pharmacy Inventory</h1>
          <p className="text-gray-600">Manage medicine stock and inventory</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Medicine
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Medicine</DialogTitle>
              <DialogDescription>
                Add a new medicine to the inventory
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddMedicine} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Medicine Name</Label>
                  <Input id="name" name="name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select name="category" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pain Relief">Pain Relief</SelectItem>
                      <SelectItem value="Antibiotic">Antibiotic</SelectItem>
                      <SelectItem value="Diabetes">Diabetes</SelectItem>
                      <SelectItem value="Cardiovascular">Cardiovascular</SelectItem>
                      <SelectItem value="Gastric">Gastric</SelectItem>
                      <SelectItem value="Respiratory">Respiratory</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stock">Current Stock</Label>
                  <Input id="stock" name="stock" type="number" min="0" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minStock">Minimum Stock</Label>
                  <Input id="minStock" name="minStock" type="number" min="0" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price per Unit ($)</Label>
                  <Input id="price" name="price" type="number" step="0.01" min="0" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input id="expiryDate" name="expiryDate" type="date" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="supplier">Supplier</Label>
                  <Input id="supplier" name="supplier" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="batchNumber">Batch Number</Label>
                  <Input id="batchNumber" name="batchNumber" required />
                </div>
              </div>
              <Button type="submit" className="w-full">Add Medicine</Button>
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
                <p className="text-sm font-medium text-gray-600">Total Medicines</p>
                <p className="text-2xl font-bold">{medicines.length}</p>
              </div>
              <Package className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Low Stock Alerts</p>
                <p className="text-2xl font-bold text-red-600">{lowStockMedicines.length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
                <p className="text-2xl font-bold text-yellow-600">{expiringMedicines.length}</p>
              </div>
              <TrendingDown className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-green-600">${totalValue.toFixed(2)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {(lowStockMedicines.length > 0 || expiringMedicines.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {lowStockMedicines.length > 0 && (
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-red-800 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Low Stock Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {lowStockMedicines.slice(0, 3).map(medicine => (
                    <div key={medicine.id} className="flex justify-between items-center p-2 bg-red-50 rounded">
                      <span className="font-medium">{medicine.name}</span>
                      <Badge className="bg-red-100 text-red-800">{medicine.stock} left</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          {expiringMedicines.length > 0 && (
            <Card className="border-yellow-200">
              <CardHeader>
                <CardTitle className="text-yellow-800 flex items-center">
                  <TrendingDown className="w-5 h-5 mr-2" />
                  Expiring Soon
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {expiringMedicines.slice(0, 3).map(medicine => (
                    <div key={medicine.id} className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                      <span className="font-medium">{medicine.name}</span>
                      <Badge className="bg-yellow-100 text-yellow-800">{medicine.expiryDate}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search medicines..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Pain Relief">Pain Relief</SelectItem>
                <SelectItem value="Antibiotic">Antibiotic</SelectItem>
                <SelectItem value="Diabetes">Diabetes</SelectItem>
                <SelectItem value="Cardiovascular">Cardiovascular</SelectItem>
                <SelectItem value="Gastric">Gastric</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Medicines Table */}
      <Card>
        <CardHeader>
          <CardTitle>Medicine Inventory</CardTitle>
          <CardDescription>Manage your pharmacy stock levels</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Medicine</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMedicines.map((medicine) => (
                <TableRow key={medicine.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{medicine.name}</div>
                      <div className="text-sm text-gray-500">{medicine.supplier}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{medicine.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{medicine.stock}</span>
                      <span className="text-sm text-gray-500">/ {medicine.minStock} min</span>
                    </div>
                  </TableCell>
                  <TableCell>${medicine.price.toFixed(2)}</TableCell>
                  <TableCell>{medicine.expiryDate}</TableCell>
                  <TableCell>{getStockBadge(medicine)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStock(medicine.id, medicine.stock + 10)}
                      >
                        +10
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStock(medicine.id, medicine.stock - 1)}
                        disabled={medicine.stock === 0}
                      >
                        -1
                      </Button>
                    </div>
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