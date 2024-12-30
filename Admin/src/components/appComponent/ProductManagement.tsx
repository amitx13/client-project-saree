import React, { useState, useRef, useEffect } from "react"
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
import { Trash2, Plus, Upload, ChevronLeft, ChevronRight, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAddNewProduct, useFetchAllProducts } from "@/hooks/useFetchAllProducts"
import { useUserState } from "@/recoil/user"
import API_BASE_URL from "@/config"
import { useDeleteProduct, useUpdateProductStock } from "@/hooks/useUpdateProductStock"
import { useNavigate } from "react-router-dom"

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  stock: boolean;
}

interface AddProduct {
  name: string;
  price: number;
  image: File | null;
}

export default function ProductManagementPage() {
  const [user,] = useUserState()
  const { toast } = useToast()
  const navigate = useNavigate()
  let fileInputRef = useRef<HTMLInputElement>(null)

  const [isLoading,setIsLoading] = useState(false)

  const [products, setProducts] = useState<Product[]>()
  const [image,setImage] = useState<string>("")
  const [newProduct, setNewProduct] = useState<AddProduct>({
    name: "",
    price: 0,
    image: null,
  })

  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 5


  const fetchAllProducts = async () => {
    const res = await useFetchAllProducts(user.token)
    if(res && res.success){
      setProducts(res.data)
    }
  }

  useEffect(()=>{
    if(!user){
      navigate("/login")
      return
    }
    setIsLoading(true)
    fetchAllProducts()
    setIsLoading(false)
  },[])

  const handleAddProduct = async () => {
    if(!newProduct.name || !newProduct.price || !newProduct.image){
      toast({
        title: "Failed to Add Product!",
        description: "Please fill all the fields",
        variant: "destructive",
      })
      return;
    }

    setIsLoading(true)
    const formData = new FormData()
    formData.append("name", newProduct.name)
    formData.append("price", newProduct.price.toString())
    formData.append("image", newProduct.image)

    const responce = await useAddNewProduct(user.token,formData)
    if(responce.success){
      setNewProduct({
        name: "",
        price: 0,
        image: null,
      })
      setImage("")
      fetchAllProducts()
      toast({
        title: "New Product Added Sucessfully!",
      })
    }else{
      toast({
        title: "Failed to Add Product!",
        description: responce.message,
        variant: "destructive",
      })
    }
    setIsLoading(false)
  }
  const handleDeleteProduct = async(id: string) => {
    const data = await useDeleteProduct(user.token, id)
    if(data.success){
      fetchAllProducts()
      toast({
        title: "Product Deleted",
        description: `${data.message}`,
      })
    }
    else{
      toast({
        title: "Error",
        description: `${data.message}`,
        variant: "destructive",
      })
    }
  }

  const handleStockToggle = async(id: string,stock:boolean) => {
    const data = await useUpdateProductStock(user.token, id, stock)
    if(data.success){
      fetchAllProducts()
      toast({
        title: "Stock Updated",
        description: "Stock status updated successfully",
      })
    }else{
      toast({
        title: "Error",
        description: `${data.message}`,
        variant: "destructive",
      })
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {

    if (e.target.files && e.target.files[0]) {
      setNewProduct({ ...newProduct, image: e.target.files[0] });
    }
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = products ? products.slice(indexOfFirstProduct, indexOfLastProduct) : []

  const totalPages = products ? Math.ceil(products.length / productsPerPage) : 1

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-blue-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="bg-gradient-to-r from-pink-500 to-purple-500 text-white p-6 rounded-t-lg">
          <h1 className="text-2xl sm:text-3xl font-bold">Product Management</h1>
          <p className="text-pink-100 mt-2">Add, remove, and manage product inventory</p>
        </header>
        {!isLoading ? <main className="bg-white/80 backdrop-blur-sm shadow-xl p-4 sm:p-6 rounded-b-lg">
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
                    {image && (
                      <div className="mt-2 flex">
                        <img 
                          src={image} 
                          alt="Preview" 
                          className="rounded-md w-24 h-24 object-cover"
                        />
                        <X className="cursor-pointer" onClick={()=>{
                          setNewProduct({ ...newProduct, image: null });
                          setImage("");
                          if (fileInputRef.current) {
                            fileInputRef.current.value = ""; 
                          }
                        }}/>
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
                        src={`${API_BASE_URL}/${product.image}`}
                        alt={product.name}
                        className="rounded-md w-12 h-12 object-cover"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>₹{product.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={product.stock}
                          onCheckedChange={() => handleStockToggle(product.id, !product.stock)}
                        />
                        <span className={`${product.stock ? "text-green-500":"text-red-500"}`}>{product.stock ? "In Stock" : "Out of Stock"}</span>
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
        </main>: <div className="bg-white/80 backdrop-blur-sm shadow-xl p-4 sm:p-6 rounded-b-lg text-center">Loading...</div>}
      </div>
    </div>
  )
}