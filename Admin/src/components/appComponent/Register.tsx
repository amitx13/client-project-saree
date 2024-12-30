import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { EyeClosed, LoaderCircle } from 'lucide-react';
import { Eye } from 'lucide-react';
import { useCreateAccount } from "@/hooks/useCreateAccount";
import { useToast } from '@/hooks/use-toast'
import { useUserState } from '@/recoil/user'
import { useNavigate } from 'react-router-dom'

export interface RegisterFormData {
    name: string;
    email: string;
    password: string;
}


export default function Register() {
    const [user] = useUserState()
    const navigate = useNavigate()
    const {toast} = useToast()
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<RegisterFormData>({
        name: '',
        email: '',
        password: ''
    })

    useEffect(()=>{
        if(!user){
            navigate("/login")
            return
        }
    },[])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
    };
    

    const onSubmit = async() => {
        if(!formData.email || !formData.password || !formData.name ){
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

        setIsLoading(true);
        const responce = await useCreateAccount(user.token,formData)
        if(responce.success){
            toast({
                title: "New Admin Registered Sucessfully!",
            })
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
                    <CardTitle className="text-2xl font-bold text-center">Register New Admin</CardTitle>
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
                            <Button type="submit" disabled={isLoading} onClick={onSubmit} className='hover:bg-blue-500'>
                                {isLoading ? <LoaderCircle className="animate-spin" /> : "Register"}
                            </Button>
                            </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}