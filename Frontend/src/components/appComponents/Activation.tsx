import React,{ useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { CopyIcon, LoaderCircle, Sparkles } from 'lucide-react'
import { useUserState } from '@/recoil/user'
import { useActivate } from '@/hooks/useActivate'
import { useToast } from '@/hooks/use-toast'
import { useNavigate } from 'react-router-dom'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { getAllReceivedCode } from '@/hooks/useReceivedCode'
import { useTransferCode } from '@/hooks/useTransferCode'
import { useUserName } from '@/hooks/useCheckUserName'

interface ReceivedCode {
    id: string;
    createdAt: Date;
    ownerUserID: string;
    code: string;
    isUsed: boolean;
}

interface ActivationCode {
    userId: string;
    code: string;
}

interface TransferCode {
    userId: string;
    quantity: number;
}

const Activation = () => {
    const [user, updateUser] = useUserState();
    const { toast } = useToast();
    const navigate = useNavigate();

    const [receivedCodes, setReceivedCodes] = useState<ReceivedCode[] | []>([]);

    const [activationCode, setActivationCode] = useState<ActivationCode>({
        userId: '',
        code: '',
    });

    const [sponcerName,setSponcerName] = useState<string|null>("");
    const [transferUserName, setTransferUserName] = useState<string|null>("");
    
    const [transfer, setTransfer] = useState<TransferCode>({
        userId: '',
        quantity: 0,
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isTransferLoading, setIsTransferLoading] = useState(false);
    
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;


    // Calculate pagination
    const totalPages = Math.ceil(receivedCodes.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentCodes = receivedCodes.slice(startIndex, endIndex);
    currentCodes.sort((a,b)=> a.isUsed === b.isUsed ? 0 : a.isUsed === true ? -1 : 1);

    const fetchReceivedCode = async () => {
        const res = await getAllReceivedCode(user.id, user.token);
        if(res.success){
            setReceivedCodes(res.data)
        }
    }

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return
        }
        fetchReceivedCode()
    }, [user])

    const fetchSponcerName = async (userId:string,setState:(arg:string|null)=>void) => {
        const res = await useUserName(userId);
        if(res.success){
            setState(res.fullname)
        }
        else{
            setState(null)
        }
    }
    useEffect(()=>{
        if(activationCode.userId.length === 7){
            fetchSponcerName(activationCode.userId,setSponcerName)
            return
        } else if(activationCode.userId.length > 1) {
            setSponcerName(null)
        } else {
            setSponcerName("")
        }
    },[activationCode.userId])

    useEffect(()=>{
        if(transfer.userId.length === 7){
            fetchSponcerName(transfer.userId,setTransferUserName)
            return
        } else if(transfer.userId.length > 1) {
            setTransferUserName(null)
        } else {
            setTransferUserName("")
        }
    },[transfer.userId])

    const copyReferralCode = async (code:string) => {
        try {
          const textToCopy = code;
          
          if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(textToCopy);
          } else {
           toast({
                title: "Failed to copy",
                description: "Please manually copy the referral code",
                variant: "destructive",
           })
          }
          toast({
            title: "Copied!",
            description: "Referral code copied to clipboard",
          });
        } catch (err: any) {
          toast({
            title: "Failed to copy",
            description: "Please manually copy the referral code",
            variant: "destructive",
          });
        }
      }

    const onSubmit = () => {
        if(!activationCode.userId || !activationCode.code){
            toast({
                title: "Failed!",
                description:"All fields are required",
                variant: "destructive",
            })
            return
        }
        if(!sponcerName){
            toast({
                title: "Failed!",
                description:"Invalid UserId",
                variant: "destructive",
            })
            return
        }
        setIsLoading(true);
        const activate = async() => {
            try{
                const res = await useActivate(activationCode.userId || user.id, user.token, activationCode.code );
                if(res.success){
                    const newuser = {...user, membershipStatus: true}
                    updateUser(newuser, user.token)
                    toast({
                        title: "Activated!",
                        description:`${res.message}`,
                    })
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

    const handleTransfer = async () => {
        setIsTransferLoading(true);
            const res = await useTransferCode(user.token, user.id, transfer.userId, transfer.quantity);
            if(res.success){
                toast({
                    title: "Transferred!",
                    description:`${res.message}`,
                })
                fetchReceivedCode()
            }
            else{
                toast({
                    title: "Failed!",
                    description:`${res.message}`,
                    variant: "destructive",
                })
            }
            setIsTransferLoading(false)
    };

    return (
        <div className="container mx-auto md:w-1/2 px-4 py-12 min-h-screen bg-gradient-to-b from-background to-background/50 dark:from-background dark:to-background/50">
        <Tabs defaultValue="activate" className="w-full">
            <TabsList className="grid w-full grid-cols-3 p-1 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-pink-500/10 rounded-lg backdrop-blur-sm">
                <TabsTrigger 
                    value="activate"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white transition-all duration-300"
                >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Activate
                </TabsTrigger>
                <TabsTrigger 
                    value="received"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white transition-all duration-300"
                >
                    Received Codes
                </TabsTrigger>
                <TabsTrigger 
                    value="transfer"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-pink-500 data-[state=active]:text-white transition-all duration-300"
                >
                    Transfer Code
                </TabsTrigger>
            </TabsList>

            <TabsContent value="activate">
                <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-white/50 dark:from-gray-900 dark:to-gray-900/50 backdrop-blur-sm">
                    <CardHeader className="space-y-1">
                        <div className="text-center space-y-2">
                            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                                Activation
                            </CardTitle>
                            <CardDescription className="text-lg">
                                Enter User ID and Activation Code
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="grid gap-3">
                            <div>
                            <Input
                                placeholder="User ID"
                                type="text"
                                value={activationCode.userId}
                                onChange={(e) => setActivationCode((prev) => {
                                    return {...prev, userId: e.target.value}
                                })}
                                disabled={isLoading}
                                className="border-2 h-12 transition-all duration-300 focus:border-purple-500 dark:focus:border-purple-400"
                            />
                            {sponcerName ? <div className="text-green-500 text-sm">{sponcerName}</div>:sponcerName !== "" && <div className="text-red-500 text-sm">Invalid UserId</div>}
                      </div>
                            <Input
                                placeholder="Activation code"
                                type="text"
                                value={activationCode.code}
                                onChange={(e) => setActivationCode((prev)=>{
                                    return {...prev, code: e.target.value}
                                })}
                                disabled={isLoading}
                                className="border-2 h-12 transition-all duration-300 focus:border-blue-500 dark:focus:border-blue-400"
                            />
                            <Button 
                                onClick={onSubmit} 
                                disabled={isLoading}
                                className="h-12 text-lg font-medium bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {isLoading ? <LoaderCircle className="animate-spin" /> : (
                                    <>
                                        <Sparkles className="w-5 h-5 mr-2" />
                                        Activate
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="received">
                <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-white/50 dark:from-gray-900 dark:to-gray-900/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                            Received Codes
                        </CardTitle>
                        <CardDescription className="text-lg">
                            View all your received activation codes
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-lg border bg-card">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10">
                                            <TableHead className="font-semibold">Code</TableHead>
                                            <TableHead className="font-semibold">Status</TableHead>
                                            <TableHead className="w-[100px] font-semibold">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    {currentCodes.length !== 0 ?
                                        <TableBody>
                                            {currentCodes.map((code) => (
                                                <TableRow key={code.id} className="hover:bg-gradient-to-r hover:from-blue-500/5 hover:to-cyan-500/5 transition-colors">
                                                    <TableCell className="font-medium">{code.code}</TableCell>
                                                    <TableCell>
                                                        <span className={`px-2 py-1 rounded-full text-sm ${code.isUsed
                                                                ? 'bg-gray-500/10 text-red-500 dark:text-red-400'
                                                                : 'bg-green-500/10 text-green-500 dark:text-green-400'
                                                            }`}>
                                                            {code.isUsed ? 'Used' : 'Unused'}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => copyReferralCode(code.code)}
                                                            className="h-8 w-8 hover:bg-blue-500/10 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                                                        ><CopyIcon className="h-4 w-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody> :
                                        <TableBody>
                                            <TableRow>
                                                <TableCell colSpan={3} className="text-center text-lg font-semibold">No Activation Codes found</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    }
                                </Table>
                        </div>
                        <div className="mt-4">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious 
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            // disabled={currentPage === 1}
                                            className="hover:bg-blue-500/10 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                                        />
                                    </PaginationItem>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                                        .filter(page => {
                                            if (page === 1 || page === totalPages) return true;
                                            return Math.abs(currentPage - page) <= 1;
                                        })
                                        .map((page, i, array) => (
                                            <React.Fragment key={page}>
                                                {i > 0 && array[i - 1] !== page - 1 && (
                                                    <PaginationItem>
                                                        <PaginationEllipsis />
                                                    </PaginationItem>
                                                )}
                                                <PaginationItem>
                                                    <PaginationLink
                                                        onClick={() => setCurrentPage(page)}
                                                        isActive={currentPage === page}
                                                        className="data-[active=true]:bg-gradient-to-r data-[active=true]:from-blue-500 data-[active=true]:to-cyan-500 data-[active=true]:text-white transition-all duration-300"
                                                    >
                                                        {page}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            </React.Fragment>
                                        ))}
                                    <PaginationItem>
                                        <PaginationNext 
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                            // disabled={currentPage === totalPages}
                                            className="hover:bg-blue-500/10 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="transfer">
                <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-white/50 dark:from-gray-900 dark:to-gray-900/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-cyan-500 to-pink-500 bg-clip-text text-transparent">
                            Transfer Code
                        </CardTitle>
                        <CardDescription className="text-lg">
                            Transfer activation codes to another user
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="grid gap-3">
                                <div>

                                    <Input
                                        placeholder="Recipient User ID"
                                        type="text"
                                        value={transfer.userId}
                                        onChange={(e) => setTransfer((prev) => {
                                            return { ...prev, userId: e.target.value }
                                        })}
                                        disabled={isTransferLoading}
                                        className="border-2 h-12 transition-all duration-300 focus:border-cyan-500 dark:focus:border-cyan-400"
                                    />
                                    {transferUserName ? <div className="text-green-500 text-sm">{transferUserName}</div>:transferUserName !== "" && <div className="text-red-500 text-sm">Invalid UserId</div>}
                                </div>
                            <Input
                                placeholder="Quantity to transfer"
                                type="number"
                                min="1"
                                value={transfer.quantity}
                                onChange={(e) => setTransfer((prev)=>{
                                    return {...prev, quantity: parseFloat(e.target.value)}
                                })}
                                disabled={isTransferLoading}
                                className="border-2 h-12 transition-all duration-300 focus:border-pink-500 dark:focus:border-pink-400"
                            />
                            <Button 
                                onClick={handleTransfer} 
                                disabled={isTransferLoading || !transfer.userId || !transfer.quantity}
                                className="h-12 text-lg font-medium bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-600 hover:to-pink-600 text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {isTransferLoading ? <LoaderCircle className="animate-spin" /> : "Transfer"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    </div>
    );
};

export default Activation;

