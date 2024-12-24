import api from "@/api";
import API_BASE_URL from "@/config";

export const useCheckUserName = async (userName:string) => {
    try{
        const res = await api.get(`${API_BASE_URL}/api/v1/auth/user/checkUserName/${userName}`,{
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return res.data;

    } catch {
        return { success: false, message:"Something went wrong!" };
    }
}