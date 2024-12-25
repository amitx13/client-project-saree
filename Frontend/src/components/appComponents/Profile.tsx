
import { useState,useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoaderCircle, PencilIcon, SaveIcon, ChevronLeft, Wallet,CreditCard } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { useUserState } from '@/recoil/user'
import { useNavigate } from 'react-router-dom'
import { useProfileData } from '@/hooks/useProfile'
import { useUpdateUserData } from '@/hooks/useUpdateUserData'
import { OtpDialog } from './Register'
import { useSendOtp, useVerifyOtp } from '@/hooks/useForgetPassword'

interface Address {
  id: string;
  createdAt: Date;
  userId: string;
  houseNo: string;
  city: string;
  state: string;
  pinCode: string;
}

interface BankDetails {
  id: string;
  createdAt: Date;
  userId: string;
  accountNo: string;
  ifscCode: string;
  BankName: string;
}

export interface ProfileFormProps {
  id: string
  Username: string
  email: string
  fullName: string
  mobile: string
  membershipStatus: boolean
  walletBalance: number
  address: Address[]
  BankDetails: BankDetails[]
}

export default function Profile() {
  const [user,] = useUserState()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [userDetails, setUserDetails] = useState<ProfileFormProps | null>(null)

  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [showOTPDialog, setShowOTPDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState<number>(0);

  const fetchUserData = async () => {
    const userData = await useProfileData(user.id, user.token)
    if (userData && userData.success === false) {
      toast({
        title: "Error",
        description: "Unable to load your data please try again",
        variant: "destructive",
      })
      return
    } else {
      if (!userData && !userData.userData) {
        return
      }
      setUserDetails(userData.userData)
    }
  }

  useEffect(() => {
    if (!user) {
      navigate("/login")
      return
    }
    fetchUserData()
  }, [])

  useEffect(() => {
    if (timer > 0) {
      const timer = setInterval(() => {
        setTimer((prev: number) => prev - 1); // Decrease the timer by 1 second
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timer])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserDetails((prevData) => {
      if (!prevData) return prevData;

      if (name.includes("address.")) {
        const [, field] = name.split(".");
        return {
          ...prevData,
          address: prevData.address.map((addr, index) => 
            index === 0 ? { ...addr, [field]: value } : addr
          )
        };
      }
      
      if (name.includes("bankDetails.")) {
        const [, field] = name.split(".");
        return {
          ...prevData,
          BankDetails: prevData.BankDetails.map((bank, index) => 
            index === 0 ? { ...bank, [field]: value } : bank
          )
        };
      }

      return {
        ...prevData,
        [name]: value
      };
    });
  };

  const handleSubmit = async () => {
    if(!userDetails) return
    setIsEditing(false)
    setIsSubmitting(true)

    if(user.email !== userDetails.email){
        const res = await useSendOtp(userDetails.email);
          if (res?.success) {
            setTimer(res.timeLeft)
            setShowOTPDialog(true)
          } else {
            toast({
              title: "Failed to Update Account Details!",
              description: "Email cannot be changed right now, please try again after sometime",
              variant: "destructive",
            });
          }
          setIsSubmitting(false)
        return
    }

    const changes = await useUpdateUserData(user.id, userDetails, user.token)
    if(changes.success) {
      fetchUserData()
      toast({
        title: "Account Updated Sucessfully!",
        description: "Your account has been updated successfully.",
      });
    } else {
      toast({
        title: "Failed to Update Account Details!",
        description: changes.message,
        variant: "destructive",
      });
    }
    setIsSubmitting(false)
  }


  if (!userDetails) {
    return (
      <div className='h-screen w-full flex justify-center items-center'>
        <LoaderCircle className="animate-spin " size={80} />
      </div>
    )
  }


  const StatCard = ({ icon: Icon, label, value, className }: any) => (
    <Card className={cn("relative overflow-hidden", className)}>
      <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 transform opacity-20">
        <Icon className="h-full w-full" />
      </div>
      <CardContent className="p-6">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-muted-foreground" />
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
        </div>
        <p className="mt-2 text-xl font-normal">{value}</p>
      </CardContent>
    </Card>
  )

  const handleVerifyOTP = async (otp:string) => {
    if(!userDetails) {
      toast({
        title: "Error",
        description: "User details not found",
        variant: "destructive",
      })
      return
    }
    if(otp.length !== 4) {
      toast({
        title: "Invalid OTP",
        description: "OTP should be 4 digits",
        variant: "destructive",
      })
      return
    }
    try {
          setShowOTPDialog(false);
          setIsLoading(true)
          const res = await useVerifyOtp(userDetails.email, otp);
          if (res?.success) {
            const responce = await  useUpdateUserData(user.id, userDetails, user.token)
            if (responce.success) {
              toast({
                title: "Account Updated Sucessfully!",
                description: "Your account has been updated successfully.",
              });
            } else {
              toast({
                title: "Failed to Update User Details",
                description: responce.message,
                variant: "destructive",
              });
            }
          } else {
            toast({
              title: "Verification Failed",
              description: "Invalid OTP.Please try again",
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
        finally {
          fetchUserData()
          setIsLoading(false);
        }
  }


  if(isSubmitting || isLoading){
    return(
      <div className="flex items-center justify-center h-screen">
        <LoaderCircle className="animate-spin" size={80}/>
      </div>
    )
  } 

  return (
    <div className="min-h-screen flex pt-4 justify-center bg-gradient-to-b from-background to-background/80">
      <form onSubmit={handleSubmit} className='w-full lg:w-1/2 md:w-3/4 ml-4 mr-4'>
        <div className="sticky top-0 z-50 backdrop-blur-lg border-b bg-background/80">
        <div className='flex'>
          <Tabs
            defaultValue="basic"
            className="w-full"
          >
            <TabsList className="w-full justify-start rounded-none h-12 p-0 bg-transparent gap-6 mb-6">
              {["basic", "address", "bank"].map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="relative h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-0"
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </TabsTrigger>
              ))}
            </TabsList>
{/* Basic */}
            <TabsContent value="basic" className="space-y-6 mt-0">
              <div className="grid grid-cols-2 gap-4">
                <StatCard
                  icon={CreditCard}
                  label="Membership"
                  value={userDetails.membershipStatus ? "Active" : "Inactive"}
                  className={userDetails.membershipStatus ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-500"}
                />
                <StatCard
                  icon={Wallet}
                  label="Balance"
                  value={`₹${userDetails.walletBalance}`}
                  className="bg-orange-500/10"
                />
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-base">User Id</Label>
                  <Input
                    name="id"
                    value={userDetails.id}
                    onChange={handleChange}
                    disabled={true}
                    className="h-12 text-lg bg-card"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-base">Username</Label>
                  <Input
                    name="username"
                    value={userDetails.Username}
                    onChange={handleChange}
                    disabled={true}
                    className={"h-12 text-lg bg-card"}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-base">Full Name</Label>
                  <Input
                    name="fullName"
                    value={userDetails.fullName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="h-12 text-lg bg-card"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-base">Email</Label>
                  <Input
                    name="email"
                    type="email"
                    value={userDetails.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="h-12 text-lg bg-card"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-base">Mobile Number</Label>
                  <Input
                    name="mobile"
                    value={userDetails.mobile}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="h-12 text-lg bg-card"
                  />
                </div>
              </div>
            </TabsContent>

{/* address */}
            <TabsContent value="address" className="mt-0">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <Label className="text-base">House No / Street</Label>
                    <Input
                      name="address.houseNo"
                      value={userDetails.address[0].houseNo}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="h-12 text-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-base">City</Label>
                    <Input
                      name="address.city"
                      value={userDetails.address[0].city}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="h-12 text-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-base">State</Label>
                    <Input
                      name="address.state"
                      value={userDetails.address[0].state}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="h-12 text-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-base">Pin Code</Label>
                    <Input
                      name="address.pinCode"
                      value={userDetails.address[0].pinCode}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="h-12 text-lg"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

{/* Bank */}
            <TabsContent value="bank" className="mt-0">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <Label className="text-base">Account Number</Label>
                    <Input
                      name="bankDetails.accountNo"
                      value={userDetails.BankDetails[0].accountNo}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="h-12 text-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-base">IFSC Code</Label>
                    <Input
                      name="bankDetails.ifscCode"
                      value={userDetails.BankDetails[0].ifscCode}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="h-12 text-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-base">Bank Name</Label>
                    <Input
                      name="bankDetails.BankName"
                      value={userDetails.BankDetails[0].BankName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="h-12 text-lg"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          <div className="absolute right-0 top-0 h-12 w-12 flex items-center justify-center">
            {isEditing && (
              <Button
                variant="ghost"
                size="icon"
                className="mr-2"
                onClick={() => setIsEditing(false)}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            )}
            {!isEditing && (
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full"
                onClick={() => setIsEditing(true)}
              >
                <PencilIcon className="h-5 w-5" />
              </Button>
            )}
          </div>
          </div>
        </div>

        {/* Save Button */}
        {isEditing && (
          <div className="w-full  p-4 bg-gradient-to-t from-background to-background/80 border-t backdrop-blur-lg">
            <Button
              type="submit"
              className="w-1/2 h-12 text-base font-medium"
              disabled={isSubmitting}
              onClick={handleSubmit}
            >
                  <SaveIcon className="mr-2 h-5 w-5" />
                  Save Changes
            </Button>
          </div>
        )}
      </form>
      <OtpDialog
      showOTPDialog={showOTPDialog}
      setShowOTPDialog={setShowOTPDialog}
      isLoading={isLoading}
      handleVerifyOTP={handleVerifyOTP}
      onSubmit={handleSubmit}
      email={userDetails.email}
      timer={timer}
      />
    </div>
  )
}