import { atom, useRecoilState } from "recoil";

export const userState = atom({
    key:"userState",
    default: JSON.parse(localStorage.getItem('userState') || 'null'),
})

export const useUserState = () => {
    const [user, setUser] = useRecoilState(userState);

    const updateUser = (Id:string,token:string) => {
        const Admin = {
            token: token,
            Id: Id,
        };
        setUser(Admin);
        localStorage.setItem('userState', JSON.stringify(Admin));
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