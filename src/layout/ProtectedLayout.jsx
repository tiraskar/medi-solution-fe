import { Navigate, Outlet } from 'react-router-dom';


const ProtectedLayout = () => {
    // const { isLoggedIn } = useSelector(state => state.auth);
    // return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
    return <Outlet />;
};

export default ProtectedLayout;
