import React, { useState, useEffect } from 'react';
import './App.css';
import AuthComponent from './auth.component';

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

  socket.on('Global:user_status', (result) => {
    console.log(result);
    let newUsers = users;
    if (result.data.type == "enter") {
      setUsers(newUsers.push({ username: result.data.username, id: result.data.id, status: "Online" }));
    } else if (result.data.type == "exit") {
      let currentUserIndex = newUsers.findIndex((user) => user.id == result.data.id);
      newUsers = newUsers.splice(currentUserIndex, 1);
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
          <div className="Chat-element">
            <span>Conversation name</span>
            <button className="Left-from-conversation">Leave</button>
            <button className="Link-conversation">Invite</button>
          </div>
        </div>
        <div className="Interactive-frame">
          <div className="Chat-frame">
            <div className="Chat-messages-list">
              <li>
                <div>
                  <span className="message">HI everyone!</span>
                </div>
              </li>
            </div>
            <div className="Controls-panel">
              <button className="Video-call">Call</button>
              <input className="Message-input" placeholder="Input..."></input>
              <button className="Send-message">Send</button>
            </div>
          </div>
          <div className="Details-Frame">
            <div className="Contacts-data">
              <span>Name:</span>
              <span>Surname:</span>
              <span>Nickname:</span>
              <span>Link:</span>
              <span>Register data:</span>
              <span>Online:</span>
            </div>
            <div className="Contact-interactive">
              <button className="Add-new-conversation">New Cpnversation</button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default ChatComponent;
