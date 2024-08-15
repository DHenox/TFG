import axios from 'axios';

const api = {
    // ENDPOINT USERS
    // Obtener un usuario específico
    getUser: async (userId) => {
        const response = await axios.get(`/users/${userId}`);
        return response.data;
    },
    // Obtener todos los usuarios
    getAllUsers: async () => {
        const response = await axios.get('/users');
        return response.data;
    },
    // Obtener proyectos en los que está involucrado un usuario
    getUserProjects: async (userId) => {
        const response = await axios.get(`/users/${userId}/projects`);
        return response.data;
    },
    // Obtener proyectos creados por un usuario
    getUserCreatedProjects: async (userId) => {
        const response = await axios.get(`/users/${userId}/created-projects`);
        return response.data;
    },
    // Obtener equipos de los que forma parte un usuario
    getUserTeams: async (userId) => {
        const response = await axios.get(`/users/${userId}/teams`);
        return response.data;
    },
    // Obtener equipos creados por un usuario
    getUserCreatedTeams: async (userId) => {
        const response = await axios.get(`/users/${userId}/created-teams`);
        return response.data;
    },
    // Crear un nuevo usuario
    createUser: async (userData) => {
        const response = await axios.post('/users', userData);
        return response.data;
    },
    // Actualizar un usuario existente
    updateUser: async (userId, userData) => {
        const response = await axios.put(`/users/${userId}`, userData);
        return response.data;
    },

    // ENDPOINT PROJECTS
    // Obtener un proyecto específico
    getProject: async (projectId) => {
        const response = await axios.get(`/projects/${projectId}`);
        return response.data;
    },
    // Obtener tareas de un proyecto
    getProjectTasks: async (projectId) => {
        const response = await axios.get(`/projects/${projectId}/tasks`);
        return response.data;
    },
    // Obtener chats de un proyecto
    getProjectChats: async (projectId) => {
        const response = await axios.get(`/projects/${projectId}/chats`);
        return response.data;
    },
    // Crear scan de un proyecto
    createProjectScan: async (projectId, scanData) => {
        const response = await axios.post(
            `/projects/${projectId}/scans`,
            scanData
        );
        return response.data;
    },
    // Crear un nuevo proyecto
    createProject: async (projectData) => {
        const response = await axios.post('/projects', projectData);
        return response.data;
    },
    // Actualizar un proyecto existente
    updateProject: async (projectId, projectData) => {
        const response = await axios.put(`/projects/${projectId}`, projectData);
        return response.data;
    },
    // Eliminar un proyecto
    deleteProject: async (projectId) => {
        const response = await axios.delete(`/projects/${projectId}`);
        return response.data;
    },

    // ENDPOINT TEAMS
    // Crear un nuevo equipo
    createTeam: async (teamData) => {
        const response = await axios.post('/teams', teamData);
        return response.data;
    },
    // Actualizar un equipo existente
    updateTeam: async (teamId, teamData) => {
        const response = await axios.put(`/teams/${teamId}`, teamData);
        return response.data;
    },
    // Eliminar un equipo
    deleteTeam: async (teamId) => {
        const response = await axios.delete(`/teams/${teamId}`);
        return response.data;
    },

    // ENDPOINT TASKS
    // Obtener una tarea específica
    getTask: async (taskId) => {
        const response = await axios.get(`/tasks/${taskId}`);
        return response.data;
    },
    // Crear una nueva tarea
    createTask: async (taskData) => {
        const response = await axios.post('/tasks', taskData);
        return response.data;
    },
    // Actualizar una tarea existente
    updateTask: async (taskId, taskData) => {
        const response = await axios.put(`/tasks/${taskId}`, taskData);
        return response.data;
    },
    // Eliminar una tarea
    deleteTask: async (taskId) => {
        const response = await axios.delete(`/tasks/${taskId}`);
        return response.data;
    },

    // ENDPOINT CHATS
    // Obtener un chat específico
    getChat: async (chatId) => {
        const response = await axios.get(`/chats/${chatId}`);
        return response.data;
    },
    // Obtener mensajes de un chat
    getChatMessages: async (chatId) => {
        const response = await axios.get(`/chats/${chatId}/messages`);
        return response.data;
    },
    // Crear un nuevo chat
    createChat: async (chatData) => {
        const response = await axios.post('/chats', chatData);
        return response.data;
    },
    // Actualizar un chat existente
    updateChat: async (chatId, chatData) => {
        const response = await axios.put(`/chats/${chatId}`, chatData);
        return response.data;
    },
    // Eliminar un chat
    deleteChat: async (chatId) => {
        const response = await axios.delete(`/chats/${chatId}`);
        return response.data;
    },

    // ENDPOINT MESSAGES
    // Crear un nuevo mensaje
    createMessage: async (messageData) => {
        const response = await axios.post('/messages', messageData);
        return response.data;
    },
    // Actualizar un mensaje existente
    updateMessage: async (messageId, messageData) => {
        const response = await axios.put(`/messages/${messageId}`, messageData);
        return response.data;
    },
    // Eliminar un mensaje
    deleteMessage: async (messageId) => {
        const response = await axios.delete(`/messages/${messageId}`);
        return response.data;
    },
};

export default api;
