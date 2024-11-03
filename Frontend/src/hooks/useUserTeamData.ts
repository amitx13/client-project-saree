import api from "@/api";
import API_BASE_URL from "@/config";

export const useUserTeamData = async (id:string, token:string) => {
    if (!id || !token) {
        return null;
    }
    try{
        const res = await api.get(`${API_BASE_URL}/api/v1/user/myTeamData/${id}`,{
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