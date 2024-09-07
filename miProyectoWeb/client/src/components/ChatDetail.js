import React, { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    IconButton,
    Paper,
    Avatar,
    Chip,
    Divider,
    Menu,
    MenuItem,
    CircularProgress,
    Tooltip,
} from '@mui/material';
import { ArrowBack, MoreVert } from '@mui/icons-material';
import { format, isToday, isYesterday } from 'date-fns'; // Importamos isToday e isYesterday para verificar la fecha
import api from '../utils/api';
import { useAuth0 } from '@auth0/auth0-react';

const ChatDetail = ({ chat, messages, onClose }) => {
    const { user } = useAuth0();
    const [editingMessageId, setEditingMessageId] = useState(null);
    const [editMessageContent, setEditMessageContent] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSendMessage = async () => {
        const content = document.getElementById('new-message').value;
        if (content.trim() === '') return;
        try {
            setLoading(true);
            await api.createMessage({
                chatId: chat.id,
                content,
                userId: user.sub,
            });
            // Actualiza los mensajes o el estado aquí
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditMessage = (messageId, content) => {
        setEditingMessageId(messageId);
        setEditMessageContent(content);
    };

    const handleUpdateMessage = async () => {
        try {
            setLoading(true);
            await api.updateMessage(editingMessageId, {
                content: editMessageContent,
            });
            // Actualiza los mensajes o el estado aquí
            setEditingMessageId(null);
        } catch (error) {
            console.error('Error updating message:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteMessage = async (messageId) => {
        try {
            setLoading(true);
            await api.deleteMessage(messageId);
            // Actualiza los mensajes o el estado aquí
        } catch (error) {
            console.error('Error deleting message:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClickMore = (event, message) => {
        setAnchorEl(event.currentTarget);
        setSelectedMessage(message);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
        setSelectedMessage(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-menu' : undefined;

    // Función para obtener el texto del divisor según la fecha
    const getDateDivider = (date) => {
        const messageDate = new Date(date);
        if (isToday(messageDate)) return 'Hoy';
        if (isYesterday(messageDate)) return 'Ayer';
        return format(messageDate, 'PP');
    };

    // Función que compara las fechas para ver si cambia el día entre mensajes
    const shouldShowDateDivider = (currentMessageDate, previousMessageDate) => {
        const currentDate = new Date(currentMessageDate);
        const previousDate = new Date(previousMessageDate);

        return (
            currentDate.getDate() !== previousDate.getDate() ||
            currentDate.getMonth() !== previousDate.getMonth() ||
            currentDate.getFullYear() !== previousDate.getFullYear()
        );
    };

    return (
        <Box>
            {/* Header con botón de retroceso y nombre del chat */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <IconButton
                    onClick={onClose}
                    sx={{ mr: 2, color: 'primary.main' }}
                >
                    <ArrowBack />
                </IconButton>
                <Typography variant="h6">{chat?.name}</Typography>
            </Box>

            {/* Lista de mensajes */}
            <Box sx={{ maxHeight: 400, overflowY: 'auto', mb: 2, p: 2 }}>
                {messages?.map((msg, index) => {
                    const showDateDivider =
                        index === 0 ||
                        shouldShowDateDivider(
                            msg._timestamp,
                            messages[index - 1]._timestamp
                        );

                    return (
                        <React.Fragment key={msg.id}>
                            {/* Divisor de fecha */}
                            {showDateDivider && (
                                <Box
                                    sx={{
                                        textAlign: 'center',
                                        my: 2,
                                        color: 'secondary.main',
                                    }}
                                >
                                    <Divider
                                        sx={{
                                            '&::before, &::after': {
                                                borderColor: 'secondary.main',
                                            },
                                        }}
                                    >
                                        <Chip
                                            label={getDateDivider(
                                                msg._timestamp
                                            )}
                                            size="small"
                                            sx={{
                                                color: 'secondary.main',
                                                backgroundColor:
                                                    'background.paper',
                                            }}
                                        />
                                    </Divider>
                                </Box>
                            )}

                            {/* Mensaje */}
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent:
                                        msg.user.id === user.sub
                                            ? 'flex-end'
                                            : 'flex-start',
                                    mb: 2,
                                }}
                            >
                                {/* Avatar y contenido del mensaje */}
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'top',
                                        maxWidth: '70%',
                                    }}
                                >
                                    {msg.user.id !== user.sub && (
                                        <Tooltip
                                            title={msg.user.name}
                                            arrow
                                            placement="top"
                                        >
                                            <Avatar
                                                sx={{ mr: 1 }}
                                                src={msg.user.picture}
                                            />
                                        </Tooltip>
                                    )}
                                    <Paper
                                        sx={{
                                            px: 2,
                                            pt: 1,
                                            bgcolor:
                                                msg.user.id === user.sub
                                                    ? 'primary.main'
                                                    : 'background.paper',
                                            color:
                                                msg.user.id === user.sub
                                                    ? 'background.paper'
                                                    : 'primary.main',
                                            borderRadius: '10px',
                                            position: 'relative',
                                            maxWidth: '100%',
                                        }}
                                    >
                                        {/* Nombre del usuario y fecha */}
                                        <Box sx={{ mb: 1 }}>
                                            {msg.user.id !== user.sub && (
                                                <Typography
                                                    variant="subtitle2"
                                                    sx={{
                                                        fontWeight: 'bold',
                                                        color: 'secondary.main',
                                                    }}
                                                >
                                                    {msg.user.name}
                                                </Typography>
                                            )}
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'start',
                                                }}
                                            >
                                                {/* Contenido del mensaje */}
                                                {editingMessageId === msg.id ? (
                                                    <Box>
                                                        <TextField
                                                            value={
                                                                editMessageContent
                                                            }
                                                            onChange={(e) =>
                                                                setEditMessageContent(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            fullWidth
                                                            variant="outlined"
                                                            multiline
                                                        />
                                                        <Button
                                                            variant="contained"
                                                            onClick={
                                                                handleUpdateMessage
                                                            }
                                                            sx={{ mt: 1 }}
                                                        >
                                                            Save
                                                        </Button>
                                                    </Box>
                                                ) : (
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            wordBreak:
                                                                'break-word',
                                                        }}
                                                    >
                                                        {msg.content}
                                                    </Typography>
                                                )}
                                                {/* Botón de menú para editar/eliminar */}
                                                {msg.user.id === user.sub && (
                                                    <IconButton
                                                        size="small"
                                                        sx={{
                                                            p: 0,
                                                        }}
                                                        onClick={(e) =>
                                                            handleClickMore(
                                                                e,
                                                                msg
                                                            )
                                                        }
                                                    >
                                                        <MoreVert fontSize="small" />
                                                    </IconButton>
                                                )}
                                            </Box>
                                            <Typography
                                                variant="caption"
                                                sx={{ color: 'gray' }}
                                            >
                                                {format(
                                                    new Date(msg._timestamp),
                                                    'H:m'
                                                )}
                                            </Typography>
                                        </Box>
                                    </Paper>
                                </Box>
                            </Box>
                        </React.Fragment>
                    );
                })}
            </Box>

            {/* Caja de texto para nuevo mensaje */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                    id="new-message"
                    label="New message"
                    variant="outlined"
                    fullWidth
                    sx={{
                        mr: 2,
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: 'gray', // Cambiar el color del borde a gris
                            },
                            '&:hover fieldset': {
                                borderColor: 'gray', // Mantener el borde gris al pasar el mouse
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: 'gray', // Mantener el borde gris al enfocar
                            },
                        },
                    }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSendMessage}
                    disabled={loading}
                    startIcon={
                        loading && (
                            <CircularProgress color="inherit" size={20} />
                        )
                    }
                >
                    {loading ? 'Sending...' : 'Send'}
                </Button>
            </Box>

            {/* Menú de opciones (editar/eliminar) */}
            <Menu
                id={id}
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
                disableScrollLock={true}
            >
                <MenuItem
                    onClick={() => {
                        handleCloseMenu();
                        handleEditMessage(
                            selectedMessage.id,
                            selectedMessage.content
                        );
                    }}
                >
                    Edit
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        handleCloseMenu();
                        handleDeleteMessage(selectedMessage.id);
                    }}
                >
                    Delete
                </MenuItem>
            </Menu>
        </Box>
    );
};

export default ChatDetail;
