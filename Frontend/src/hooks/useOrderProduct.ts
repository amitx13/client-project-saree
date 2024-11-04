import api from "@/api";
import API_BASE_URL from "@/config";

export const useOrderProduct = async (token:string, email:string, sareeId:string ) => {
    if (!token || !email || !sareeId) {
        return null;
    }
    try{
        const res = await api.post(`${API_BASE_URL}/api/v1/user/order/`, {
            email: email,
            sareeId: sareeId
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        return res.data;
    }catch (e:any){
        if(e.response){
            return e.response.data
        }else{
            return { success: false, message:"Something went wrong!" };
        }
    }
}


export const useUserOrderDetails = async (token:string, userId:string) => {
    if (!token || !userId ) {
        return null;
    }
    try{
        const res = await api.get(`${API_BASE_URL}/api/v1/user/userOrderStatus/${userId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        return res.data;
    }catch (e:any){
        if(e.response){
            return e.response.data
        }else{
            return { success: false, message:"Something went wrong!" };
        }
    }
}