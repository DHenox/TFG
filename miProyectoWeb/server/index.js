require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3001;

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    options: process.env.DB_OPTIONS,
});

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hola desde el backend!');
});

// Rutas CRUD para usuarios

// Obtener todos los usuarios
app.get('/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Users');
        res.json(result.rows);
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

// Rutas CRUD para equipos

// Obtener todos los equipos
app.get('/teams', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Teams');
        res.json(result.rows);
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

// Rutas CRUD para proyectos

// Obtener todos los proyectos
app.get('/projects', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Projects');
        res.json(result.rows);
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

// Rutas CRUD para tareas

// Obtener todas las tareas
app.get('/tasks', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Tasks');
        res.json(result.rows);
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

// Rutas CRUD para chats

// Obtener todos los chats
app.get('/chats', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Chats');
        res.json(result.rows);
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

// Rutas CRUD para mensajes

// Obtener todos los mensajes
app.get('/messages', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Messages');
        res.json(result.rows);
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

// Obtener todos los proyectos de un usuario específico
app.get('/users/:userId/projects', async (req, res) => {
    const userId = req.params.userId;
    try {
        const result = await pool.query(
            'SELECT * FROM Projects WHERE user_id = $1',
            [userId]
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Obtener todas las tareas de un proyecto específico
app.get('/projects/:projectId/tasks', async (req, res) => {
    const projectId = req.params.projectId;
    try {
        const result = await pool.query(
            'SELECT * FROM Tasks WHERE project_id = $1',
            [projectId]
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Obtener todos los chats de un proyecto específico
app.get('/projects/:projectId/chats', async (req, res) => {
    const projectId = req.params.projectId;
    try {
        const result = await pool.query(
            'SELECT * FROM Chats WHERE project_id = $1',
            [projectId]
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
