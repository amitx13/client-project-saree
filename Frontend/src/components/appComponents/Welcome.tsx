import { useUserState } from "@/recoil/user"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Check, LoaderCircle, X } from 'lucide-react';
import { useUserWelcomeData } from "@/hooks/useUserData";
import { useParams } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";


interface User {
    id: string;
    Username: string;
    fullName: string;
    createdAt: string;
    email: string;
    mobile: string;
    password: string;
}

interface SponcerData {
    sponsorId: string;
    name: string;
    phone: string;
    email: string;
}

const WelcomePage = () => {
    // Sample user data - replace with actual data
    const { userId } = useParams<{ userId: string }>();
    const [user] = useUserState()
    const navigate = useNavigate()
    const { toast } = useToast()
    const [userData, setUserData] = useState<User | null>(null)

    const [sponcerData, setSponcerData] = useState<SponcerData | null>(null)

    const [loading, setLoading] = useState(false)

    const fetchUserData = async (id: string) => {
        const data = await useUserWelcomeData(id, user.token)
        if (data.success) {
            setUserData(data.userData)
            if (data.sponsoredData) {
                setSponcerData(data.sponsoredData)
            }
        }
        else {
            toast({
                title: "Error",
                description: data.message,
                duration: 9000,
                variant: "destructive",
            })
        }
    }

    useEffect(() => {
        if (!user) {
            navigate("/login")
            return
        }
        if (userId) {
            setLoading(true)
            fetchUserData(userId)
            setLoading(false)
        }
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <LoaderCircle className="animate-spin" size={80} />
            </div>
        )
    }

    if (!userData) {
        return (
            <div className="flex items-center justify-center h-screen">
                <h1 className="text-2xl text-red-500">No Data Found</h1>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="flex justify-center mb-8 relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 flex items-center justify-center text-white text-2xl font-bold">
                    <div className="mx-auto relative">
                        <img
                            src="/logoJDLifestyle.jpeg"
                            alt="JD"
                            className="object-contain"
                        />
                    </div>
                </div>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-gray-200 transition-colors"
                >
                    <X className="h-6 w-6 text-gray-600" />
                </button>

            </div>


            {/* Success Message */}
            <div className="max-w-md mx-auto mb-8">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                    <div className="rounded-full bg-green-100 p-1">
                        <Check className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                        <h3 className="font-medium text-green-800">Registration Successful!</h3>
                        <p className="text-green-700 text-sm">Welcome to JD Lifestyle family</p>
                    </div>
                </div>
            </div>

            {/* Motivational Quote */}

            <div className="max-w-md mx-auto mb-8">
                <Card className="text-center">
                    <CardContent className="pt-6">
                        <p className="italic text-gray-600">
                            "Success in MLM is not about finding the right people; it's about becoming the right person."
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* User Details Card */}
            <div className="max-w-md mx-auto">
                <Card>
                    <CardHeader>
                        <h2 className="text-xl font-semibold bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
                            Registration Details
                        </h2>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-x-1 gap-y-2">
                                <div>
                                    <p className="text-sm text-gray-500">User ID:</p>
                                    <p className="font-medium">{userData.id}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Username:</p>
                                    <p className="font-medium">{userData.Username}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Full Name:</p>
                                    <p className="font-medium">{userData.fullName}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Email:</p>
                                    <p className="font-medium">{userData.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Mobile:</p>
                                    <p className="font-medium">{userData.mobile}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Password:</p>
                                    <p className="font-medium">{userData.password}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Registration Date</p>
                                    <p className="font-medium">{new Date(userData.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Sponsor ID:</p>
                                    <p className="font-medium">{sponcerData?.sponsorId || "N/A"}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Sponsor Name:</p>
                                    <p className="font-medium">{sponcerData?.name || "N/A"}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Sponsor email:</p>
                                    <p className="font-medium">{sponcerData?.email || "N/A"}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Sponsor Phone:</p>
                                    <p className="font-medium">{sponcerData?.phone || "N/A"}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default WelcomePage;