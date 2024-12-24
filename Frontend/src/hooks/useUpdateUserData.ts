import api from "@/api";
import { ProfileFormProps } from "@/components/appComponents/Profile";
import API_BASE_URL from "@/config";

export const useUpdateUserData = async (id:string, UserDetails:ProfileFormProps,token:string ) => {
    if (!token || !id || !UserDetails) {
        return null;
    }
    try{
        const res = await api.post(`${API_BASE_URL}/api/v1/user/updateUserData/`, {
            id: UserDetails.id,
            UserDetails: UserDetails
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
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
