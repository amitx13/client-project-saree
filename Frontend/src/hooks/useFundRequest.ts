import api from "@/api";
import API_BASE_URL from "@/config";

export const useFundRequest = async (token:string, formData:FormData) => {
    try {
        const res = await api.post(`${API_BASE_URL}/api/v1/user/fundRequest`,
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

export const useGetAllUsersTransactionDetails = async (id:string,token:string) => {
    if(!id || !token){
        return { success: false, message:"No Token Or Id Provided!" };
    }
    try{
        const res = await api.get(`${API_BASE_URL}/api/v1/user/getUsersTransactionDetails/${id}`,{
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