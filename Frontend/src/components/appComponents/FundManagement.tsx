import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, ArrowDownToLine, CreditCard, ImageUp, IndianRupee, LoaderCircle, QrCode, ReceiptText, X } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useEffect, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useUserState } from "@/recoil/user";
import { useFundRequest, useGetAllUsersTransactionDetails } from "@/hooks/useFundRequest";
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import API_BASE_URL from "@/config";

interface AddProduct {
    amt: number,
    TransactionId: string,
    image: File | null;
}

type TransactionHistoryProps = {
    image: string;
    id: string;
    userId: string;
    amount: number;
    transactionId: string;
    approved: boolean;
    createdAt: Date;
}[]

const FundManagement = () => {
    const [user] = useUserState()
    const navigate = useNavigate()

    const [transactionHistory, setTransactionHistory] = useState<TransactionHistoryProps | null>(null)
    const fetchTransactionHistory = async () => {
        const res = await useGetAllUsersTransactionDetails(user.id,user.token)
        if(res.success){
            if(res.users.length === 0){
                setTransactionHistory(null)
                return
            }
            setTransactionHistory(res.users)
        }
    }

    useEffect(()=>{
        if(!user){
            navigate("/login")
            return
        }
        else {
            fetchTransactionHistory()
        }
    },[user])

    let fileInputRef = useRef<HTMLInputElement>(null)
    const [transferAmount, setTransferAmount] = useState<string>("");
    const [image, setImage] = useState<string>("")
    const [newProduct, setNewProduct] = useState<AddProduct>({
        amt: 0,
        TransactionId: "",
        image: null,

    })
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {

        if (e.target.files && e.target.files[0]) {
            setNewProduct({ ...newProduct, image: e.target.files[0] });
        }
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setImage(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const onSubmit = async () => {
        if (!newProduct.image || newProduct.TransactionId === "" || newProduct.amt === 0) {
            toast({
                title: "Failed",
                description: "Please fill all the fields",
                variant: "destructive",
            })
            return

        }
        setIsLoading(true)
        const formData = new FormData()
        formData.append("userId", user.id)
        formData.append("amount", newProduct.amt.toString())
        formData.append("transactionId", newProduct.TransactionId)
        formData.append("image", newProduct.image)
        const res = await useFundRequest(user.token, formData)
        if (res.success) {
            fetchTransactionHistory()
            setNewProduct({
                amt: 0,
                TransactionId: "",
                image: null,
            })
            setImage("")
            toast({
                title: "Payment Proof Uploaded Successfully!",
                description: "Your request has been submitted successfully",
                duration: 3000,
            })
        } else {
            toast({
                title: "Failed to Upload Payment Proof! Please try again",
                description: res.message,
                variant: "destructive",
                duration: 3000,
            })
        }
        setIsLoading(false)
    }
    return (
        <div className="container mx-auto md:w-1/2 px-4 py-12 min-h-screen bg-gradient-to-b from-background to-background/50 dark:from-background dark:to-background/50">
            <Tabs defaultValue="deposite-fund" className="w-full">
                <TabsList className="grid w-full grid-cols-2 p-1 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-pink-500/10 rounded-lg backdrop-blur-sm">
                    <TabsTrigger
                        value="deposite-fund"
                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white transition-all duration-300"
                    >
                        <IndianRupee className="w-4 h-4 mr-2" />
                        Deposite Fund
                    </TabsTrigger>
                    <TabsTrigger
                        value="deposite-fund-report"
                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white transition-all duration-300"
                    >
                        <ReceiptText className="w-4 h-4 mr-2" />
                        Deposite Fund Report
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="deposite-fund">
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-white/50 dark:from-gray-900 dark:to-gray-900/50 backdrop-blur-sm">
                        <CardHeader className="space-y-1">
                            <div className="text-center space-y-2">
                                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                                    Deposite Fund
                                </CardTitle>
                                <CardDescription className="text-lg">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="numOfUsers" className="text-sm font-medium text-gray-700 dark:text-gray-300">Enter the number of activation codes you need </Label>
                                            <div className="relative">
                                                <Input
                                                    id="numOfUsers"
                                                    placeholder="e.g., 5 (1 code = ₹580)"
                                                    type="number"
                                                    value={transferAmount}
                                                    onChange={(e) => setTransferAmount(e.target.value)}
                                                    className="h-9 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                                                />
                                            </div>
                                            {transferAmount && (<p className="text-sm text-green-700 dark:text-green-300">
                                                Transfer Amount: ₹{parseInt(transferAmount) * 580}
                                            </p>)}
                                        </div>
                                    </div>
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <Tabs defaultValue="bank" className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="bank">
                                        <CreditCard className="mr-2 h-4 w-4" />
                                        Bank Transfer
                                    </TabsTrigger>
                                    <TabsTrigger value="qr">
                                        <QrCode className="mr-2 h-4 w-4" />
                                        Pay via QR
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="qr" className="flex flex-col items-center space-y-4">
                                    <div className="p-4 bg-white rounded-lg">
                                        <img
                                            src="/BankORcode.svg"
                                            alt="Bank QR Code"
                                            className=" h-96"
                                        />
                                    </div>
                                    <p className="text-sm text-center text-muted-foreground">
                                        Scan this QR code with any UPI app to pay ₹580
                                    </p>
                                </TabsContent>

                                <TabsContent value="bank">
                                    <div className="grid gap-2">
                                        <h3 className="font-semibold">Bank Details</h3>
                                        <p>Bank Name: HDFC Bank</p>
                                        <p>Account Number: 50200095360461</p>
                                        <p>IFSC Code: HDFC0004682</p>
                                        <p>Account Holder: J D LIFESTYLE</p>
                                    </div>
                                </TabsContent>
                            </Tabs>

                            <Alert>
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Payment Instructions</AlertTitle>
                                <AlertDescription>
                                    After making the payment, Please upload the payment proof to Deposite Fund Report.
                                </AlertDescription>
                            </Alert>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="deposite-fund-report" className="space-y-4">
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-white/50 dark:from-gray-900 dark:to-gray-900/50 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent flex items-center justify-center">
                                Deposite Fund Report
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="w-full flex items-center justify-center">
                            <div className="space-y-4 w-11/12">
                                <div className="space-y-2">
                                    <Label htmlFor="amount" className="text-sm font-medium text-gray-700 dark:text-gray-300">Amount</Label>
                                    <div className="relative">
                                        <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <Input
                                            id="amount"
                                            placeholder="Enter amount"
                                            onChange={(e) => setNewProduct({ ...newProduct, amt: parseInt(e.target.value) })}
                                            value={newProduct.amt}
                                            type="number"
                                            className="pl-10 h-11 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="transactionId" className="text-sm font-medium text-gray-700 dark:text-gray-300">Transaction ID</Label>
                                    <Input
                                        id="transactionId"
                                        placeholder="Enter transaction ID"
                                        value={newProduct.TransactionId}
                                        onChange={(e) => setNewProduct({ ...newProduct, TransactionId: e.target.value })}
                                        type="text"
                                        className="h-11 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="upload" className="text-sm font-medium text-gray-700 dark:text-gray-300">Upload Screenshot</Label>
                                    {image && (
                                        <div className="mt-2 flex">
                                            <img
                                                src={image}
                                                alt="Preview"
                                                className="rounded-md object-contain h-20"
                                            />
                                            <X className="cursor-pointer" onClick={() => {
                                                setNewProduct({ ...newProduct, image: null });
                                                setImage("");
                                                if (fileInputRef.current) {
                                                    fileInputRef.current.value = "";
                                                }
                                            }} />
                                        </div>
                                    )}
                                    {image === "" ?
                                        <div className="w-full">
                                            <Button type="submit" className="w-full"
                                                onClick={() => fileInputRef.current?.click()}
                                            >
                                                <ImageUp className="mr-2 h-4 w-4" /> Upload
                                            </Button>
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleImageUpload}
                                                accept="image/*"
                                                className="hidden"
                                            />
                                        </div> : null
                                    }
                                </div>
                                {
                                    isLoading ?
                                        <div className="flex items-center w-full justify-center">
                                            <LoaderCircle className="animate-spin" size={30} />
                                        </div>
                                        :
                                        <Button
                                            className="w-full h-11 text-base font-medium bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-indigo-600 hover:to-purple-600 text-white transition-all duration-300 shadow-md hover:shadow-lg"
                                            onClick={onSubmit}
                                            disabled={isLoading}
                                        >
                                            <ArrowDownToLine className="w-5 h-5 mr-2" />
                                            Submit
                                        </Button>
                                }
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-white/50 dark:from-gray-900 dark:to-gray-900/50 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                                Transaction History
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                        {transactionHistory !== null  ? <div className="overflow-x-auto rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>UserId</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Date/Time</TableHead>
                                    <TableHead>Transaction Id</TableHead>
                                    <TableHead>Image</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactionHistory.map((user) => {
                                    return (
                                        <TableRow key={user.id}>
                                            <TableCell className="font-medium">{user.userId}</TableCell>
                                            <TableCell>{user.amount}</TableCell>
                                            <TableCell>{new Date(user.createdAt).toLocaleString()}</TableCell>
                                            <TableCell>{user.transactionId}</TableCell>
                                            <TableCell>{
                                                user.image ?
                                                    <img
                                                        src={`${API_BASE_URL}/${user.image}`}
                                                        alt={"Transaction"}
                                                        className="rounded-md w-12 h-12 object-cover cursor-pointer"
                                                        onClick={() => {
                                                            user.image && window.open(`${API_BASE_URL}/${user.image}`)
                                                        }}
                                                    /> : "N/A"}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={user.approved ? "default" : "destructive"}
                                                    className={user.approved ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}
                                                >
                                                    {user.approved ? "Approved" : "Pending"}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                        </div>
                        :
                        <div>
                            <Alert>
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>No Transaction Data Found</AlertTitle>
                                <AlertDescription>
                                    You have not made any transactions yet.
                                </AlertDescription>
                            </Alert>
                        </div>
                            }
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default FundManagement;

