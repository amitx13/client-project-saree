import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useLogout } from '../recoil/user';
import { useToast } from './use-toast';

const useAuthInterceptor = () => {
  const navigate = useNavigate();
  const logout = useLogout();
  const { toast } = useToast();
  const interceptorRef = useRef<number | null>(null);

  useEffect(() => {
    if (interceptorRef.current !== null) {
      api.interceptors.response.eject(interceptorRef.current);
    }

    interceptorRef.current = api.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {

          const isAuthError = error.config?.url !== '/login';
          if (isAuthError) {
            logout();
            toast({
              title: 'Session Expired',
              description: 'Your session has expired, please log in again.',
              variant: 'destructive',
            });
            navigate('/login', { replace: true });
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      if (interceptorRef.current !== null) {
        api.interceptors.response.eject(interceptorRef.current);
        interceptorRef.current = null;
      }
    };
  }, []);

  return null;
};

export default useAuthInterceptor;