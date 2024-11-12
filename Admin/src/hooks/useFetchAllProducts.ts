import api from "@/api";
import API_BASE_URL from "@/config";

export const useFetchAllProducts = async (token:string) => {
    if (!token) {
        return { success: false, message:"No Token Provided!" };
    }
    try{
        const res = await api.get(`${API_BASE_URL}/api/v1/admin/fetchAllProducts`,{
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

export const useAddNewProduct = async (token:string, formData:FormData) => {
    try {
        const res = await api.post(`${API_BASE_URL}/api/v1/admin/addproduct`, formData , 
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

        return res.data
    }
    catch {
        return { success: false, message:"Something went wrong!" };
    }          
}