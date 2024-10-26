import { useContext } from 'react';
import { UserContext } from './UserContext'; // Adjust the import based on your context file

const useUser = () => {
    return useContext(UserContext);
};

export default useUser;
