import React from 'react';
import { Link } from 'react-router-dom';

const TaskList = ({ tasks }) => {
    return (
        <div>
            <h3>Tasks</h3>
            <ul>
                {tasks.map((task) => (
                    <li key={task.id}>
                        <Link to={`/tasks/${task.id}`}>{task.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TaskList;
