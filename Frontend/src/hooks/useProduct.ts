import api from "@/api";
import API_BASE_URL from "@/config";

export const useProductData = async () => {
    try{
        const res = await api.get(`${API_BASE_URL}/api/v1/getProducts`,{
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return res.data;

    } catch {
        return { status: false, message:"Something went wrong!" };
    }
}