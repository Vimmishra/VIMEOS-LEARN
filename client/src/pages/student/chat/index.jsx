import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ChatPage = ({ token }) => {
    const { chatId } = useParams();
    const [chat, setChat] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_SERVER_URL}/api/chats/${chatId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => setChat(res.data))
            .catch(err => alert("Error loading chat"));
    }, [chatId, token]);

    const sendMessage = () => {
        if (!message.trim()) return;

        axios.post(`${import.meta.env.VITE_SERVER_URL}/api/chats/${chatId}/send`, { text: message }, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                setChat(res.data);
                setMessage("");
            })
            .catch(err => alert("Error sending message"));
    };

    return (
        <div>
            <h2>Chat</h2>
            <div>
                {chat?.messages.map((msg, index) => (
                    <p key={index}><b>{msg.sender.userName}:</b> {msg.text}</p>
                ))}
            </div>
            <input value={message} onChange={e => setMessage(e.target.value)} placeholder="Type a message..." />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default ChatPage;
