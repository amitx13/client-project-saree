import api from "@/api";
import API_BASE_URL from "@/config";

export const useActivateUserAccount = async(token:string, userId: string) => {
    try {
        const res = await api.post(`${API_BASE_URL}/api/v1/admin/activateUserAccount`,  {
            userId: userId
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (res.status === 200) {
            return { success: true, data: res.data }
        } else {
            return { success: false, data: res.data }
        }
    }
    catch (e:any){
        if(e.response){
            return e.response.data
        }else{
            return { success: false, message:"Something went wrong!" };
        }
    }
}