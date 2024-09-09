import React, { useState } from 'react';
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
                <Box>
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
                <>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Chats
                    </Typography>
                    <Box>
                        {projectChats?.map((chat) => (
                            <Card
                                key={chat.id}
                                sx={{
                                    mb: 2,
                                    cursor: 'pointer',
                                    borderRadius: 3, // Borde redondeado
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Sombra suave
                                    transition: 'transform 0.2s',
                                    '&:hover': {
                                        transform: 'scale(1.02)', // Efecto hover con animación
                                        boxShadow:
                                            '0 6px 12px rgba(0, 0, 0, 0.2)',
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
                                            backgroundColor: 'grey',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow:
                                                '0 2px 4px rgba(0, 0, 0, 0.2)',
                                            mr: 2,
                                        }}
                                    >
                                        <Typography variant="h6">
                                            {chat.name[0].toUpperCase()}
                                        </Typography>
                                    </Box>
                                    {/* Nombre del chat */}
                                    <Typography
                                        variant="body1"
                                        sx={{ flexGrow: 1 }}
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
                                                border: '1px solid',
                                                transition: 'border-color 0.3s',
                                                '&:hover': {
                                                    borderColor: 'primary.main',
                                                },
                                            }}
                                        >
                                            <Edit color="primary" />
                                        </IconButton>
                                        <IconButton
                                            edge="end"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setEditingChat(chat);
                                                setOpenDeleteModal(true);
                                            }}
                                            sx={{
                                                border: '1px solid',
                                                transition: 'border-color 0.3s',
                                                '&:hover': {
                                                    borderColor:
                                                        'secondary.main',
                                                },
                                            }}
                                        >
                                            <Delete color="secondary" />
                                        </IconButton>
                                    </Box>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleOpenModal}
                    >
                        Add Chat
                    </Button>

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
                </>
            )}
        </Box>
    );
};

export default ChatList;
