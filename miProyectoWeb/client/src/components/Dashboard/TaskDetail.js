import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../utils/api';

const TaskDetail = () => {
    const { id } = useParams();
    const [task, setTask] = useState(null);

    useEffect(() => {
        const fetchTask = async () => {
            const taskData = await api.getTask(id);
            setTask(taskData);
        };
        fetchTask();
    }, [id]);

    if (!task) return <div>Loading...</div>;

    return (
        <div>
            <h2>{task.name}</h2>
            <p>{task.description}</p>
        </div>
    );
};

export default TaskDetail;
