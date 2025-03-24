import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/JoinRoom.css';

function JoinRoom({ username, setUsername, room, setRoom, socket }) {
  const navigate = useNavigate();

  const joinRoom = () => {
    if (username !== '' && room !== '') {
      socket.emit('join_room', room);
      navigate('/chat');
    }
  };

  return (
    <div className="join-container">
      <h1>Live Chat</h1>
      <div className="join-form">
        <input 
          className="join-input"
          type="text" 
          placeholder="Username..." 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input 
          className="join-input"
          type="text" 
          placeholder="Room ID..." 
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        <button onClick={joinRoom} className="join-button">
          Join Chat
        </button>
      </div>
    </div>
  );
}

export default JoinRoom;