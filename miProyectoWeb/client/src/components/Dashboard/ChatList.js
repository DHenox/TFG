import React from 'react';
import { Link } from 'react-router-dom';

const ChatList = ({ chats }) => {
    return (
        <div>
            <h3>Chats</h3>
            <ul>
                {chats.map((chat) => (
                    <li key={chat.id}>
                        <Link to={`/chats/${chat.id}`}>{chat.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ChatList;
