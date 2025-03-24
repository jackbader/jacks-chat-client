import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import config from '../config';
import '../styles/Chat.css';

function Chat({ username, room, socket }) {
  const [message, setMessage] = useState('');
  const [messageList, setMessageList] = useState([]);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // Redirect if username or room is missing
  useEffect(() => {
    if (!username || !room) {
      navigate('/');
    }
  }, [username, room, navigate]);

  // Fetch previous messages when component mounts
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${config.API_URL}/api/messages/${room}`);
        setMessageList(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    if (room) {
      fetchMessages();
    }
  }, [room]);

  // Listen for incoming messages
  useEffect(() => {
    socket.on('receive_message', (data) => {
      setMessageList((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.off('receive_message');
    };
  }, [socket]);

  // Auto-scroll to the bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messageList]);

  const sendMessage = async () => {
    if (message.trim() === '') return;
    if (!username || !room) {
      console.error('Cannot send message: username or room is missing');
      return;
    }

    const messageData = {
      room: room,
      sender: username,
      text: message,
      timestamp: new Date()
    };

    console.log('emitting to socket', messageData)

    // Send message to server
    await socket.emit('send_message', messageData);
    setMessage('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Live Chat - Room: {room}</h2>
      </div>
      
      <div className="chat-messages">
        {messageList.map((msg, index) => (
          <div 
            key={index} 
            className={`message ${msg.sender === username ? 'you' : 'other'}`}
          >
            <div className="message-content">
              <p>{msg.text}</p>
            </div>
            <div className="message-meta">
              <p className="sender">{msg.sender}</p>
              <p className="time">
                {new Date(msg.timestamp).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="chat-input">
        <input 
          type="text" 
          placeholder="Type a message..." 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Chat;