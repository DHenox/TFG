require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3001;

// Configuración del cliente de PostgreSQL
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    options: process.env.DB_OPTIONS,
});

// Middleware para parsear el cuerpo de las solicitudes
app.use(bodyParser.json());

// Obtener pagina principal
app.get('/', (req, res) => {
    res.send('Hola desde el backend!');
});

// Obtener todos los usuarios
app.get('/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Users');
        res.json(result.rows);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Obtener usuario por ID
app.get('/users/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const result = await pool.query('SELECT * FROM Users WHERE id = $1', [
            userId,
        ]);
        if (result.rows.length === 0) {
            res.status(404).send('Usuario no encontrado');
        } else {
            res.json(result.rows[0]);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Crear nuevo usuario
app.post('/users', async (req, res) => {
    const { auth0_id, name, email, role } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO Users (auth0_id, name, email, role) VALUES ($1, $2, $3, $4) RETURNING *',
            [auth0_id, name, email, role]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Actualizar usuario por ID
app.put('/users/:id', async (req, res) => {
    const userId = req.params.id;
    const { auth0_id, name, email, role } = req.body;
    try {
        const result = await pool.query(
            'UPDATE Users SET auth0_id = $1, name = $2, email = $3, role = $4 WHERE id = $5 RETURNING *',
            [auth0_id, name, email, role, userId]
        );
        if (result.rows.length === 0) {
            res.status(404).send('Usuario no encontrado');
        } else {
            res.json(result.rows[0]);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Eliminar usuario por ID
app.delete('/users/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const result = await pool.query(
            'DELETE FROM Users WHERE id = $1 RETURNING *',
            [userId]
        );
        if (result.rows.length === 0) {
            res.status(404).send('Usuario no encontrado');
        } else {
            res.json(result.rows[0]);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// CRUD para la tabla Teams

// Obtener todos los equipos
app.get('/teams', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Teams');
        res.json(result.rows);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Obtener equipo por ID
app.get('/teams/:id', async (req, res) => {
    const teamId = req.params.id;
    try {
        const result = await pool.query('SELECT * FROM Teams WHERE id = $1', [
            teamId,
        ]);
        if (result.rows.length === 0) {
            res.status(404).send('Equipo no encontrado');
        } else {
            res.json(result.rows[0]);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Crear nuevo equipo
app.post('/teams', async (req, res) => {
    const { name, description, user_id } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO Teams (name, description, user_id) VALUES ($1, $2, $3) RETURNING *',
            [name, description, user_id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Actualizar equipo por ID
app.put('/teams/:id', async (req, res) => {
    const teamId = req.params.id;
    const { name, description, user_id } = req.body;
    try {
        const result = await pool.query(
            'UPDATE Teams SET name = $1, description = $2, user_id = $3 WHERE id = $4 RETURNING *',
            [name, description, user_id, teamId]
        );
        if (result.rows.length === 0) {
            res.status(404).send('Equipo no encontrado');
        } else {
            res.json(result.rows[0]);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Eliminar equipo por ID
app.delete('/teams/:id', async (req, res) => {
    const teamId = req.params.id;
    try {
        const result = await pool.query(
            'DELETE FROM Teams WHERE id = $1 RETURNING *',
            [teamId]
        );
        if (result.rows.length === 0) {
            res.status(404).send('Equipo no encontrado');
        } else {
            res.json(result.rows[0]);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// CRUD para la tabla Projects

// Obtener todos los proyectos
app.get('/projects', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Projects');
        res.json(result.rows);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Obtener proyecto por ID
app.get('/projects/:id', async (req, res) => {
    const projectId = req.params.id;
    try {
        const result = await pool.query(
            'SELECT * FROM Projects WHERE id = $1',
            [projectId]
        );
        if (result.rows.length === 0) {
            res.status(404).send('Proyecto no encontrado');
        } else {
            res.json(result.rows[0]);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Crear nuevo proyecto
app.post('/projects', async (req, res) => {
    const { name, description, created_at, user_id, team_id } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO Projects (name, description, created_at, user_id, team_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, description, created_at, user_id, team_id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Actualizar proyecto por ID
app.put('/projects/:id', async (req, res) => {
    const projectId = req.params.id;
    const { name, description, created_at, user_id, team_id } = req.body;
    try {
        const result = await pool.query(
            'UPDATE Projects SET name = $1, description = $2, created_at = $3, user_id = $4, team_id = $5 WHERE id = $6 RETURNING *',
            [name, description, created_at, user_id, team_id, projectId]
        );
        if (result.rows.length === 0) {
            res.status(404).send('Proyecto no encontrado');
        } else {
            res.json(result.rows[0]);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Eliminar proyecto por ID
app.delete('/projects/:id', async (req, res) => {
    const projectId = req.params.id;
    try {
        const result = await pool.query(
            'DELETE FROM Projects WHERE id = $1 RETURNING *',
            [projectId]
        );
        if (result.rows.length === 0) {
            res.status(404).send('Proyecto no encontrado');
        } else {
            res.json(result.rows[0]);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// CRUD para la tabla Tasks

// Obtener todas las tareas
app.get('/tasks', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Tasks');
        res.json(result.rows);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Obtener tarea por ID
app.get('/tasks/:id', async (req, res) => {
    const taskId = req.params.id;
    try {
        const result = await pool.query('SELECT * FROM Tasks WHERE id = $1', [
            taskId,
        ]);
        if (result.rows.length === 0) {
            res.status(404).send('Tarea no encontrada');
        } else {
            res.json(result.rows[0]);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Crear nueva tarea
app.post('/tasks', async (req, res) => {
    const {
        type,
        name,
        description,
        status,
        start_date,
        end_date,
        created_at,
        user_id,
        project_id,
    } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO Tasks (type, name, description, status, start_date, end_date, created_at, user_id, project_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
            [
                type,
                name,
                description,
                status,
                start_date,
                end_date,
                created_at,
                user_id,
                project_id,
            ]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Actualizar tarea por ID
app.put('/tasks/:id', async (req, res) => {
    const taskId = req.params.id;
    const {
        type,
        name,
        description,
        status,
        start_date,
        end_date,
        created_at,
        user_id,
        project_id,
    } = req.body;
    try {
        const result = await pool.query(
            'UPDATE Tasks SET type = $1, name = $2, description = $3, status = $4, start_date = $5, end_date = $6, created_at = $7, user_id = $8, project_id = $9 WHERE id = $10 RETURNING *',
            [
                type,
                name,
                description,
                status,
                start_date,
                end_date,
                created_at,
                user_id,
                project_id,
                taskId,
            ]
        );
        if (result.rows.length === 0) {
            res.status(404).send('Tarea no encontrada');
        } else {
            res.json(result.rows[0]);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Eliminar tarea por ID
app.delete('/tasks/:id', async (req, res) => {
    const taskId = req.params.id;
    try {
        const result = await pool.query(
            'DELETE FROM Tasks WHERE id = $1 RETURNING *',
            [taskId]
        );
        if (result.rows.length === 0) {
            res.status(404).send('Tarea no encontrada');
        } else {
            res.json(result.rows[0]);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// CRUD para la tabla Chats

// Obtener todos los chats
app.get('/chats', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Chats');
        res.json(result.rows);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Obtener chat por ID
app.get('/chats/:id', async (req, res) => {
    const chatId = req.params.id;
    try {
        const result = await pool.query('SELECT * FROM Chats WHERE id = $1', [
            chatId,
        ]);
        if (result.rows.length === 0) {
            res.status(404).send('Chat no encontrado');
        } else {
            res.json(result.rows[0]);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Crear nuevo chat
app.post('/chats', async (req, res) => {
    const { name, created_at, project_id } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO Chats (name, created_at, project_id) VALUES ($1, $2, $3) RETURNING *',
            [name, created_at, project_id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Actualizar chat por ID
app.put('/chats/:id', async (req, res) => {
    const chatId = req.params.id;
    const { name, created_at, project_id } = req.body;
    try {
        const result = await pool.query(
            'UPDATE Chats SET name = $1, created_at = $2, project_id = $3 WHERE id = $4 RETURNING *',
            [name, created_at, project_id, chatId]
        );
        if (result.rows.length === 0) {
            res.status(404).send('Chat no encontrado');
        } else {
            res.json(result.rows[0]);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Eliminar chat por ID
app.delete('/chats/:id', async (req, res) => {
    const chatId = req.params.id;
    try {
        const result = await pool.query(
            'DELETE FROM Chats WHERE id = $1 RETURNING *',
            [chatId]
        );
        if (result.rows.length === 0) {
            res.status(404).send('Chat no encontrado');
        } else {
            res.json(result.rows[0]);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// CRUD para la tabla Messages

// Obtener todos los mensajes
app.get('/messages', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Messages');
        res.json(result.rows);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Obtener mensaje por ID
app.get('/messages/:id', async (req, res) => {
    const messageId = req.params.id;
    try {
        const result = await pool.query(
            'SELECT * FROM Messages WHERE id = $1',
            [messageId]
        );
        if (result.rows.length === 0) {
            res.status(404).send('Mensaje no encontrado');
        } else {
            res.json(result.rows[0]);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Crear nuevo mensaje
app.post('/messages', async (req, res) => {
    const { content, _timestamp, user_id, chat_id } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO Messages (content, _timestamp, user_id, chat_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [content, _timestamp, user_id, chat_id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Actualizar mensaje por ID
app.put('/messages/:id', async (req, res) => {
    const messageId = req.params.id;
    const { content, _timestamp, user_id, chat_id } = req.body;
    try {
        const result = await pool.query(
            'UPDATE Messages SET content = $1, _timestamp = $2, user_id = $3, chat_id = $4 WHERE id = $5 RETURNING *',
            [content, _timestamp, user_id, chat_id, messageId]
        );
        if (result.rows.length === 0) {
            res.status(404).send('Mensaje no encontrado');
        } else {
            res.json(result.rows[0]);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Eliminar mensaje por ID
app.delete('/messages/:id', async (req, res) => {
    const messageId = req.params.id;
    try {
        const result = await pool.query(
            'DELETE FROM Messages WHERE id = $1 RETURNING *',
            [messageId]
        );
        if (result.rows.length === 0) {
            res.status(404).send('Mensaje no encontrado');
        } else {
            res.json(result.rows[0]);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Crear (POST)
app.post('/[tabla]', async (req, res) => {
    // Implementa la lógica para insertar un nuevo registro en la tabla
    // Utiliza req.body para obtener los datos a insertar
});
// Leer todos (GET)
app.get('/[tabla]', async (req, res) => {
    // Implementa la lógica para obtener todos los registros de la tabla
});
// Leer por ID (GET)
app.get('/[tabla]/:id', async (req, res) => {
    // Implementa la lógica para obtener un registro específico por ID de la tabla
    // Utiliza req.params.id para obtener el ID
});
// Actualizar por ID (PUT)
app.put('/[tabla]/:id', async (req, res) => {
    // Implementa la lógica para actualizar un registro específico por ID en la tabla
    // Utiliza req.params.id para obtener el ID y req.body para los nuevos datos
});
// Eliminar por ID (DELETE)
app.delete('/[tabla]/:id', async (req, res) => {
    // Implementa la lógica para eliminar un registro específico por ID de la tabla
    // Utiliza req.params.id para obtener el ID
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
