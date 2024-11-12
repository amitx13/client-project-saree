import api from "@/api";
import API_BASE_URL from "@/config";

export const useUpdateProductStock = async(token:string, Id: string, Stock:boolean) => {
    try {
        const res = await api.put(`${API_BASE_URL}/api/v1/admin/updateProductStock`,  {
            id: Id,
            stock:Stock
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        return res.data
    }
    catch (e:any){
        if(e.response){
            return e.response.data
        }
        else{
            return { success: false, message:"Something went wrong!" };
        }
    }
}

export const useDeleteProduct = async(token:string, id: string) => {
    try {
        const res = await api.delete(`${API_BASE_URL}/api/v1/admin/deleteproduct/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        return res.data
    }
    catch (e:any){
        if(e.response){
            return e.response.data
        }
        else{
            return { success: false, message:"Something went wrong!" };
        }
    }
}