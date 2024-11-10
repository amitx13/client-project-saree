import api from "@/api";
import API_BASE_URL from "@/config";

export const useResetPassword = async (token:string , newPassword:string ) => {
    if ( !token || !newPassword ) {
        return null;
    }
    try{
        const res = await api.post(`${API_BASE_URL}/api/v1/auth/admin/resetPassword/`, {
            token: token,
            newPassword:newPassword
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