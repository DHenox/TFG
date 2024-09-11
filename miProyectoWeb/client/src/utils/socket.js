// src/socket.js
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001'); // Apunta al servidor backend

export default socket;
