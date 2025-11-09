import React, { useState, useEffect } from "react";
import { AutoComplete, Spin } from "antd";
import axios from "axios";
import { useSelector } from "react-redux";

const SearchVehicle = () => {
    const [query, setQuery] = useState("");
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState(null);

    const { vehiclesList } = useSelector(state => state.vehicleInvoice);

    useEffect(() => {
        if (!query || query.trim().length < 2) {
            setOptions([]);
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            try {
                // 👇 replace with your real API
                const res = await axios.get(`/api/vehicles?search=${query}`);

                // Map API data into AntD AutoComplete format
                const mapped = res.data.map((item) => ({
                    value: item.id, // use ID as value
                    label: item.name, // display name
                }));
                setOptions(mapped);
            } catch (err) {
                console.error("Error fetching vehicles", err);
            } finally {
                setLoading(false);
            }
        };

        const debounce = setTimeout(fetchData, 400); // debounce API calls
        return () => clearTimeout(debounce);
    }, [query]);

    return (
        <div className="max-w-md mx-auto mt-10">
            <AutoComplete
                style={{ width: "100%" }}
                options={options}
                onSearch={(val) => setQuery(val)}
                onSelect={(value, option) => {
                    setSelected(option.label);
                }}
                placeholder="Search vehicles..."
                notFoundContent={loading ? <Spin size="small" /> : "No vehicles found"}
            />

            {selected && (
                <div className="mt-4 p-3 bg-green-100 rounded-lg">
                    ✅ Selected: <span className="font-bold">{selected}</span>
                </div>
            )}
        </div>
    );
};

export default SearchVehicle;
