import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useNavigate } from 'react-router-dom'
import { EyeClosed, LoaderCircle } from 'lucide-react';
import { Eye } from 'lucide-react';
import { useCreateAccount } from "@/hooks/useCreateAccount";
import { useToast } from '@/hooks/use-toast'
import { useUserState } from '@/recoil/user'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useCheckUserName } from '@/hooks/useCheckUserName'

interface Address {
  houseNo: string;
  city: string;
  state: string;
  pinCode: string;
}

interface BankDetails {
  accountNo: string;
  ifscCode: string;
  bankName: string;
}

export interface RegisterFormData {
  fullName: string;
  userName: string;
  email: string;
  mobile: string;
  password: string;
  referralCode: string;
  address: Address;
  bankDetails: BankDetails;
}


export default function Register() {
  const [user,] = useUserState();
  const { toast } = useToast()
  const navigate = useNavigate()
  const [, updateUser] = useUserState();
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(false);
  const [showOTPDialog, setShowOTPDialog] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isUserNameAvailable, setIsUserNameAvailable] = useState(false);
  // const [isOTPSend, setIsOtpSend] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [formData, setFormData] = useState<RegisterFormData>({
    fullName:'',
    userName: '',
    email: '',
    mobile: '',
    password: '',
    referralCode: '',
    address: {
      houseNo: '',
      city: '',
      state: '',
      pinCode: '',
    },
    bankDetails: {
      accountNo: '',
      ifscCode: '',
      bankName: '',
    },
  })

  useEffect(() => {
    if (user) {
      navigate('/')
    }
  }, [])

  useEffect(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    if (formData.userName.length > 3) {
      const newTimeoutId = setTimeout(async () => {
          setIsChecking(true);
          const res = await useCheckUserName(formData.userName);
          setIsUserNameAvailable(res.success);
          setIsChecking(false);
      }, 800);

      setTimeoutId(newTimeoutId);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [formData.userName]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.includes("address.") || name.includes("bankDetails.")) {
      const [section, field] = name.split(".");
      setFormData((prevData) => ({
        ...prevData,
        [section]: {
          ...(prevData[section as keyof RegisterFormData] as Record<string, any>),
          [field]: value,
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const onSubmit = async () => {
    if(!isUserNameAvailable){
      toast({
        title: "Failed to Create Account!",
        description: "Username is not available",
        variant: "destructive",
      })
      return
    }
    if (!formData.fullName || !formData.email || !formData.mobile || !formData.password || !formData.userName || !formData.address.houseNo || !formData.address.city || !formData.address.state || !formData.address.pinCode || !formData.bankDetails.accountNo || !formData.bankDetails.ifscCode || !formData.bankDetails.bankName) {
      toast({
        title: "Failed to Create Account!",
        description: "Please fill all the fields",
        variant: "destructive",
      })
      return;
    }
    if (formData.password.length < 8) {
      toast({
        title: "Failed to Loged In",
        description: "Password must be atleast 8 characters long",
        variant: "destructive",
      })
      return;
    }
    if (formData.mobile.toString().length !== 10) {
      toast({
        title: "Failed to Loged In",
        description: "Mobile number must be 10 digits long",
        variant: "destructive",
      })
      return;
    }
    setShowOTPDialog(true)
    //send otp
  }

  const handleVerifyOTP = async (value: string) => {
    if (value.length !== 4) return;

    try {
      setIsLoading(true)
      // Here you would typically verify the OTP with your backend

      const responce = await useCreateAccount(formData);
      if (responce.status) {
        updateUser(responce.data.user, responce.data.token);
        toast({
          title: "Account Created!",
          description: "Your account has been successfully Created.",
        });
        setShowOTPDialog(false);
        navigate('/');
      } else {
        toast({
          title: "Failed to Create Account!",
          description: responce.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  if (user) {
    return null
  }

  return (
    <>
      <div className="max-h-screen flex items-start justify-center px-4 py-12 sm:px-6 lg:px-8"> {/*  bg-gray-100 */}
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Sign up</CardTitle>
            <CardDescription className="text-center">
              to continue to JD Lifestyle
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div >
              <div className="grid gap-2">
              <div className="grid gap-1">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" name="fullName" placeholder="Jhon Doe" type="text" value={formData.fullName} disabled={isLoading} onChange={handleChange} />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="userName">UserName</Label>
                  <div className="relative">
                    <Input
                      id="userName"
                      name="userName"
                      placeholder="John Doe"
                      type="text"
                      value={formData.userName}
                      disabled={isLoading}
                      onChange={handleChange}
                      className={formData.userName.length > 3 ?
                        (isUserNameAvailable ? "border-green-500" : "border-red-500")
                        : ""
                      }
                    />
                    {isChecking && (
                      // <LoaderCircle className="animate-spin" />
                      <LoaderCircle className="animate-spin absolute right-3 top-2.5 " size={16} />
                    )}
                    {formData.userName.length > 3 && !isChecking && (
                      isUserNameAvailable ?
                        <div className="text-green-500 text-sm mt-1">Username is available</div> :
                        <div className="text-red-500 text-sm mt-1">Username is not available</div>
                    )}
                  </div>
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" placeholder="m@example.com" type="email" value={formData.email} disabled={isLoading} onChange={handleChange} />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="email">Mobile</Label>
                  <Input id="mobile" name="mobile" placeholder="Enter 10 digit mobile number" type="number" value={formData.mobile} disabled={isLoading} onChange={handleChange} />
                </div>
                <div className="grid gap-1 ">
                  <Label htmlFor="password">Password</Label>
                  <div className='relative flex items-center '>
                    <Input id="password" name="password" placeholder="********" type={showPassword ? "text" : "password"} value={formData.password} disabled={isLoading} onChange={handleChange} />
                    <div
                      className="absolute right-3 cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <Eye /> : <EyeClosed />}
                    </div>
                  </div>
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="referrerId">Referrer ID</Label>
                  <Input id="referralCode" name="referralCode" placeholder="Referrer ID" type="text" value={formData.referralCode} disabled={isLoading} onChange={handleChange} />
                </div>
                <div className="grid gap-1">
                  <Label>Address</Label>
                  <Input id="houseNo" name="address.houseNo" placeholder="House No." type="text" value={formData.address.houseNo} disabled={isLoading} onChange={handleChange} />
                  <Input id="city" name="address.city" placeholder="City" type="text" value={formData.address.city} disabled={isLoading} onChange={handleChange} />
                  <Input id="state" name="address.state" placeholder="State" type="text" value={formData.address.state} disabled={isLoading} onChange={handleChange} />
                  <Input id="pinCode" name="address.pinCode" placeholder="Pin Code" type="text" value={formData.address.pinCode} disabled={isLoading} onChange={handleChange} />
                </div>
                <div className="grid gap-1">
                  <Label>Bank Details</Label>
                  <Input id="accountNo" name="bankDetails.accountNo" placeholder="Account No." type="text" value={formData.bankDetails.accountNo} disabled={isLoading} onChange={handleChange} />
                  <Input id="ifscCode" name="bankDetails.ifscCode" placeholder="IFSC Code" type="text" value={formData.bankDetails.ifscCode} disabled={isLoading} onChange={handleChange} />
                  <Input id="bankName" name="bankDetails.bankName" placeholder="Bank Name" type="text" value={formData.bankDetails.bankName} disabled={isLoading} onChange={handleChange} />
                </div>
                <Button type="submit" disabled={isLoading} onClick={onSubmit} className='hover:bg-blue-500'>
                  {isLoading ? <LoaderCircle className="animate-spin" /> : "Sign Up"}
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <div className="underline underline-offset-4 hover:text-primary" onClick={() => navigate('/login')}>
                Sign in
              </div>
            </div>
            <a className="text-sm underline underline-offset-4 hover:text-primary" href="#">
              Privacy Policy
            </a>
          </CardFooter>
        </Card>
      </div>
      <OtpDialog 
      showOTPDialog={showOTPDialog}
      isLoading={isLoading}
      setShowOTPDialog={setShowOTPDialog}
      handleVerifyOTP={handleVerifyOTP}
      onSubmit={onSubmit}
      email={formData.email}
      />
    </>
  )
}

interface OtpDialopProps{
  showOTPDialog:boolean,
  isLoading:boolean,
  setShowOTPDialog:React.Dispatch<React.SetStateAction<boolean>>,
  handleVerifyOTP:(value:string)=>void,
  onSubmit:()=>void,
  email:string
}


export function OtpDialog(
  {
    showOTPDialog,
    isLoading,
    setShowOTPDialog,
    handleVerifyOTP,
    onSubmit,
    email

  }:OtpDialopProps
){
  return(
    <Dialog open={showOTPDialog} onOpenChange={!isLoading ? setShowOTPDialog : () => { }}>
    <DialogContent className="sm:max-w-md">
      <DialogHeader className="text-center space-y-3">
        <DialogTitle className="text-2xl font-bold">Verify Email</DialogTitle>
        <DialogDescription className="text-base">
          Please enter the verification code sent to {email}
        </DialogDescription>
      </DialogHeader>
      <div className="flex flex-col items-center space-y-8 py-4">
        <div className="flex justify-center w-full">
          <InputOTP
            maxLength={4}
            onComplete={handleVerifyOTP}
            disabled={isLoading}
          >
            <InputOTPGroup className="flex gap-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <InputOTPSlot
                  key={index}
                  index={index}
                  className={`
                                                w-14 h-14 text-xl font-semibold rounded-xl border-2
                                                transition-all duration-200
                                                focus:ring-2 focus:ring-offset-1 focus:ring-primary/50 focus:border-primary
                                                data-[filled=true]:border-primary/50 data-[filled=true]:bg-primary/5
                                            `}
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>

        <div className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            Didn't receive the code?
          </p>
          <Button
            variant="ghost"
            className="text-primary hover:text-primary/80 font-medium hover:bg-primary/5"
            onClick={onSubmit}
            disabled={isLoading}
          >
            Resend Code
          </Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
  )
}