import api from "@/api";
import API_BASE_URL from "@/config";

export const useForgetPassword = async (userNameorId:string ) => {
    if ( !userNameorId ) {
        return null;
    }
    try{
        const res = await api.post(`${API_BASE_URL}/api/v1/auth/user/forgetPassword/`, {
            userNameorId: userNameorId,
        }, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        return res.data;
    }catch (e:any){
        if(e.response){
            return e.response.data
        }else{
            return { success: false, message:"Something went wrong!" };
        }
    }
}


export const useSendOtp = async (email:string ) => {
    if ( !email ) {
        return null;
    }
    try{
        const res = await api.post(`${API_BASE_URL}/api/v1/auth/user/send-otp/`, {
            email: email,
        }, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        return res.data;
    }catch (e:any){
        if(e.response){
            return e.response.data
        }else{
            return { success: false, message:"Something went wrong!" };
        }
    }
}

export const useVerifyOtp = async (email:string,otp:string ) => {
    if ( !email || !otp) {
        return null;
    }
    try{
        const res = await api.post(`${API_BASE_URL}/api/v1/auth/user/verify-otp/`, {
            email: email,
            otp: otp,
        }, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        return res.data;
    }catch (e:any){
        if(e.response){
            return e.response.data
        }else{
            return { success: false, message:"Something went wrong!" };
        }
    }
}