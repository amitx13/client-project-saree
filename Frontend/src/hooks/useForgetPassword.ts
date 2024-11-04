import api from "@/api";
import API_BASE_URL from "@/config";

export const useForgetPassword = async (email:string ) => {
    if ( !email ) {
        return null;
    }
    try{
        const res = await api.post(`${API_BASE_URL}/api/v1/auth/user/forgetPassword/`, {
            email: email,
        }, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        return res.data;
    }catch (e:any){
        if(e.response){
            return e.response.data
        }else{
            return { success: false, message:"Something went wrong!" };
        }
    }
}