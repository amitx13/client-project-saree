import api from "@/api";
import API_BASE_URL from "@/config";

export const useVerifyToken = async (token:string) => {
    if (!token) {
        return { status: false, message:"No Token Provided!" };
    }
    try{
        const res = await api.get(`${API_BASE_URL}/api/v1/auth/user/verifyToken/${token}`,{
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return res.data;
    } catch (e:any){
        if(e.response){
            return e.response.data
        }else{
            return { status: false, message:"Something went wrong!" };
        }
    }
}
