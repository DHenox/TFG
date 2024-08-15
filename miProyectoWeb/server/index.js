const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const teamRoutes = require('./routes/teamRoutes');
const taskRoutes = require('./routes/taskRoutes');
const chatRoutes = require('./routes/chatRoutes.js');
const messageRoutes = require('./routes/messageRoutes');
const app = express();

// Middleware para parsear el body de las peticiones
app.use(bodyParser.json());

// Rutas
app.use('/users', userRoutes);
app.use('/projects', projectRoutes);
app.use('/teams', teamRoutes);
app.use('/tasks', taskRoutes);
app.use('/chats', chatRoutes);
app.use('/messages', messageRoutes);

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo salió mal!');
});

// Iniciar el servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
