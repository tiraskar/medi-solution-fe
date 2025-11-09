import { useEffect } from 'react';
import { EconomicYearForm } from '../../components';
import { useDispatch } from 'react-redux';
import { fetchEconomicYearList } from '../../api/master.api';

const EconomicYear = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchEconomicYearList());
    }, [dispatch])

    return (
        <div className=' h-full w-full flex items-center justify-center'>
            <div className='bg-[#3279a8]/5 p-6  rounded-xl '>
                <EconomicYearForm />
            </div>
        </div>
    );
};

export default EconomicYear;