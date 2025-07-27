// server.js

/* eslint-disable @typescript-eslint/no-require-imports */

const express = require('express');
const next = require('next');
const { createServer } = require('http');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const expressApp = express();
  const httpServer = createServer(expressApp);
  const io = new Server(httpServer);

  io.on('connection', (socket) => {
    console.log('User connected', socket.id);

    socket.on('chat-message', (msg) => {
      io.emit('chat-message', msg); // broadcast to all including sender
    });

    socket.on('disconnect', () => {
      console.log('User disconnected', socket.id);
    });
  });

  // ✅ FIX: Use .use() instead of .all('*') to avoid path-to-regexp error
  expressApp.use((req, res) => {
    return handle(req, res);
  });

  httpServer.listen(3000, () => {
    console.log('> Ready on http://localhost:3000');
  });
});
