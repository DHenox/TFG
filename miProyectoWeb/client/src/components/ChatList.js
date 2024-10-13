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
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
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
    const [openEditModal, setOpenEditModal] = useState(false);
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
            setOpenEditModal(false);
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
        <Box>
            {selectedChat ? (
                <Box sx={{ ml: 1 }}>
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
                <Box sx={{ ml: 20 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Chats
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleOpenModal}
                        sx={{ mb: 2 }}
                    >
                        Add Chat
                    </Button>
                    <Box>
                        {projectChats?.map((chat) => (
                            <Card
                                key={chat.id}
                                sx={{
                                    mb: 2,
                                    cursor: 'pointer',
                                    border: '1px solid #3d3d3d',
                                    backgroundColor: '#2d2d2d', // Fondo más oscuro para mayor contraste
                                    '&:hover': {
                                        backgroundColor: '#3d3d3d', // Cambio de color sin animación
                                    },
                                }}
                                onClick={() => handleSelectChat(chat)}
                            >
                                <CardContent
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                    }}
                                >
                                    {/* Avatar o iniciales */}
                                    <Box
                                        sx={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: '10px',
                                            backgroundColor: '#3cf6bb', // Color destacado para el avatar
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mr: 2,
                                            color: '#1c1f24',
                                        }}
                                    >
                                        <Typography variant="h6">
                                            {chat.name[0].toUpperCase()}
                                        </Typography>
                                    </Box>
                                    {/* Nombre del chat */}
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            flexGrow: 1,
                                            color: '#e5e5e5', // Color de texto mejorado
                                        }}
                                    >
                                        {chat.name}
                                    </Typography>
                                    {/* Iconos de acciones */}
                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                        <IconButton
                                            edge="end"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setEditingChat(chat);
                                                setOpenEditModal(true);
                                            }}
                                            sx={{
                                                border: '2px solid',
                                                transition: 'border-color 0.3s',
                                                '&:hover': {
                                                    borderColor:
                                                        'secondary.main',
                                                },
                                            }}
                                        >
                                            <Edit color="secondary" />
                                        </IconButton>
                                        <IconButton
                                            edge="end"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setEditingChat(chat);
                                                setOpenDeleteModal(true);
                                            }}
                                            sx={{
                                                border: '2px solid',
                                                transition: 'border-color 0.3s',
                                                '&:hover': {
                                                    borderColor: 'error.main',
                                                },
                                            }}
                                        >
                                            <Delete color="error" />
                                        </IconButton>
                                    </Box>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>

                    {/* Modal para añadir nuevo chat */}
                    <Dialog open={openModal} onClose={handleCloseModal}>
                        <DialogTitle>Añadir nuevo chat</DialogTitle>
                        <DialogContent>
                            <TextField
                                label="Nombre del chat"
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
                                Cancelar
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
                                {loading ? 'Añadiendo...' : 'Confirmar'}
                            </Button>
                        </DialogActions>
                    </Dialog>

                    {/* Modal para editar chat */}
                    <Dialog
                        open={openEditModal}
                        onClose={() => setOpenEditModal(false)}
                    >
                        <DialogTitle>Edit chat</DialogTitle>
                        <DialogContent>
                            <TextField
                                label="Chat name"
                                sx={{ mt: 2 }}
                                fullWidth
                                value={editingChat?.name || ''}
                                onChange={(e) =>
                                    setEditingChat({
                                        ...editingChat,
                                        name: e.target.value,
                                    })
                                }
                                error={!!error}
                                helperText={error}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button
                                onClick={() => setOpenEditModal(false)}
                                color="primary"
                            >
                                Cancelar
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleEditChat}
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
                                {loading ? 'Saving...' : 'Confirm'}
                            </Button>
                        </DialogActions>
                    </Dialog>

                    {/* Modal para eliminar chat */}
                    <Dialog
                        open={openDeleteModal}
                        onClose={() => setOpenDeleteModal(false)}
                    >
                        <DialogTitle>Delete chat</DialogTitle>
                        <DialogContent>
                            <Typography variant="body1">
                                Are you sure you want to delete "
                                {editingChat?.name}"?
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                onClick={() => setOpenDeleteModal(false)}
                                color="primary"
                            >
                                Cancelar
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
