import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    CircularProgress,
    Grid,
} from '@mui/material';
import { Edit, Delete, Chat, Check, Clear } from '@mui/icons-material';
import ChatDetail from './ChatDetail';
import api from '../utils/api';
import socket from '../utils/socket';

const ChatList = ({ chats, projectId }) => {
    const [projectChats, setProjectChats] = useState(chats);
    const [selectedChat, setSelectedChat] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [newChatName, setNewChatName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [editingChat, setEditingChat] = useState(null);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    // WebSocket para escuchar eventos relacionados con los chats
    useEffect(() => {
        // Listener para añadir un chat
        socket.on('newChat', (chat) => {
            if (chat.project_id === Number(projectId)) {
                setProjectChats([...projectChats, chat]);
            }
        });

        // Listener para actualizar un chat
        socket.on('updateChat', (chat) => {
            if (chat.project_id === Number(projectId)) {
                setProjectChats(
                    projectChats.map((c) => (c.id === chat.id ? chat : c))
                );
            }
        });

        // Listener para eliminar un chat
        socket.on('deleteChat', (chat) => {
            if (chat.project_id === Number(projectId)) {
                setProjectChats(projectChats.filter((c) => c.id !== chat.id));
            }
        });

        return () => {
            socket.off('newChat');
            socket.off('updateChat');
            socket.off('deleteChat');
        };
    }, [projectChats, projectId]);

    const handleSelectChat = async (chat) => {
        setSelectedChat(chat);
        const messages = await api.getChatMessages(chat.id);
        setChatMessages(messages);
    };

    const handleOpenModal = () => {
        setNewChatName('');
        setError('');
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleAddChat = async () => {
        if (!newChatName.trim()) {
            setError('El nombre del chat es obligatorio');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const newChat = await api.createChat({
                name: newChatName,
                projectId,
            });
            handleSelectChat(newChat);
            setOpenModal(false);
            setProjectChats([...projectChats, newChat]);
        } catch (err) {
            setError('Error al crear el chat');
        } finally {
            setLoading(false);
        }
    };

    const handleEditChat = async () => {
        if (!editingChat.name.trim()) {
            setError('El nombre del chat es obligatorio');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const updatedChat = await api.updateChat(editingChat.id, {
                name: editingChat.name,
            });
            setProjectChats(
                projectChats.map((chat) =>
                    chat.id === updatedChat.id ? updatedChat : chat
                )
            );
        } catch (err) {
            setError('Error al actualizar el chat');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteChat = async () => {
        setLoading(true);
        try {
            await api.deleteChat(editingChat.id);
            setProjectChats(
                projectChats.filter((chat) => chat.id !== editingChat.id)
            );
            setOpenDeleteModal(false);
        } catch (err) {
            setError('Error al eliminar el chat');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {selectedChat ? (
                <Box sx={{ flexGrow: 1 }}>
                    <ChatDetail
                        chat={selectedChat}
                        chatMessages={chatMessages}
                        onClose={() => {
                            setSelectedChat(null);
                            setChatMessages([]);
                        }}
                    />
                </Box>
            ) : (
                <Box sx={{ flexGrow: 1 }}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            mb: 3,
                            gap: 1,
                        }}
                    >
                        <Chat sx={{ fontSize: '34px' }} />
                        <Typography variant="h4">Chats</Typography>
                    </Box>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleOpenModal}
                        sx={{ mb: 2, width: '200px', alignSelf: 'center' }}
                    >
                        Add Chat
                    </Button>

                    <Grid
                        container
                        spacing={3}
                        sx={{ overflowY: 'auto', flexGrow: 1 }}
                    >
                        {projectChats?.map((chat) => (
                            <Grid item xs={12} sm={6} md={6} key={chat.id}>
                                <Card
                                    sx={{
                                        cursor:
                                            editingChat?.id === chat.id
                                                ? 'default'
                                                : 'pointer',
                                        backgroundColor: '#2d2d2d',
                                        border: '1px solid #3d3d3d',
                                        '&:hover': {
                                            backgroundColor:
                                                editingChat?.id === chat.id
                                                    ? '#2d2d2d'
                                                    : '#3d3d3d',
                                        },
                                        transition:
                                            'background-color 0.3s ease',
                                    }}
                                    onClick={() => {
                                        if (
                                            !editingChat ||
                                            editingChat.id !== chat.id
                                        ) {
                                            handleSelectChat(chat);
                                            setEditingChat(null);
                                        }
                                    }}
                                >
                                    <CardContent
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 45,
                                                height: 45,
                                                borderRadius: '12px',
                                                backgroundColor: '#3cf6bb',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: '#1c1f24',
                                                mr: 2,
                                            }}
                                        >
                                            <Typography variant="h6">
                                                {chat.name[0].toUpperCase()}
                                            </Typography>
                                        </Box>

                                        {editingChat?.id === chat.id ? (
                                            <TextField
                                                value={editingChat.name}
                                                onChange={(e) =>
                                                    setEditingChat({
                                                        ...editingChat,
                                                        name: e.target.value,
                                                    })
                                                }
                                                sx={{
                                                    flexGrow: 1,
                                                    color: '#e5e5e5',
                                                }}
                                                autoFocus
                                            />
                                        ) : (
                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    flexGrow: 1,
                                                    color: '#e5e5e5',
                                                }}
                                            >
                                                {chat.name}
                                            </Typography>
                                        )}

                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            {editingChat?.id === chat.id ? (
                                                <>
                                                    <IconButton
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleEditChat();
                                                            setEditingChat(
                                                                null
                                                            );
                                                        }}
                                                        sx={{
                                                            border: '2px solid',
                                                            borderColor:
                                                                'transparent',
                                                            '&:hover': {
                                                                borderColor:
                                                                    'secondary.main',
                                                            },
                                                        }}
                                                    >
                                                        <Check color="secondary" />
                                                    </IconButton>
                                                    <IconButton
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setEditingChat(
                                                                null
                                                            );
                                                        }}
                                                        sx={{
                                                            border: '2px solid',
                                                            borderColor:
                                                                'transparent',
                                                            '&:hover': {
                                                                borderColor:
                                                                    'error.main',
                                                            },
                                                        }}
                                                    >
                                                        <Clear color="error" />
                                                    </IconButton>
                                                </>
                                            ) : (
                                                <>
                                                    <IconButton
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setEditingChat(
                                                                chat
                                                            );
                                                        }}
                                                        sx={{
                                                            border: '2px solid',
                                                            borderColor:
                                                                'transparent',
                                                            '&:hover': {
                                                                borderColor:
                                                                    'secondary.main',
                                                            },
                                                        }}
                                                    >
                                                        <Edit color="secondary" />
                                                    </IconButton>
                                                    <IconButton
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setEditingChat(
                                                                chat
                                                            );
                                                            setOpenDeleteModal(
                                                                true
                                                            );
                                                        }}
                                                        sx={{
                                                            border: '2px solid',
                                                            borderColor:
                                                                'transparent',
                                                            '&:hover': {
                                                                borderColor:
                                                                    'error.main',
                                                            },
                                                        }}
                                                    >
                                                        <Delete color="error" />
                                                    </IconButton>
                                                </>
                                            )}
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Modal para añadir nuevo chat */}
                    <Dialog open={openModal} onClose={handleCloseModal}>
                        <DialogTitle sx={{ textAlign: 'center' }}>
                            Create new chat
                        </DialogTitle>
                        <DialogContent>
                            <TextField
                                label="Chat name"
                                sx={{ mt: 2 }}
                                fullWidth
                                value={newChatName}
                                onChange={(e) => setNewChatName(e.target.value)}
                                error={!!error}
                                helperText={error}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseModal} color="primary">
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleAddChat}
                                disabled={loading}
                                startIcon={
                                    loading && (
                                        <CircularProgress
                                            color="inherit"
                                            size={20}
                                        />
                                    )
                                }
                            >
                                {loading ? 'Adding...' : 'Confirm'}
                            </Button>
                        </DialogActions>
                    </Dialog>

                    {/* Modal para eliminar chat */}
                    <Dialog
                        open={openDeleteModal}
                        onClose={() => setOpenDeleteModal(false)}
                    >
                        <DialogTitle sx={{ textAlign: 'center' }}>
                            Delete chat
                        </DialogTitle>
                        <DialogContent>
                            <Typography
                                variant="body1"
                                sx={{ textAlign: 'center' }}
                            >
                                Are you sure you want to delete "
                                {editingChat?.name}"?
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                onClick={() => setOpenDeleteModal(false)}
                                color="primary"
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={handleDeleteChat}
                                disabled={loading}
                                startIcon={
                                    loading && (
                                        <CircularProgress
                                            color="inherit"
                                            size={20}
                                        />
                                    )
                                }
                            >
                                {loading ? 'Deleting...' : 'Delete'}
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Box>
            )}
        </Box>
    );
};

export default ChatList;
