import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import io from 'socket.io-client';
import Chat from './components/Chat';
import JoinRoom from './components/JoinRoom';
import './App.css';

const socket = io.connect('http://localhost:8000');

function App() {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/" 
            element={
              <JoinRoom 
                username={username}
                setUsername={setUsername}
                room={room}
                setRoom={setRoom}
                socket={socket}
              />
            }
          />
          <Route 
            path="/chat" 
            element={
              <Chat 
                username={username}
                room={room}
                socket={socket}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
