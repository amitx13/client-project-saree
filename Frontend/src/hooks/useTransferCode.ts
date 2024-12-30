import api from "@/api";
import API_BASE_URL from "@/config";

export const useTransferCode = async (token:string, parentUserID:string, chileUserId:string, quantity:number ) => {
    if (!token || !parentUserID || !chileUserId || !quantity) {
        return null;
    }
    try{
        const res = await api.post(`${API_BASE_URL}/api/v1/user/transferActivationCode/`, {
            parentUserID: parentUserID,
            chileUserId: chileUserId,
            quantity: quantity
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