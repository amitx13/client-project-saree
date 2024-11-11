import { atom, useRecoilState } from "recoil";

interface User {
    id:string;
    name: string;
    email: string;
    membershipStatus: boolean;
    orderStatus: boolean;
    token: string;
    tokenExpiry: number;
}

type token = string;

export const userState = atom({
    key:"userState",
    default: JSON.parse(localStorage.getItem('userState') || 'null'),
})

export const useUserState = () => {
    const [user, setUser] = useRecoilState(userState);

    const updateUser = (newUser:User,token:token) => {
        if(token){
            newUser.token = token;
            newUser.tokenExpiry = Date.now() + 1000 * 60 * 60 * 24;
        } else {
            newUser.token = user.token;
            newUser.tokenExpiry = user.tokenExpiry;
        }
        setUser(newUser);
        localStorage.setItem('userState', JSON.stringify(newUser));
    };

    return [user, updateUser];
};

export const useLogout = () => {
    const [, setUser] = useRecoilState(userState);

    const logout = () => {
        setUser(null);
        localStorage.removeItem('userState');
    };

    return logout;
}