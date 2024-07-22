import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../utils/api';

const ChatDetail = () => {
    const { id } = useParams();
    const [chat, setChat] = useState(null);

    useEffect(() => {
        const fetchChat = async () => {
            const chatData = await api.getChat(id);
            setChat(chatData);
        };
        fetchChat();
    }, [id]);

    if (!chat) return <div>Loading...</div>;

    return (
        <div>
            <h2>{chat.name}</h2>
            <p>{chat.description}</p>
        </div>
    );
};

export default ChatDetail;
