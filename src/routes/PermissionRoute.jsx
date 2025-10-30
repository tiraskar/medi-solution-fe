import { Navigate } from "react-router-dom";

//eslint-disable-next-line
const PermissionRoute = ({ module, children }) => {
    // const { userInfo } = useSelector(state => state.auth);

    // // Safely parse permissions from localStorage
    // let permission = parseUntilNotString(userInfo?.permissionInfo.permission) || {};

    // // user_type "admin" has full access
    // if (userInfo?.user_type === "admin") return children;

    // // If module has any permission, allow access
    // if (module && Array.isArray(permission[module]) && permission[module].length > 0) {
    //     return children;
    // }

    // Otherwise, redirect
    return <Navigate to="/dashboard" replace />;
};

export default PermissionRoute;
