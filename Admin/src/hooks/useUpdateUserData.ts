import api from "@/api";
import { Users } from "@/components/appComponent/UserManagement";
import API_BASE_URL from "@/config";

export const useUpdateUserData = async(userId:string,UserDetails: Users[0],token:string) => {
    try {
        const res = await api.put(`${API_BASE_URL}/api/v1/admin/updateUserData`,  {
            userID: userId,
            UserDetails: UserDetails
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