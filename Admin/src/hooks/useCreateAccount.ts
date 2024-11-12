import API_BASE_URL from "@/config";
import api from "@/api";
import { RegisterFormData } from "@/components/appComponent/Register";

export const useCreateAccount = async (token:string, data: RegisterFormData) => {
    try {
        const res = await api.post(`${API_BASE_URL}/api/v1/auth/admin/register`,
            data, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
        if (res.status === 201) {
            return { success: true }
        } else {
            return { success: false }
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