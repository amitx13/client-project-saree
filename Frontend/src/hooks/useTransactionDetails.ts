import api from "@/api";
import API_BASE_URL from "@/config";

export const useTransactionDetails = async (token:string, formData:FormData) => {
    try {
        const res = await api.post(`${API_BASE_URL}/api/v1/user/transactionDetails`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

        return res.data
    }
    catch(e:any) {
        if(e.response){
            return e.response.data
        }
        return { success: false, message:"Something went wrong!" };
    }          
}

export const useTransactionData = async (token:string,userId:string) => {
    try {
        const res = await api.get(`${API_BASE_URL}/api/v1/user/transactionData/${userId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            return res.data
    }
    catch(e:any) {
        if(e.response){
            return e.response.data
        }
        return { success: false, message:"Something went wrong!" };
    }          
}