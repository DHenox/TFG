import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../utils/api';
import TaskList from './TaskList';
import ChatList from './ChatList';

const ProjectDetail = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [chats, setChats] = useState([]);

    useEffect(() => {
        const fetchProject = async () => {
            const projectData = await api.getProject(id);
            setProject(projectData);
            setTasks(await api.getProjectTasks(id));
            setChats(await api.getProjectChats(id));
        };
        fetchProject();
    }, [id]);

    if (!project) return <div>Loading...</div>;

    return (
        <div>
            <h2>{project.name}</h2>
            <p>{project.description}</p>
            <TaskList tasks={tasks} />
            <ChatList chats={chats} />
        </div>
    );
};

export default ProjectDetail;
