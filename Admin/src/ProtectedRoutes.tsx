import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserState } from "./recoil/user";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const navigate = useNavigate();
  const [user,] = useUserState();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  return children;
};

export default ProtectedRoute;