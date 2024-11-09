"use client"

import { useState } from "react"
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Trash2, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  inStock: boolean;
}

export default function ProductManagement() {
    const { toast } = useToast()

  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: "Banarasi Silk Saree", price: 1299.99, image: "/placeholder.svg?height=100&width=100", inStock: true },
    { id: 2, name: "Kanjivaram Silk Saree", price: 1599.99, image: "/placeholder.svg?height=100&width=100", inStock: true },
    { id: 3, name: "Chanderi Silk Saree", price: 999.99, image: "/placeholder.svg?height=100&width=100", inStock: false },
  ])

  const [newProduct, setNewProduct] = useState<Omit<Product, 'id' | 'inStock'>>({
    name: "",
    price: 0,
    image: "",
  })

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.price > 0) {
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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Product Management</CardTitle>
        <CardDescription>Add, remove, and manage product inventory</CardDescription>
      </CardHeader>
      <CardContent>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="mb-4">
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
                  Image URL
                </Label>
                <Input
                  id="image"
                  value={newProduct.image}
                  onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddProduct}>Save Product</Button>
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
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <img
                      src={product.image}
                      alt={product.name}
                      width={50}
                      height={50}
                      className="rounded-md"
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
      </CardContent>
    </Card>
  )
}