const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const { Server } = require('socket.io');

const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const teamRoutes = require('./routes/teamRoutes');
const taskRoutes = require('./routes/taskRoutes');
const scanRoutes = require('./routes/scanRoutes');
const chatRoutes = require('./routes/chatRoutes.js');
const messageRoutes = require('./routes/messageRoutes');

const app = express();

// Crear el servidor HTTP con Express
const server = http.createServer(app);

// Crear instancia de Socket.io
const io = new Server(server, {
    cors: {
        origin: '*', // Permitir cualquier origen
    },
});

// Middleware para parsear el body de las peticiones
app.use(bodyParser.json());
// Middleware para agregar io a las peticiones
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/scans', scanRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/messages', messageRoutes);

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Configurar socket.io
io.on('connection', (socket) => {
    console.log('New user connected:', socket.id);

    // Escuchar eventos específicos
    socket.on('sendMessage', (message) => {
        console.log('Message received:', message);

        // Emitir el mensaje a todos los clientes conectados
        io.emit('receiveMessage', message);
    });

    // Evento cuando el cliente se desconecta
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
