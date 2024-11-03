import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { LoaderCircle } from 'lucide-react';
import { useUserState } from '@/recoil/user';
import { useActivate } from '@/hooks/useActivate';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const Activation = () => {
    const [user,updateUser] = useUserState();
    const { toast } = useToast();
    const navigate = useNavigate();
    const [activationCode, setActivationCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!user) {
          navigate("/login");
          return
        }
      }, [user])

    const onSubmit = () => {
        setIsLoading(true);
        const activate = async() => {
            try{
                const res = await useActivate(user.id, user.token, activationCode);
                if(res.success){
                    const newuser = {...user, membershipStatus: true}
                    updateUser(newuser, user.token)
                    toast({
                        title: "Activated!",
                        description:`${res.message}`,
                    })
                    navigate("/dashboard");
                }
                else{
                    toast({
                        title: "Failed!",
                        description:`${res.message}`,
                        variant: "destructive",
                    })
                }
                setIsLoading(false)
            }catch{
                setIsLoading(false)
                toast({
                    title: "Failed!",
                    description:"An unexpected error occurred.",
                    variant: "destructive",
                })
            }
        }
        activate()
    };

    return (
        <div className="flex items-center justify-center min-h-screen px-4 py-12 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Activation</CardTitle>
                    <CardDescription className="text-center">
                        Please, enter your Activation Code
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div>
                        <div className="grid gap-2">
                            <div className="grid gap-1">
                                <Input
                                    id="email"
                                    disabled={isLoading}
                                    name="email"
                                    placeholder="Activation code"
                                    type="text"
                                    value={activationCode}
                                    onChange={(e) => setActivationCode(e.target.value)}
                                />
                            </div>
                            <Button type="submit" disabled={isLoading} onClick={onSubmit} className='hover:bg-blue-500'>
                                {isLoading ? <LoaderCircle className="animate-spin" /> : "Activate"}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Activation;