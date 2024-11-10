import api from "@/api";
import API_BASE_URL from "@/config";

export const useGeneratedCodes = async(token:string, codeCount: number) => {
    try {
        const res = await api.post(`${API_BASE_URL}/api/v1/admin/generateActivationCode`,  {
            count: codeCount
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (res.status === 200) {
            return { success: true, data: res.data.codes }
        } else {
            return { success: false, data: res.data }
        }
    }
    catch (e:any){
        if(e.response){
            return e.response.data
        }else{
            return { success: false, message:"Something went wrong!" };
        }
    }
}