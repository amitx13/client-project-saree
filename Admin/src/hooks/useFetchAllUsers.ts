import api from "@/api";
import API_BASE_URL from "@/config";

export const useFetchAllUsers = async (token:string) => {
    if (!token) {
        return { success: false, message:"No Token Provided!" };
    }
    try{
        const res = await api.get(`${API_BASE_URL}/api/v1/admin/getAllUsers`,{
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

export const useFetchAllUsersTransactionDetails = async (token:string) => {
    if (!token) {
        return { success: false, message:"No Token Provided!" };
    }
    try{
        const res = await api.get(`${API_BASE_URL}/api/v1/admin/getAllUsersTransactionDetails`,{
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

export const useUpdateRequestCodeTransactionDetails = async (token:string, id:string, userId:string, approved:boolean) => {
    if (!token) {
        return { success: false, message:"No Token Provided!" };
    }
    try{
        const res = await api.put(`${API_BASE_URL}/api/v1/admin/updateRequestCodeTransactionDetails`,{
            id,
            userId,
            approved
        },{
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