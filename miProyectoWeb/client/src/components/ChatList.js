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
        console.log(messages);
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
                        messages={chatMessages}
                        onClose={() => setSelectedChat(null)}
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
                                    '&:hover': {
                                        boxShadow: 15,
                                    },
                                }}
                                onClick={() => handleSelectChat(chat)}
                            >
                                <CardContent>
                                    <Typography variant="body1">
                                        {chat.name}
                                    </Typography>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'flex-end',
                                            gap: 2,
                                        }}
                                    >
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
                        <DialogTitle>Editar chat</DialogTitle>
                        <DialogContent>
                            <TextField
                                label="Nombre del chat"
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
                                {loading ? 'Guardando...' : 'Confirmar'}
                            </Button>
                        </DialogActions>
                    </Dialog>

                    {/* Modal para eliminar chat */}
                    <Dialog
                        open={openDeleteModal}
                        onClose={() => setOpenDeleteModal(false)}
                    >
                        <DialogTitle>Eliminar chat</DialogTitle>
                        <DialogContent>
                            <Typography variant="body1">
                                ¿Estás seguro de que deseas eliminar el chat "
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
                                {loading ? 'Eliminando...' : 'Eliminar'}
                            </Button>
                        </DialogActions>
                    </Dialog>
                </>
            )}
        </Box>
    );
};

export default ChatList;
