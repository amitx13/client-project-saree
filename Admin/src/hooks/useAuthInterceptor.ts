import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useLogout } from '../recoil/user';
import { useToast } from './use-toast';

const useAuthInterceptor = () => {
  const navigate = useNavigate();
  const logout = useLogout();
  const { toast } = useToast();

  useEffect(() => {
    const responseInterceptor = api.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401 || error.response?.status === 403) {
          logout();
          toast({
            title: 'Session Expired',
            description: 'Your session has expired, please log in again.',
            variant: 'destructive',
          });
          navigate('/login', { replace: true });
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [navigate, logout, toast]);
};

export default useAuthInterceptor;


/* interfceptors are used to intercept the request and response before they are handled by then or catch.
    api.interceptors.response.use(response => {
      console.log('Response status:', response.status);
      return response;
    }, error => {
      if (error.response) {
        console.log('Error status:', error.response.status);
      }
      return Promise.reject(error);
    });
    

*/