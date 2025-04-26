
//new 
/*

import axios from "axios";
import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

// ✅ Connect to socket
const socket = io(`${import.meta.env.VITE_SERVER_URL}`, { autoConnect: false });

const Chat = ({ userId, token }) => {
    const { id: receiverId } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (!socket.connected) {
            socket.connect();
        }

        // ✅ Join the chat room for real-time updates
        socket.emit("join", userId);

        // ✅ Handle incoming messages
        const handleReceiveMessage = (data) => {
            console.log("📩 Received Message:", data);

            // ✅ Only update messages if it's for the current chat
            if (data.senderId === receiverId || data.receiverId === receiverId) {
                setMessages((prev) => [...prev, data]);
            }
        };

        socket.on("receiveMessage", handleReceiveMessage);

        return () => {
            socket.off("receiveMessage", handleReceiveMessage);
        };
    }, [receiverId]); // ✅ Depend only on the current chat partner

    useEffect(() => {
        fetchMessages();
    }, [receiverId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchMessages = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/chats/${userId}/${receiverId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessages(res.data);
        } catch (error) {
            console.error("❌ Error fetching messages", error);
        }
    };

    const sendMessage = async () => {
        if (!newMessage.trim()) return;

        const messageData = { senderId: userId, receiverId, message: newMessage };

        try {
            // ✅ Send message via WebSocket
            socket.emit("sendMessage", messageData);

            // ✅ Optimistic UI update
            setMessages((prev) => [...prev, messageData]);

            setNewMessage("");
            scrollToBottom();
        } catch (error) {
            console.error("❌ Error sending message:", error.response?.data || error);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="max-w-2xl mx-auto p-4 bg-white shadow-lg rounded-lg flex flex-col h-screen w-full sm:w-11/12 mt-20">
            <h2 className="text-xl font-semibold mb-4 text-center bg-blue-500 text-white p-2 rounded-lg">
                Chat with Connections
            </h2>

            <div className="flex-grow overflow-y-auto p-4 border rounded-lg bg-gray-100 max-h-[70vh]">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.senderId === userId ? "justify-end" : "justify-start"} mb-2`}>
                        <div className={`p-3 max-w-xs rounded-lg shadow-md ${msg.senderId === userId ? "bg-blue-500 text-white" : "bg-gray-300 text-black"}`}>
                            {msg.message}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className="mt-2 flex gap-2 p-2 bg-white border-t sticky bottom-0 w-full">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="w-full p-2 border rounded-lg"
                />
                <button onClick={sendMessage} className="bg-blue-500 text-white p-2 rounded-lg flex items-center">
                    <Send size={20} />
                </button>
            </div>
        </div>
    );
};

export default Chat;
*/



import axios from "axios";
import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

// ✅ Connect to socket
const socket = io(`${import.meta.env.VITE_SERVER_URL}`, { autoConnect: false });

const Chat = ({ userId, token }) => {
    const { id: receiverId } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (!socket.connected) {
            socket.connect();
        }

        socket.emit("join", userId);

        const handleReceive = (data) => {
            if (data.senderId === receiverId || data.receiverId === receiverId) {
                const msgWithTimestamp = {
                    ...data,
                    timestamp: data.timestamp || new Date().toISOString(),
                };
                setMessages((prev) => [...prev, msgWithTimestamp]);
            }
        };

        socket.on("receiveMessage", handleReceive);

        return () => {
            socket.off("receiveMessage", handleReceive);
        };
    }, [receiverId]);

    useEffect(() => {
        fetchMessages();
    }, [receiverId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchMessages = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/chats/${userId}/${receiverId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Ensure timestamps exist and are in ISO format
            const normalized = res.data.map((msg) => ({
                ...msg,
                timestamp: msg.timestamp || new Date().toISOString(),
            }));

            setMessages(normalized);
        } catch (error) {
            console.error("❌ Error fetching messages", error);
        }
    };

    const sendMessage = async () => {
        if (!newMessage.trim()) return;

        const messageData = {
            senderId: userId,
            receiverId,
            message: newMessage,
            timestamp: new Date().toISOString(), // 💡 Add timestamp here too
        };

        try {
            socket.emit("sendMessage", messageData);
            setMessages((prev) => [...prev, messageData]);
            setNewMessage("");
            scrollToBottom();
        } catch (error) {
            console.error("❌ Error sending message:", error.response?.data || error);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const formatDateLabel = (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date)) return "Unknown Date";

        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        const sameDay = (d1, d2) => d1.toDateString() === d2.toDateString();

        if (sameDay(date, today)) return "Today";
        if (sameDay(date, yesterday)) return "Yesterday";

        const diff = (today - date) / (1000 * 60 * 60 * 24);
        if (diff < 7) {
            return date.toLocaleDateString(undefined, { weekday: "long" });
        }

        return date.toLocaleDateString(undefined, {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    const groupMessagesByDate = (msgs) => {
        const grouped = {};

        msgs.forEach((msg) => {
            const dateKey = new Date(msg.timestamp).toDateString();
            if (!grouped[dateKey]) grouped[dateKey] = [];
            grouped[dateKey].push(msg);
        });

        return grouped;
    };

    const groupedMessages = groupMessagesByDate(messages);

    return (
        <div className="max-w-2xl mx-auto p-4 bg-white shadow-lg rounded-lg flex flex-col h-screen w-full sm:w-11/12 mt-20">
            <h2 className="text-xl font-semibold mb-4 text-center bg-blue-500 text-white p-2 rounded-lg">
                Chat with Connections
            </h2>

            <div className="flex-grow overflow-y-auto px-2 border rounded-lg bg-gray-100 max-h-[70vh]">
                {Object.keys(groupedMessages).map((dateKey, idx) => (
                    <div key={idx}>
                        <div className="text-center text-xs text-gray-500 my-4">
                            {formatDateLabel(dateKey)}
                        </div>
                        {groupedMessages[dateKey].map((msg, index) => (
                            <div
                                key={index}
                                className={`flex ${msg.senderId === userId ? "justify-end" : "justify-start"} mb-1 px-1`}
                            >
                                <div
                                    className={`p-2 px-3 rounded-xl max-w-xs relative text-sm shadow-md ${msg.senderId === userId
                                        ? "bg-blue-500 text-white"
                                        : "bg-white border text-black"
                                        }`}
                                >
                                    <div>{msg.message}</div>
                                    <div className="text-[10px] text-right mt-1 opacity-70">
                                        {msg.timestamp && !isNaN(new Date(msg.timestamp))
                                            ? new Date(msg.timestamp).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })
                                            : "--:--"}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className="mt-2 flex gap-2 p-2 bg-white border-t sticky bottom-0 w-full">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="w-full p-2 border rounded-full text-sm"
                />
                <button
                    onClick={sendMessage}
                    className="bg-blue-500 text-white p-2 rounded-md flex items-center justify-center"
                >
                    <Send size={24} />
                </button>
            </div>
        </div>
    );
};

export default Chat;
