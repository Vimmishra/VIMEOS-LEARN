import axios from "axios";
import { useEffect, useState } from "react";

const PendingRequests = ({ userId, token }) => {
    const [requests, setRequests] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Fetch user data
        axios.get(`${import.meta.env.VITE_SERVER_URL}/api/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                setUser(res.data);
            })
            .catch(err => console.error("Error fetching user data:", err));

        // Fetch all users
        axios.get(`${import.meta.env.VITE_SERVER_URL}/api/users`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                setRequests(res.data);
            })
            .catch(err => console.error("Error fetching users:", err));
    }, [userId, token]);



    if (!user) {
        return <p>Loading...</p>;
    }

    const connections = requests.filter(u => user.connections.includes(u._id));

    return (
        <div>
            <h2>Connections</h2>

        </div>
    );
};

export default PendingRequests;
