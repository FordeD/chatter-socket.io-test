import React, { useState, useEffect } from 'react';
import './App.css';
import AuthComponent from './auth.component';
import ConversationComponent from './conversation.component';
import FrameChatComponent from './frame.chat.component';
import FrameDetailsComponent from './frame.details.component';

function ChatComponent({ API, socket }) {

  const [authorised, setAuthorised] = useState(localStorage.getItem('authorised') || false);
  const [users, setUsers] = useState([]);
  var autologin = false;

  useEffect(() => {
    if (authorised && authorised == true) {
      autologin = true;
    }
  }, []);

  function setStatusAuthorised(state) {
    setAuthorised(state);
    localStorage.setItem('authorised', state);
  }

  socket.on('User:user_status', (result) => {
    console.log(result);
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

  return (
    <header className="App-header">
      { authorised == false ? <AuthComponent autologin={autologin} API={API} socket={socket} handleAuthorised={setStatusAuthorised} /> : null}
      <div>
        <div className="Contacts">
          {authorised == false ? <ConversationComponent API={API} socket={socket} /> : null}
        </div>
        <div className="Interactive-frame">
          <div className="Chat-frame">
            {authorised == false ? <FrameChatComponent API={API} socket={socket} /> : null}
          </div>
          <div className="Details-Frame">
            {authorised == false ? <FrameDetailsComponent API={API} socket={socket} /> : null}
          </div>
        </div>
      </div>
    </header>
  );
}

export default ChatComponent;
