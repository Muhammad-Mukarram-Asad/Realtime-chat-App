'use client';
import { useEffect, useState } from 'react';
import socket from '../lib/socket';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  console.log("socket => ", socket, "messages => ", messages);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('connected:', socket.id);
    });

    socket.on('chat-message', (data) => {
      // data: { msg, senderId }
      console.log("message => ", data);
      // Only show received message if not from self
      if (data.senderId !== socket.id) {
        setMessages((prev) => [...prev, `Received: ${data.msg}`]);
      }
    });

    return () => {
      socket.off('chat-message');
      socket.off('connect');
    };
  }, []); // Only run once on mount

  const sendMessage = () => {
    if (input.trim()) {
      // Send both message and senderId
      socket.emit('chat-message', { msg: input, senderId: socket.id });
      setMessages((prev) => [...prev, `You: ${input}`]);
      setInput('');
    }
  };

  return (
    <div>
      <div className="h-96 overflow-auto border mb-2 p-2">
        {messages.map((msg, i) => (
          <div key={i}>{msg}</div>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="border px-2 py-1"
      />
      <button
        onClick={sendMessage}
        className="ml-2 px-4 py-1 bg-blue-500 text-white"
      >
        Send
      </button>
    </div>
  );
}
