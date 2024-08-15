import React, { useState } from 'react';
import { Box, Typography, Button, Card, CardContent } from '@mui/material';
import ChatDetail from './ChatDetail';

const ChatList = ({ chats }) => {
    const [selectedChat, setSelectedChat] = useState(null);

    const handleSelectChat = (chat) => {
        setSelectedChat(chat);
    };

    return (
        <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
                Chats
            </Typography>
            <Box>
                {chats.map((chat) => (
                    <Card key={chat.id} sx={{ mb: 2 }}>
                        <CardContent onClick={() => handleSelectChat(chat)}>
                            <Typography variant="body1">{chat.name}</Typography>
                        </CardContent>
                    </Card>
                ))}
            </Box>
            {selectedChat && <ChatDetail chat={selectedChat} />}
            <Button variant="contained" color="primary">
                Add Chat
            </Button>
        </Box>
    );
};

export default ChatList;
