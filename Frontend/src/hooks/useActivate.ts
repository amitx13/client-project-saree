import api from "@/api";
import API_BASE_URL from "@/config";

export const useActivate = async (id:string,token:string,activationCode:string ) => {
    if (!id || !token) {
        return null;
    }
    try{
        const res = await api.post(`${API_BASE_URL}/api/v1/user/activateAccount/`, {
            userId: id,
            code: activationCode
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
            return { status: false, message:"Something went wrong!" };
        }
    }
}