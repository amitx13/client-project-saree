import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, Clock, IndianRupee, XCircle, ShoppingBag, Package } from 'lucide-react';
import { useUserState } from '@/recoil/user';
import { useEffect, useState } from "react";
import { useProductData } from "@/hooks/useProduct";
import API_BASE_URL from "@/config";
import { useOrderProduct, useUserOrderDetails } from "@/hooks/useOrderProduct";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { X } from 'lucide-react'
import { DialogTitle } from "@radix-ui/react-dialog";

interface Saree {
  id: string;
  name: string;
  price: number;
  image: string;
  stock: boolean
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
  const [selectedImage, setSelectedImage] = useState<{ url: string; name: string } | null>(null);

  useEffect(() => {
    const fetchSarees = async () => {
      const res = await useProductData();
      if (res.status === false) {
        toast({ title: "Error", description: "Failed to fetch products", variant: "destructive" });
        return
      }
      setSarees(res);
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
      const res = await useOrderProduct(user.token, user.id, sareeId);
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "DISPATCHED":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "PENDING":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-12 min-h-screen bg-gradient-to-b from-background to-background/50 dark:from-background dark:to-background/50">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
          Exquisite Indian Sarees
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover our collection of handpicked sarees, each piece telling a unique story of tradition and elegance
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sarees?.map((saree) => (
         <Card className="group relative overflow-hidden bg-white dark:bg-gray-900 border-0 shadow-md hover:shadow-xl transition-all duration-300">
      <div 
        className="relative h-64"
        onClick={(e) => {
          e.stopPropagation();
          setSelectedImage({ 
            url: `${API_BASE_URL}/${saree.image}`,
            name: saree.name
          });
        }}
      >
      <div className="absolute inset-0 p-4">
        <div className="relative h-full overflow-hidden rounded-lg">
          <img
            src={`${API_BASE_URL}/${saree.image}`}
            alt={saree.name}
            className="w-full h-full object-top object-cover transform transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors duration-300" />
        </div>
      </div>

      </div>

      <div className="p-4">
        <CardHeader className="p-0 space-y-2">
          <div className="flex items-start justify-between gap-4">
            <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100 line-clamp-2">
              {saree.name}
            </CardTitle>
            <Badge 
              variant={saree.stock ? "default" : "destructive"}
              className={`
                shrink-0 px-3 py-1
                ${saree.stock 
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white" 
                  : "bg-gradient-to-r from-red-500 to-pink-500 text-white"
                }
              `}
            >
              {saree.stock ? "IN-STOCK" : "OUT-OF-STOCK"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-0 mt-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center text-2xl font-bold">
              <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent flex items-center">
                <IndianRupee size={20} className="mr-1" />
                {saree.price.toLocaleString('en-IN')}
              </span>
            </div>
            <Button
              className={`
                px-4 py-2 rounded-lg transition-all duration-300
                ${saree.stock 
                  ? "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 transform hover:scale-105 active:scale-95" 
                  : "bg-gray-400 cursor-not-allowed"
                }
              `}
              onClick={(e) => {
                e.stopPropagation();
                handlePurchase(saree.id);
              }}
              disabled={!saree.stock}
            >
              {saree.stock ? (
                <>
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Buy Now
                </>
              ) : (
                <>
                  <Package className="mr-2 h-4 w-4" />
                  Out of Stock
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
        ))}
      </div>

      {userOrderDetails && (
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-white/50 dark:from-gray-900 dark:to-gray-900/50 backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent flex items-center gap-2">
              <Package className="h-6 w-6" />
              Order History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border bg-card/50">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10">
                    <TableHead className="font-semibold">Ordered Date</TableHead>
                    <TableHead className="font-semibold">Name</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow
                    key={userOrderDetails.id}
                    className="hover:bg-gradient-to-r hover:from-blue-500/5 hover:to-cyan-500/5 transition-colors"
                  >
                    <TableCell className="font-medium">
                      {new Date(userOrderDetails.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{userOrderDetails.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(userOrderDetails.dispatch ? "DISPATCHED" : "PENDING")}
                        <span className={`font-medium ${userOrderDetails.dispatch
                          ? "text-green-500"
                          : "text-yellow-500"
                          }`}>
                          {userOrderDetails.dispatch ? "DISPATCHED" : "PENDING"}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedImage && (
        <ImagePreviewModal
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          imageUrl={selectedImage.url}
          productName={selectedImage.name}
        />
      )}
    </div>
  );
}



interface ImagePreviewProps {
  isOpen: boolean
  onClose: () => void
  imageUrl: string
  productName: string
}

export function ImagePreviewModal({ isOpen, onClose, imageUrl, productName }: ImagePreviewProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTitle>{productName}</DialogTitle>
      <DialogContent className="max-w-96 max-h-full p-0 overflow-hidden bg-transparent border-0">
        <div className="relative group">
          <img
            src={imageUrl}
            alt={productName}
            className="w-full h-full object-contain rounded-lg"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
