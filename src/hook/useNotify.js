import { useContext } from 'react';
import NotificationContext from '../context/NotificationProvider';

const useNotify = () => useContext(NotificationContext);

export default useNotify;
