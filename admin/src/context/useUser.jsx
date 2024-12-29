import { useContext } from 'react';
import { UserContext } from './UserContext'; // Adjust the import based on your context file

const UseUser = () => {
    return useContext(UserContext);
};

export default UseUser;
