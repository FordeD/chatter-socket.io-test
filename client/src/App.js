import React from 'react';
import './App.css';
import ChatComponent from './chat.component';
function App({ URL, socket }) {
  return (
    <div className="App">
      <ChatComponent API={URL} socket={socket} />
    </div>
  );
}

export default App;
