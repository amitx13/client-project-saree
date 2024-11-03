import { Button } from "@/components/ui/button"
import { AlertCircle, CreditCard} from 'lucide-react'
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

interface ActivationPaymentModalProps {
    isOpen: boolean
    setIsOpen: (open: boolean) => void
}

export default function ActivationPaymentModal({isOpen, setIsOpen}:ActivationPaymentModalProps) {

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
            Please transfer ₹750 to the admin account to receive your activation code.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <h3 className="font-semibold">Admin Bank Details</h3>
            <p>Bank Name: Example Bank</p>
            <p>Account Number: 1234 5678 9012 3456</p>
            <p>IFSC Code: EXBK0001234</p>
            <p>Account Holder: Admin Name</p>
          </div>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Payment Instructions</AlertTitle>
            <AlertDescription>
              After making the payment, Click "Proceed to Activation".
            </AlertDescription>
          </Alert>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            <CreditCard className="mr-2 h-4 w-4" /> Proceed to Activation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}