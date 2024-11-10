import React, { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Trash2, Plus, Upload, ChevronLeft, ChevronRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  inStock: boolean;
}

export default function ProductManagementPage() {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: "Banarasi Silk Saree", price: 1299.99, image: "/placeholder.svg?height=100&width=100", inStock: true },
    { id: 2, name: "Kanjivaram Silk Saree", price: 1599.99, image: "/placeholder.svg?height=100&width=100", inStock: true },
    { id: 3, name: "Chanderi Silk Saree", price: 999.99, image: "/placeholder.svg?height=100&width=100", inStock: false },
    { id: 4, name: "Mysore Silk Saree", price: 1099.99, image: "/placeholder.svg?height=100&width=100", inStock: true },
    { id: 5, name: "Patola Silk Saree", price: 1899.99, image: "/placeholder.svg?height=100&width=100", inStock: true },
    { id: 6, name: "Bandhani Silk Saree", price: 1199.99, image: "/placeholder.svg?height=100&width=100", inStock: true },
    { id: 7, name: "Tussar Silk Saree", price: 1399.99, image: "/placeholder.svg?height=100&width=100", inStock: false },
  ])

  const [newProduct, setNewProduct] = useState<Omit<Product, 'id' | 'inStock'>>({
    name: "",
    price: 0,
    image: "",
  })

  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 5

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.price > 0 && newProduct.image) {
      setProducts([...products, { ...newProduct, id: Date.now(), inStock: true }])
      setNewProduct({ name: "", price: 0, image: "" })
      toast({
        title: "Product Added",
        description: `${newProduct.name} has been added to the product list.`,
      })
    } else {
      toast({
        title: "Error",
        description: "Please fill in all fields correctly.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter(product => product.id !== id))
    toast({
      title: "Product Deleted",
      description: "The product has been removed from the list.",
    })
  }

  const handleStockToggle = (id: number) => {
    setProducts(products.map(product =>
      product.id === id ? { ...product, inStock: !product.inStock } : product
    ))
    const product = products.find(p => p.id === id)
    toast({
      title: `Product ${product?.inStock ? "Out of Stock" : "In Stock"}`,
      description: `${product?.name} is now ${product?.inStock ? "out of stock" : "in stock"}.`,
    })
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setNewProduct({ ...newProduct, image: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct)

  const totalPages = Math.ceil(products.length / productsPerPage)

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-blue-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="bg-gradient-to-r from-pink-500 to-purple-500 text-white p-6 rounded-t-lg">
          <h1 className="text-2xl sm:text-3xl font-bold">Product Management</h1>
          <p className="text-pink-100 mt-2">Add, remove, and manage product inventory</p>
        </header>
        <main className="bg-white/80 backdrop-blur-sm shadow-xl p-4 sm:p-6 rounded-b-lg">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="mb-6 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" /> Add New Product
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogDescription>
                  Enter the details of the new product here. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="price" className="text-right">
                    Price
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="image" className="text-right">
                    Image
                  </Label>
                  <div className="col-span-3">
                    <Button 
                      onClick={() => fileInputRef.current?.click()} 
                      variant="outline"
                      className="w-full"
                    >
                      <Upload className="mr-2 h-4 w-4" /> Upload Image
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    {newProduct.image && (
                      <div className="mt-2">
                        <img 
                          src={newProduct.image} 
                          alt="Preview" 
                          className="rounded-md w-24 h-24 object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddProduct} className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white">Save Product</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="rounded-md w-12 h-12 object-cover"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>₹{product.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={product.inStock}
                          onCheckedChange={() => handleStockToggle(product.id)}
                        />
                        <span>{product.inStock ? "In Stock" : "Out of Stock"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete product</span>
                      </Button>
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