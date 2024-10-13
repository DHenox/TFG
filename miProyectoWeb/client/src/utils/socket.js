// src/utils/socket.js
import { io } from 'socket.io-client';

const socket = io('https://pentesthub.com'); // Apunta al servidor web de NGINX

export default socket;
