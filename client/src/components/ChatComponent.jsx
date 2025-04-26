import axios from "axios";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io(`${import.meta.env.VITE_SERVER_URL}`);

const ChatComponent = ({ currentUser, chatPartner }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        if (currentUser) {
            socket.emit("join", currentUser._id);
        }

        socket.on("receiveMessage", (message) => {
            setMessages((prev) => [...prev, message]);
        });

        return () => {
            socket.off("receiveMessage");
        };
    }, [currentUser]);

    useEffect(() => {
        if (currentUser && chatPartner) {
            axios.get(`${import.meta.env.VITE_SERVER_URL}/api/chats/${currentUser._id}/${chatPartner._id}`)
                .then((res) => setMessages(res.data))
                .catch((err) => console.error("Error fetching chat history:", err));
        }
    }, [currentUser, chatPartner]);

    const sendMessage = () => {
        if (newMessage.trim() === "") return;

        const messageData = {
            senderId: currentUser._id,
            receiverId: chatPartner._id,
            message: newMessage
        };

        socket.emit("sendMessage", messageData);
        axios.post(`${import.meta.env.VITE_SERVER_URL}/api/chats/send`, messageData)
            .then(() => setMessages((prev) => [...prev, messageData]))
            .catch((err) => console.error("Error sending message:", err));

        setNewMessage("");
    };

    return (
        <div className="chat-container">
            <h2>Chat with {chatPartner.userName}</h2>
            <div className="chat-box">
                {messages.map((msg, index) => (
                    <div key={index} className={msg.senderId === currentUser._id ? "sent" : "received"}>
                        {msg.message}
                    </div>
                ))}
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default ChatComponent;
