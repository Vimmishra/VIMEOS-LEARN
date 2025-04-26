

import axios from "axios";
import { useEffect, useState } from "react";

const StudentPhone = () => {
    const [phoneData, setPhoneData] = useState([]);

    useEffect(() => {
        const fetchPhoneData = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/students`);



                setPhoneData(res.data.data);
            } catch (err) {
                console.log("Error fetching students:", err);
            }
        };

        fetchPhoneData();
    }, []);

    return (
        <div className="p-4">
            {phoneData.map((req, index) => (
                <div key={index} className="flex flex-col">
                    <div className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-md mb-4">
                        <div className="flex flex-col">

                            <p className="text-gray-600">{req.phoneNo}</p>
                        </div>

                        <a href={`tel:${req.phoneNo}`}>
                            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                                Call
                            </button>
                        </a>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StudentPhone;


