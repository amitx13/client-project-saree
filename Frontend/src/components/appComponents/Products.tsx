import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { IndianRupee } from 'lucide-react';
import { useUserState } from '@/recoil/user';
import { useEffect, useState } from "react";
import { useProductData } from "@/hooks/useProduct";
import API_BASE_URL from "@/config";
import { useOrderProduct } from "@/hooks/useOrderProduct";

interface Saree {
  id: string,
  name: string,
  price: number,
  image: string
}

type Sarees = Saree[]

export default function Products() {
  const [user,updateUser] = useUserState()
  const { toast } = useToast();
  const [sarees, setSarees] = useState<Sarees>()

  useEffect(() => {
    const fetchSarees = async () => {
      const res = await useProductData()
      setSarees(res)
    }
    fetchSarees()
  }, [])


  const handlePurchase = (sareeId: string) => {
    if(!user){
      toast({
        title: "Login Required",
        description: "Please login to buy sarees",
        variant: "destructive",
      });
      return;
    }

    if (!user.membershipStatus) {
      toast({
        title: "Membership Required",
        description: "Please purchase a membership to buy sarees",
        variant: "destructive",
      });
      return;
    }

    if (user.orderStatus) {
      toast({
        title: "Already Purchased",
        description: "You have already purchased a saree",
        variant: "destructive",
      });
      return;
    }
    const createOrder = async () => {
      const res = await useOrderProduct(user.token, user.email, sareeId)
      if (res.status) {
        const newuser = {...user, orderStatus: true}
        updateUser(newuser, user.token)

        toast({
          title: "Success",
          description: "Saree purchased successfully",
        });
      } else {
        toast({
          title: "Failed!",
          description: `${res.message}`,
          variant: "destructive",
        });
      }
    }
    createOrder()
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Exquisite Indian Sarees</h1>
      <p className="text-center mb-8 text-muted-foreground">Claim your saree</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {sarees && sarees.map((saree, index) => (
          <Card key={index} className="flex flex-col">
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
              <p className=" flex items-center text-xl font-bold text-primary"><IndianRupee size={16} strokeWidth={2.25} />{saree.price}</p>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() => handlePurchase(saree.id)}
                disabled={user && user.orderStatus}
              >
                {"Buy Now"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}