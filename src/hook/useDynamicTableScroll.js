import { useState, useEffect } from 'react';

export default function useDynamicTableScroll() {
    const [scroll, setScroll] = useState({ x: 'max-content', y: 350 }); // default fallback

    const computeScrollY = () => {
        //viewport height minus header/footer/padding
        const availableHeight = window.innerHeight - 300;
        return Math.max(200, availableHeight); // don't go too small
    };

    useEffect(() => {
        const handleResize = () => {
            const y = computeScrollY();
            setScroll({ x: 'max-content', y });
        };

        handleResize(); // initialize on mount
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return scroll;
}