import { useState } from 'react'
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
    name: string;
    email: string;
    mobile: string;
    password: string;
    referralCode: string;
    address: Address;
    bankDetails: BankDetails;
}


export default function Register() {
    const {toast} = useToast()
    const navigate = useNavigate()
    const [, updateUser] = useUserState();
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<RegisterFormData>({
        name: '',
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
    

    const onSubmit = async() => {
        if(!formData.email || !formData.mobile || !formData.password || !formData.name || !formData.address.houseNo || !formData.address.city || !formData.address.state || !formData.address.pinCode || !formData.bankDetails.accountNo || !formData.bankDetails.ifscCode || !formData.bankDetails.bankName){
            toast({
                title: "Failed to Create Account!",
                description: "Please fill all the fields",
                variant: "destructive",
            })
            return;
        }
        if(formData.password.length < 8){
            toast({
                title: "Failed to Loged In",
                description: "Password must be atleast 8 characters long",
                variant: "destructive",
                })
            return;
        }
        if(formData.mobile.toString().length !== 10){
            toast({
                title: "Failed to Loged In",
                description: "Mobile number must be 10 digits long",
                variant: "destructive",
                })
            return;
        }
        setIsLoading(true);
        const responce = await useCreateAccount(formData)
        if(responce.status){
            updateUser(responce.data.user, responce.data.token)
            toast({
                title: "Account Created!",
                description: "Your account has been successfully Created.",
            })
            navigate('/')
        }else{
            toast({
                title: "Failed to Create Account!",
                description: responce.message,
                variant: "destructive",
            })
        }
        setIsLoading(false);
    }

    return (
        <div className="max-h-screen flex items-start justify-center px-4 py-12 sm:px-6 lg:px-8"> {/*  bg-gray-100 */}
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Sign up</CardTitle>
                    <CardDescription className="text-center">
                        to continue to mlm
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div >
                        <div className="grid gap-2">
                            <div className="grid gap-1">
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" name="name" placeholder="John Doe" type="text" value={formData.name} disabled={isLoading} onChange={handleChange} />
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
                                <Input id="password" name="password" placeholder="********" type={showPassword?"text":"password"} value={formData.password} disabled={isLoading} onChange={handleChange} />
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
    )
}