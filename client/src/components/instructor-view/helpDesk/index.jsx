
/*import axios from "axios";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";


const HelpDesk = () => {


    const [helpData, setHelpData] = useState([]);

    const [selectedRows, setSelectedRows] = useState({});
    const [status, setStatus] = useState({});


    useEffect(() => {
        fetchHelpData();
    }, [])

    const fetchHelpData = async () => {
        try {

            const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/help`);
            setHelpData(res.data);
        }

        catch (err) {
            console.log(err);

        }
    }


    const handleStatusChange = (email, value) => {
        setStatus((prev) => {
            const updatedStatus = { ...prev, [email]: value };
            localStorage.setItem("helpRequestStatus", JSON.stringify(updatedStatus));
            return updatedStatus;
        });
    };


    const toggleRowSelection = (email) => {
        setSelectedRows((prev) => ({ ...prev, [email]: !prev[email] }));
    };




    const handleDelete = async (email) => {
        try {
            const res = await axios.delete(`${import.meta.env.VITE_SERVER_URL}/api/help/${email}`);

            if (res.status === 200) {
                setRequests((prev) => prev.filter((req) => req.email !== email));
                setSelectedRows((prev) => {
                    const updated = { ...prev };
                    delete updated[email];
                    return updated;
                });
            }
        } catch (error) {
            console.error("Error deleting request:", error);
        }
    };




    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Checkbox</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Problem</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {helpData.map((req) => (
                    <TableRow key={req.email}>
                        <TableCell>
                            <Checkbox checked={!!selectedRows[req.email]} onCheckedChange={() => toggleRowSelection(req.email)} />
                        </TableCell>
                        <TableCell>{req.name}</TableCell>
                        <TableCell>{req.email}</TableCell>
                        <TableCell>{req.issue}</TableCell>
                        <TableCell>
                            <Select value={status[req.email] || "pending"} onValueChange={(value) => handleStatusChange(req.email, value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="in-progress">In Progress</SelectItem>
                                    <SelectItem value="resolved">Resolved</SelectItem>
                                </SelectContent>
                            </Select>
                        </TableCell>
                        <TableCell>
                            {selectedRows[req.email] && (
                                <Button variant="destructive" onClick={() => handleDelete(req.email)}>
                                    Delete
                                </Button>
                            )}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}


export default HelpDesk
*/


import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import axios from "axios";
import { useEffect, useState } from "react";

const HelpRequestsTable = () => {
    const [helpData, setHelpData] = useState([]);
    const [selectedRows, setSelectedRows] = useState({});
    const [status, setStatus] = useState(() => {
        return JSON.parse(localStorage.getItem("helpRequestStatus")) || {};
    });

    // Fetch help data on mount
    useEffect(() => {
        const fetchHelpData = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/help`);
                setHelpData(res.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchHelpData();
    }, []);

    // Save status to localStorage
    useEffect(() => {
        localStorage.setItem("helpRequestStatus", JSON.stringify(status));
    }, [status]);

    const toggleRowSelection = (email) => {
        setSelectedRows((prev) => ({ ...prev, [email]: !prev[email] }));
    };

    const handleStatusChange = (email, value) => {
        setStatus((prev) => {
            const updatedStatus = { ...prev, [email]: value };
            localStorage.setItem("helpRequestStatus", JSON.stringify(updatedStatus));
            return updatedStatus;
        });
    };

    const handleDelete = async (email) => {
        try {
            const res = await axios.delete(`${import.meta.env.VITE_SERVER_URL}/api/help/${email}`);

            if (res.status === 200) {
                // Remove from state
                setHelpData((prev) => prev.filter((req) => req.email !== email));
                setSelectedRows((prev) => {
                    const updated = { ...prev };
                    delete updated[email];
                    return updated;
                });
            }
        } catch (error) {
            console.error("Error deleting request:", error);
        }
    };

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Checkbox</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Problem</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {helpData.map((req) => (
                    <TableRow key={req.email}>
                        <TableCell>
                            <Checkbox checked={!!selectedRows[req.email]} onCheckedChange={() => toggleRowSelection(req.email)} />
                        </TableCell>
                        <TableCell>{req.name}</TableCell>
                        <TableCell>{req.email}</TableCell>
                        <TableCell>{req.issue}</TableCell>
                        <TableCell>
                            <Select value={status[req.email] || "pending"} onValueChange={(value) => handleStatusChange(req.email, value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="in-progress">In Progress</SelectItem>
                                    <SelectItem value="resolved">Resolved</SelectItem>
                                </SelectContent>
                            </Select>
                        </TableCell>
                        <TableCell>
                            {selectedRows[req.email] && (
                                <Button variant="destructive" onClick={() => handleDelete(req.email)}>
                                    Delete
                                </Button>
                            )}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default HelpRequestsTable;
