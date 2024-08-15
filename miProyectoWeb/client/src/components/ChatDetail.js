import React from 'react';
import { Box, Typography, TextField, Button, IconButton } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';

const ChatDetail = ({ chat }) => {
    return (
        <Box sx={{ mt: 2 }}>
            <Typography variant="h6">{chat.name}</Typography>
            <Box sx={{ maxHeight: 200, overflowY: 'auto', mt: 2 }}>
                {chat.messages.map((msg) => (
                    <Box key={msg.id} sx={{ mb: 2 }}>
                        <Typography variant="body2">{msg.content}</Typography>
                        <IconButton size="small" color="primary">
                            <Edit fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="secondary">
                            <Delete fontSize="small" />
                        </IconButton>
                    </Box>
                ))}
            </Box>
            <Box sx={{ mt: 2 }}>
                <TextField
                    label="New message"
                    variant="outlined"
                    fullWidth
                    sx={{ mb: 2 }}
                />
                <Button variant="contained" color="primary">
                    Send
                </Button>
            </Box>
        </Box>
    );
};

export default ChatDetail;
