import API_BASE_URL from "@/config";
import { RegisterFormData } from "@/components/appComponents/Register";
import api from "@/api";

export const useCreateAccount = async (data: RegisterFormData) => {

    try {
        const res = await api.post(`${API_BASE_URL}/api/v1/auth/user/register`, data);
        if (res.status === 201) {
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