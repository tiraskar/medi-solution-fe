
export const tableComponent = {
    header: {
        cell: (props) => {
            return (
                <th
                    {...props}
                    className="px-4 !py-2 font-semibold !text-white whitespace-nowrap border-b border-gray-200 text-sm text-start uppercase !bg-[#28648a]"
                />
            );
        },
    },
    body: {
        cell: (props) => (
            <td
                {...props}
                className="font-onest px-3 !py-2 text-sm text-black"
            />
        ),
        row: (props) => {
            const rowIndex = props['data-row-index'];
            const isEven = rowIndex % 2 === 0;
 
            return (
                <tr
                    {...props}
                    className={`transition-all duration-300 ease-in-out border-b border-gray-200 hover:bg-[#f5f5ef] text-sm text-start ${isEven ? 'bg-white' : 'bg-[#f9f9f9]'
                        }`}
                />
            );
        },
    },
};
 