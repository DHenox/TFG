import axios from 'axios';

const api = {
    getUserProjects: async (userId) => {
        const response = await axios.get(`/users/${userId}/projects`);
        return response.data;
    },
    getProject: async (projectId) => {
        const response = await axios.get(`/projects/${projectId}`);
        return response.data;
    },
    getProjectTasks: async (projectId) => {
        const response = await axios.get(`/projects/${projectId}/tasks`);
        return response.data;
    },
    getProjectChats: async (projectId) => {
        const response = await axios.get(`/projects/${projectId}/chats`);
        return response.data;
    },
    getTask: async (taskId) => {
        const response = await axios.get(`/tasks/${taskId}`);
        return response.data;
    },
    getChat: async (chatId) => {
        const response = await axios.get(`/chats/${chatId}`);
        return response.data;
    },
};

export default api;
