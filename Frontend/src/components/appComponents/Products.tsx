import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, Clock, IndianRupee, XCircle } from 'lucide-react';
import { useUserState } from '@/recoil/user';
import { useEffect, useState } from "react";
import { useProductData } from "@/hooks/useProduct";
import API_BASE_URL from "@/config";
import { useOrderProduct, useUserOrderDetails  } from "@/hooks/useOrderProduct";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

interface Saree {
  id: string;
  name: string;
  price: number;
  image: string;
}

type Sarees = Saree[];

interface UserOrderDetails {
  id: string;
  name?: string;
  sareeId: string;
  userId: string;
  createdAt: Date;
  dispatch: boolean;
}

export default function Products() {
  const [user, updateUser] = useUserState();
  const { toast } = useToast();
  const [sarees, setSarees] = useState<Sarees | null>(null);
  const [userOrderDetails, setUserOrderDetails] = useState<UserOrderDetails | null>(null);

  useEffect(() => {
    const fetchSarees = async () => {
      try {
        const res = await useProductData();
        setSarees(res);
      } catch (error) {
        toast({ title: "Error", description: "Failed to fetch products", variant: "destructive" });
      }
    };
    fetchSarees();
  }, [toast]);

  useEffect(() => {
    if (!user) return;

    const orderDetails = async () => {
      try {
        const res = await useUserOrderDetails(user.token, user.id);
        if (res.success) {
          setUserOrderDetails(res.orders[0]);
        } else {
          toast({ title: "Error", description: res.message, variant: "destructive" });
        }
      } catch (error) {
        toast({ title: "Error", description: "Failed to fetch order details", variant: "destructive" });
      }
    };
    orderDetails();
  }, [user, toast]);

  const handlePurchase = async (sareeId: string) => {
    if (!user) {
      toast({ title: "Login Required", description: "Please login to buy sarees", variant: "destructive" });
      return;
    }

    if (!user.membershipStatus) {
      toast({ title: "Membership Required", description: "Please purchase a membership to buy sarees", variant: "destructive" });
      return;
    }

    if (user.orderStatus) {
      toast({ title: "Already Purchased", description: "You have already purchased a saree", variant: "destructive" });
      return;
    }

    try {
      const res = await useOrderProduct(user.token, user.email, sareeId);
      if (res.success) {
        updateUser({ ...user, orderStatus: true }, user.token);
        toast({ title: "Success", description: "Saree purchased successfully" });
      } else {
        toast({ title: "Failed!", description: res.message, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to complete purchase", variant: "destructive" });
    }
  };

  const product = userOrderDetails && sarees?.find((saree) => saree.id === userOrderDetails.sareeId);
  if (product) userOrderDetails.name = product.name;

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-6 text-center">Exquisite Indian Sarees</h1>
        <p className="text-center mb-8 text-muted-foreground">Claim your saree</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {sarees?.map((saree) => (
            <Card key={saree.id} className="flex flex-col ">
              <CardHeader>
                <CardTitle className="text-lg">{saree.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="relative w-full pt-[100%] mb-4">
                  <img
                    src={`${API_BASE_URL}/${saree.image}`}
                    alt={saree.name}
                    className="absolute top-0 left-0 w-full h-full object-contain rounded-md"
                  />
                </div>
                <p className="flex items-center text-xl font-bold text-primary">
                  <IndianRupee size={16} strokeWidth={2.25} />
                  {saree.price}
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() => handlePurchase(saree.id)}
                  disabled={!!user?.orderStatus}
                >
                  Buy Now
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {userOrderDetails && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Order History</h2>
          {userOrderDetails && <OrderHistoryTable userData={userOrderDetails} />}
        </div>
      )}
    </div>
  );
}

const OrderHistoryTable = ({ userData }: { userData: UserOrderDetails }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "PENDING":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ordered Date</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow key={userData.id}>
              <TableCell>{new Date(userData.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>{userData.name}</TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(userData.dispatch ? "COMPLETED" : "PENDING")}
                  <span>{userData.dispatch ? "COMPLETED" : "PENDING"}</span>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
