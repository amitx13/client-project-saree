import api from "@/api";
import { LoginFormData } from "@/components/appComponents/Login";
import API_BASE_URL from "@/config";

export const useLogin = async (data: LoginFormData) => {
    try {
        const res = await api.post(`${API_BASE_URL}/api/v1/auth/user/login`, data);
        console.log(res)
        if (res.status === 200) {
            return { status: true, data: res.data }
        } else {
            return { status: false, data: res.data }
        }
    }
    catch (e:any){
        if(e.response){
            return e.response.data
        }else{
            return { status: false, message:"Something went wrong!" };
        }
    }
}