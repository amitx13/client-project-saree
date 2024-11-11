import api from "@/api";
import API_BASE_URL from "@/config";

export const useUserOrdersDetails = async (token:string) => {
    if (!token) {
        return { success: false, message:"No Token Provided!" };
    }
    try{
        const res = await api.get(`${API_BASE_URL}/api/v1/admin/getAllOrdersDetails`,{
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });
        return res.data;
    } catch (e:any){
        if(e.response){
            return e.response.data
        }else{
            return { success: false, message:"Something went wrong!" };
        }
    }
}