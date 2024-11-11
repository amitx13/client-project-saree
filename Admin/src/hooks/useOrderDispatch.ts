import api from "@/api";
import API_BASE_URL from "@/config";

export const useOrderDispatch = async(token:string, Id: string) => {
    try {
        const res = await api.put(`${API_BASE_URL}/api/v1/admin/dispatchproduct`,  {
            id: Id
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        return res.data
    }
    catch {
        return { success: false, message:"Something went wrong!" };
    }
}