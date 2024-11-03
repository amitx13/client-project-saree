import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useNavigate } from 'react-router-dom'
import { EyeClosed, LoaderCircle } from 'lucide-react';
import { Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast'
import { useLogin } from '@/hooks/useLogin'
import { useUserState } from '@/recoil/user'

export interface LoginFormData {
    email: string;
    password: string;
}


export default function Login() {
    const navigate = useNavigate()
    const {toast} = useToast()
    const [, updateUser] = useUserState();

    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<LoginFormData>({
        email: '',
        password: '',
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };


    const onSubmit = async() => {
        if(!formData.email || !formData.password){
            toast({
                title: "Failed to Loged In",
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
        const responce = await useLogin(formData)
        if(responce.status){
            updateUser(responce.data.user, responce.data.token)
            toast({
                title: "Login Successful",
                description: `${responce.data.user.name} Loged In.`,
            })
            navigate('/')
        }else{
            toast({
                title: "Failed to Loged In",
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
                    <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
                    <CardDescription className="text-center">
                        to continue to mlm
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div >
                        <div className="grid gap-2">
                            <div className="grid gap-1">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" name="email" placeholder="m@example.com" type="email" value={formData.email} onChange={handleChange} />
                            </div>
                            <div className="grid gap-1 ">
                                <Label htmlFor="password">Password</Label>
                                <div className='relative flex items-center '>
                                    <Input id="password" name="password" placeholder="********" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange} />
                                    <div
                                        className="absolute right-3 cursor-pointer"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <Eye /> : <EyeClosed />}
                                    </div>
                                </div>
                            </div>
                            <Button type="submit" disabled={isLoading} onClick={onSubmit} className='hover:bg-blue-500'>
                                {isLoading ? <LoaderCircle className="animate-spin" /> : "Sign In"}
                            </Button>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-sm text-muted-foreground">
                        Don't have an account?{' '}
                        <div className="underline underline-offset-4 hover:text-primary" onClick={() => navigate('/register')}>
                            Sign up
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
