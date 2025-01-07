import { Button } from "@/components/ui/button"
import { AlertCircle, CreditCard, ImageUp, LoaderCircle, QrCode, X} from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useRef, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useUserState } from "@/recoil/user"
import { useTransactionData, useTransactionDetails } from "@/hooks/useTransactionDetails"
import API_BASE_URL from "@/config"

interface ActivationPaymentModalProps {
    isOpen: boolean
    setIsOpen: (open: boolean) => void
}

interface AddProduct {
  image: File | null;
}

type TransactionData = {
  userId: string;
  image: string;
  createdAt: Date;
}
export default function ActivationPaymentModal({isOpen, setIsOpen}: ActivationPaymentModalProps) {
  const [user] = useUserState()
  const { toast } = useToast()

  const [transactionData, setTransactionData] = useState<TransactionData|null>(null)

  const fetchUserTransactionDetails = async (userId:string) => {
    const res = await useTransactionData(user.token,userId)
    if(res.success){
      if(res.data){
        setTransactionData(res.data)
      }
    }
  }

  useEffect(()=>{
    if(user){
      fetchUserTransactionDetails(user.id)
    }
  },[user])

  let fileInputRef = useRef<HTMLInputElement>(null)
  const [image,setImage] = useState<string>("")
  const [newProduct, setNewProduct] = useState<AddProduct>({
    image: null,
  })
  const [isLoading,setIsLoading] = useState(false)


  const handleSubmit = async() => {
    if(transactionData){
      toast({
        title: "Payment Proof Already Uploaded!",
        description: "You have already uploaded the payment proof",
        variant: "destructive",
      })
      return;
    }
    if(!newProduct.image){
      toast({
        title: "Failed to Add Product!",
        description: "Please fill all the fields",
        variant: "destructive",
      })
      return;
    }
    setIsLoading(true)
    const formData = new FormData()
    formData.append("userId", user.id)
    formData.append("image", newProduct.image)
    const response = await useTransactionDetails(user.token, formData)
    if(response.success){
      setNewProduct({
        image: null,
      })
      setImage("")
      toast({
        title: "Payment Proof Uploaded Successfully!",
      })
      fetchUserTransactionDetails(user.id)
    }else{
      toast({
        title: "Failed to Upload Payment Proof! Please try again",
        description: response.message,
        variant: "destructive",
        duration: 3000,
      })
    }
    setIsLoading(false)
    setIsOpen(false)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {

    if (e.target.files && e.target.files[0]) {
      setNewProduct({ image: e.target.files[0] });
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {transactionData === null 
        ?<DialogContent className="sm:max-w-[425px]">
        
        <DialogHeader>
          <DialogTitle>Account Activation Payment</DialogTitle>
          <DialogDescription>
            Please pay ₹580 to activate your account using any of the methods below.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="bank" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="bank">
              <CreditCard className="mr-2 h-4 w-4" />
              Bank Transfer
            </TabsTrigger>
            <TabsTrigger value="qr">
              <QrCode className="mr-2 h-4 w-4" />
              Pay via QR
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="qr" className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-white rounded-lg">
              <img 
                src="/BankORcode.svg" 
                alt="Bank QR Code" 
                className=""
              />
            </div>
            <p className="text-sm text-center text-muted-foreground">
              Scan this QR code with any UPI app to pay ₹580
            </p>
          </TabsContent>
          
          <TabsContent value="bank">
            <div className="grid gap-2">
              <h3 className="font-semibold">Bank Details</h3>
              <p>Bank Name: HDFC Bank</p>
              <p>Account Number: 50200095360461</p>
              <p>IFSC Code: HDFC0004682</p>
              <p>Account Holder: J D LIFESTYLE</p>
            </div>
          </TabsContent>
        </Tabs>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Payment Instructions</AlertTitle>
          <AlertDescription>
            After making the payment, Please upload the payment proof by clicking Upload.
          </AlertDescription>
        </Alert>
        {image && (
          <div className="mt-2 flex">
            <img
              src={image}
              alt="Preview"
              className="rounded-md object-contain h-20"
            />
            <X className="cursor-pointer" onClick={() => {
              setNewProduct({ ...newProduct, image: null });
              setImage("");
              if (fileInputRef.current) {
                fileInputRef.current.value = "";
              }
            }} />
          </div>
        )}

        <DialogFooter >
          {image === "" ? <div className="w-full">
            <Button type="submit" className="w-full"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImageUp className="mr-2 h-4 w-4" /> Upload
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
          </div> :
            <Button type="submit" onClick={handleSubmit} className="w-full">
              {!isLoading ? 
              <div className="flex items-center w-full justify-center">
                <CreditCard className="mr-2 h-4 w-4" /> 
                Proceed to Activation 
              </div>
                : <div className="flex items-center w-full justify-center">
                  <LoaderCircle className="animate-spin" size={50} />
                </div>}
            </Button>
          }
        </DialogFooter>
      </DialogContent>
      :

        <DialogContent className="sm:max-w-2xl">  
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
          <DialogDescription>
            Payment Transaction History.
          </DialogDescription>
        </DialogHeader>
        <div>
        <img
            src={`${API_BASE_URL}/${transactionData.image}`}
            alt="Transaction Proof"
            className="w-full h-full"
          />
        </div>
        </DialogContent>
          }
    </Dialog>
  )
}

