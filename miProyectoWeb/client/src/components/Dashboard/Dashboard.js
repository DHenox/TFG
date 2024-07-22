import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import api from '../../utils/api';
import ProjectList from './ProjectList';

const Dashboard = () => {
    const { user } = useAuth0();
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const fetchProjects = async () => {
            const userProjects = await api.getUserProjects(user.sub);
            setProjects(userProjects);
        };
        fetchProjects();
    }, [user]);

    return (
        <div>
            <h1>Dashboard</h1>
            <ProjectList projects={projects} />
        </div>
    );
};

export default Dashboard;
