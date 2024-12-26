import { Button } from "@/components/ui/button"
import { AlertCircle, CreditCard, QrCode} from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useNavigate } from "react-router-dom"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ActivationPaymentModalProps {
    isOpen: boolean
    setIsOpen: (open: boolean) => void
}

export default function ActivationPaymentModal({isOpen, setIsOpen}: ActivationPaymentModalProps) {
  const navigate = useNavigate()

  const handleSubmit = () => {
    navigate('/activation')
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Account Activation Payment</DialogTitle>
          <DialogDescription>
            Please pay ₹550 to activate your account using any of the methods below.
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
              Scan this QR code with any UPI app to pay ₹550
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
            After making the payment, Click "Proceed to Activation".
          </AlertDescription>
        </Alert>

        <DialogFooter >
          <Button type="submit" onClick={handleSubmit} className="w-full">
            <CreditCard className="mr-2 h-4 w-4" /> Proceed to Activation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

