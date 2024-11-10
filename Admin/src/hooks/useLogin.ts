import api from "@/api";
import { LoginFormData } from "@/components/appComponent/Login";
import API_BASE_URL from "@/config";

export const useLogin = async (data: LoginFormData) => {
    try {
        const res = await api.post(`${API_BASE_URL}/api/v1/auth/admin/login`, data);
        if (res.status === 200) {
            return { success: true, data: res.data.data }
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