import React, { useState, useEffect } from 'react';
import './App.css';
import AuthComponent from './auth.component';
import ConversationComponent from './conversation.component';
import FrameChatComponent from './frame.chat.component';
import FrameDetailsComponent from './frame.details.component';

function ChatComponent({ API, socket }) {

  const [authorised, setAuthorised] = useState(false);
  const [users, setUsers] = useState([]);
  const [self, setSelf] = useState({});

  function handleSetSelf(data) {
    console.log("handleSetSelf", data);
    socket.emit('User:list');
    socket.emit('Conversation:list');

    setSelf(data);
  }

  function setStatusAuthorised(state) {
    setAuthorised(state);
    localStorage.setItem('authorised', state);
  }

  socket.on('User:user_status', (result) => {
    console.log('User:user_status', result);
    let newUsers = users;
    if (result.data.type == "enter") {
      setUsers(newUsers.push({ username: result.data.username, id: result.data.id, status: "Online" }));
    } else if (result.data.type == "exit") {
      let currentUserIndex = newUsers.findIndex((user) => user.id == result.data.id);
      newUsers = newUsers[currentUserIndex].status = "Offline";
      setUsers(newUsers);
    } else if (result.data.type == "list") {
      setUsers(result.data.list);
    }
  });

  socket.on('User:list', (result) => {
    console.log('User:list', result);
    if (result.data.type == "list") {
      let newUsers = [];
      for (let i = 0; i < result.data.list.length; i++) {
        let user = result.data.list[i];
        newUsers.push(user);
      }
      setUsers(newUsers);
    }
  });

  return (
    <header className="App-header">
      { !authorised ? <AuthComponent API={API} socket={socket} handleAuthorised={setStatusAuthorised} handleSetSelf={handleSetSelf} /> : null}
      <div className="App-content">
        <div className="Contacts">
          {authorised ? <ConversationComponent API={API} socket={socket} users={users} self={self} /> : null}
        </div>
        <div className="Interactive-frame">
          <div className="Chat-frame">
            {authorised ? <FrameChatComponent API={API} socket={socket} users={users} self={self} /> : null}
          </div>
          <div className="Details-Frame">
            {authorised ? <FrameDetailsComponent API={API} socket={socket} /> : null}
          </div>
        </div>
      </div>
    </header>
  );
}

export default ChatComponent;
