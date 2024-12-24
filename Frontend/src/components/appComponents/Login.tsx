import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useNavigate } from 'react-router-dom'
import { EyeClosed, LoaderCircle } from 'lucide-react';
import { Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast'
import { useLogin } from '@/hooks/useLogin'
import { useLogout, useUserState } from '@/recoil/user'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { useForgetPassword } from '@/hooks/useForgetPassword'

export interface LoginFormData {
    nameOrId: string;
    password: string;
}


export default function Login() {
    const navigate = useNavigate()
    const {toast} = useToast()
    const [user, updateUser] = useUserState();

    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<LoginFormData>({
        nameOrId: '',
        password: '',
    })

    const [forgotPasswordEmail, setForgotPasswordEmail] = useState('')
    const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false)

    useEffect(() => {
        if (user) {
            toast({
                title: "Already Logged In",
                description: "Redirecting to Dashboard",
            })
            navigate('/dashboard')
            return
        }
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };


    const onSubmit = async() => {
        if(!formData.nameOrId || !formData.password){
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
                description: `${responce.data.user.Username} Loged In.`,
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


    const handleForgotPassword = async() => {
        if(!forgotPasswordEmail){
            toast({
                title: "Failed to Send Reset Link",
                description: "Please enter your email",
                variant: "destructive",
            })
            return
        }
        setIsLoading(true);

        const res = await useForgetPassword(forgotPasswordEmail)

        if(res.success){
            toast({
                title: "Password Reset Email Sent",
                description: `A password reset link has been sent to ${forgotPasswordEmail}`,
            })
            setIsForgotPasswordOpen(false)
            setForgotPasswordEmail('')
        }else{
            toast({
                title: "Failed to Send Reset Link",
                description: res.message,
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
                        to continue to JD Lifestyle
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div >
                        <div className="grid gap-2">
                            <div className="grid gap-1">
                                <Label htmlFor="nameOrId">Username/Id</Label>
                                <Input id="nameOrId" name="nameOrId" placeholder="Enter UserName or UserId" type="text" value={formData.nameOrId} onChange={handleChange} />
                            </div>
                            <div className="grid gap-1 ">
                                <Label htmlFor="password">Password</Label>
                                <div className='relative flex items-center '>
                                    <Input id="password" name="password" placeholder="********" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange} />
                                    <div
                                        className="absolute right-3 cursor-pointer"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <Eye className='text-black'/> : <EyeClosed className='text-black'/>}
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
                        <div className="underline underline-offset-4 hover:text-primary cursor-pointer" onClick={() => navigate('/register')}>
                            Sign up
                        </div>
                    </div>
                    <Dialog open={isForgotPasswordOpen} onOpenChange={setIsForgotPasswordOpen}>
                        <DialogTrigger asChild>
                            <Button variant="link" className="text-sm p-0">Forgot Password?</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Forgot Password</DialogTitle>
                                <DialogDescription>
                                    Enter your email address and we'll send you a link to reset your password.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="forgotPasswordEmail" className="col-span-4">
                                        Email
                                    </Label>
                                    <Input
                                        id="forgotPasswordEmail"
                                        placeholder="example@email.com"
                                        className="col-span-4"
                                        value={forgotPasswordEmail}
                                        onChange={(e) => setForgotPasswordEmail(e.target.value)}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                            <Button type="submit" disabled={isLoading} onClick={handleForgotPassword} className='hover:bg-blue-500'>
                                {isLoading ? <LoaderCircle className="animate-spin" /> : "Send Reset Link"}
                            </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </CardFooter>
            </Card>
        </div>
    )
}
