import { Outlet, Navigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

const ProtectedRoutes = () => {
    const [cookies] = useCookies();
    const userInfo = JSON.parse(localStorage.getItem('user-info'));
    const token = userInfo?.token;
    // console.log(token);
    // const token = cookies.token;
    // console.log(cookies);
    // console.log(document.cookie);


    if (!token) {
        console.error('Token is missing or invalid');
        return <Navigate to="/login" />;
    }

    return <Outlet />;
}

export default ProtectedRoutes;
