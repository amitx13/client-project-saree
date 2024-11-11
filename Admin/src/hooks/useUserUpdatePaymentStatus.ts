import api from "@/api";
import API_BASE_URL from "@/config";

export const useUserUpdatePaymentStatusToCompleted = async(token:string, Id: string) => {
    try {
        const res = await api.put(`${API_BASE_URL}/api/v1/admin/completeWithdrawalRequest`,  {
            requestId: Id
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

export const useUserUpdatePaymentStatusToRejected = async(token:string, Id: string) => {
    try {
        const res = await api.put(`${API_BASE_URL}/api/v1/admin/rejectWithdrawalRequest`,  {
            requestId: Id
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