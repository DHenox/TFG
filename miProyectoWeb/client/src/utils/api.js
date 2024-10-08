// src/utils/api.js
import axios from 'axios';

const api = {
    // ENDPOINT USERS
    // Obtener un usuario específico
    getUser: async (userId) => {
        const response = await axios.get(`/api/users/${userId}`);
        return response.data;
    },
    // Obtener todos los usuarios
    getAllUsers: async () => {
        const response = await axios.get('/api/users');
        return response.data;
    },
    // Obtener proyectos en los que está involucrado un usuario
    getUserProjects: async (userId) => {
        const response = await axios.get(`/api/users/${userId}/projects`);
        return response.data;
    },
    // Obtener equipos de los que forma parte un usuario
    getUserTeams: async (userId) => {
        const response = await axios.get(`/api/users/${userId}/teams`);
        return response.data;
    },
    // Crear un nuevo usuario
    createUser: async (userData) => {
        const response = await axios.post('/api/users', userData);
        return response.data;
    },
    // Actualizar un usuario existente
    updateUser: async (userId, userData) => {
        const response = await axios.put(`/api/users/${userId}`, userData);
        return response.data;
    },

    // ENDPOINT PROJECTS
    // Obtener un proyecto específico
    getProject: async (projectId) => {
        const response = await axios.get(`/api/projects/${projectId}`);
        return response.data;
    },
    // Obtener equipo de un proyecto
    getProjectUsers: async (projectId) => {
        const response = await axios.get(`/api/projects/${projectId}/users`);
        return response.data;
    },
    // Obtener tareas de un proyecto
    getProjectTasks: async (projectId) => {
        const response = await axios.get(`/api/projects/${projectId}/tasks`);
        return response.data;
    },
    // Obtener chats de un proyecto
    getProjectChats: async (projectId) => {
        const response = await axios.get(`/api/projects/${projectId}/chats`);
        return response.data;
    },
    // Crear un nuevo proyecto
    createProject: async (projectData) => {
        const response = await axios.post('/api/projects', projectData);
        return response.data;
    },
    // Actualizar un proyecto existente
    updateProject: async (projectId, projectData) => {
        const response = await axios.put(
            `/api/projects/${projectId}`,
            projectData
        );
        return response.data;
    },
    // Eliminar un proyecto
    deleteProject: async (projectId) => {
        const response = await axios.delete(`/api/projects/${projectId}`);
        return response.data;
    },

    // ENDPOINT TEAMS
    // Obtener un equipo específico
    getTeam: async (teamId) => {
        const response = await axios.get(`/api/teams/${teamId}`);
        return response.data;
    },
    // Obtener usuarios de un equipo
    getTeamUsers: async (teamId) => {
        const response = await axios.get(`/api/teams/${teamId}/users`);
        return response.data;
    },
    // Crear un nuevo equipo
    createTeam: async (teamData) => {
        const response = await axios.post('/api/teams', teamData);
        return response.data;
    },
    // Actualizar un equipo existente
    updateTeam: async (teamId, teamData) => {
        const response = await axios.put(`/api/teams/${teamId}`, teamData);
        return response.data;
    },
    // Eliminar un equipo
    deleteTeam: async (teamId) => {
        const response = await axios.delete(`/api/teams/${teamId}`);
        return response.data;
    },

    // ENDPOINT TASKS
    // Obtener una tarea específica
    getTask: async (taskId) => {
        const response = await axios.get(`/api/tasks/${taskId}`);
        return response.data;
    },
    // Obtener usuarios asignados a una tarea
    getTaskAssignedUsers: async (taskId) => {
        const response = await axios.get(`/api/tasks/${taskId}/users`);
        return response.data;
    },
    // Crear una nueva tarea
    createTask: async (taskData) => {
        const response = await axios.post('/api/tasks', taskData);
        return response.data;
    },
    // Actualizar una tarea existente
    updateTask: async (taskId, taskData) => {
        const response = await axios.put(`/api/tasks/${taskId}`, taskData);
        return response.data;
    },
    // Eliminar una tarea
    deleteTask: async (taskId) => {
        const response = await axios.delete(`/api/tasks/${taskId}`);
        return response.data;
    },

    // ENDPOINT SCANS
    // Obtener un escaneo específico
    getScan: async (taskId) => {
        const response = await axios.get(`/api/scans/${taskId}`);
        return response.data;
    },
    // Crear un nuevo escaneo
    createScan: async (taskId, scanData) => {
        const response = await axios.post(
            `/api/scans/tasks/${taskId}`,
            scanData
        );
        return response.data;
    },
    // Eliminar un escaneo
    deleteScan: async (scanId) => {
        const response = await axios.delete(`/api/scans/${scanId}`);
        return response.data;
    },

    // ENDPOINT CHATS
    // Obtener un chat específico
    getChat: async (chatId) => {
        const response = await axios.get(`/api/chats/${chatId}`);
        return response.data;
    },
    // Obtener mensajes de un chat
    getChatMessages: async (chatId) => {
        const response = await axios.get(`/api/chats/${chatId}/messages`);
        return response.data;
    },
    // Crear un nuevo chat
    createChat: async (chatData) => {
        const response = await axios.post('/api/chats', chatData);
        return response.data;
    },
    // Actualizar un chat existente
    updateChat: async (chatId, chatData) => {
        const response = await axios.put(`/api/chats/${chatId}`, chatData);
        return response.data;
    },
    // Eliminar un chat
    deleteChat: async (chatId) => {
        const response = await axios.delete(`/api/chats/${chatId}`);
        return response.data;
    },

    // ENDPOINT MESSAGES
    // Crear un nuevo mensaje
    createMessage: async (messageData) => {
        const response = await axios.post('/api/messages', messageData);
        return response.data;
    },
    // Actualizar un mensaje existente
    updateMessage: async (messageId, messageData) => {
        const response = await axios.put(
            `/api/messages/${messageId}`,
            messageData
        );
        return response.data;
    },
    // Eliminar un mensaje
    deleteMessage: async (messageId) => {
        const response = await axios.delete(`/api/messages/${messageId}`);
        return response.data;
    },
};

export default api;
