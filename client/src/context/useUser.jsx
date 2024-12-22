import { useContext } from 'react';
import { UserContext } from './UserContext';

const useUser = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    return useContext(UserContext);
};

export default useUser;
