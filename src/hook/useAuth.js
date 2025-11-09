
import { useSelector } from 'react-redux';

export const useAuth = () => {
    const { isLoggedIn } = useSelector(state => state.auth);
    return { isLoggedIn };
};
