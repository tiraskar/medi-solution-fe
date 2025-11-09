import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
// import { getCookie } from '../utils/cookies';


const ProtectedLayout = () => {
    const { isLoggedIn } = useSelector(state => state.auth);
    // const accessToken = getCookie({ cookieName: 'access_token' });
    return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedLayout;
