import api from "@/api";
import API_BASE_URL from "@/config";

export const useUserReward = async (id:string,token:string) => {
    if (!id || !token) {
        return null;
    }
    try{
        const res = await api.get(`${API_BASE_URL}/api/v1/user/getUserRewardData/${id}`,{
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
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

export const useUpdateUserReward = async (token:string, userId:string, rewardId:string ) => {
    if (!token || !userId || !rewardId) {
        return null;
    }
    try{
        const res = await api.post(`${API_BASE_URL}/api/v1/user/claimReward/`, {
            userId: userId,
            rewardId: rewardId
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