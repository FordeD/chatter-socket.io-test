import React, { useState, useEffect } from 'react';
import './App.css';

function ConversationComponent({ API, socket, users, self }) {
  const [conversations, setConversations] = useState([]);
  const [componentState, setComponentState] = useState("contacts");
  function handleSetComponentState(event) {
    event.preventDefault();
    let value = event.target.dataset.state;
    setComponentState(value);
  }

  socket.on('Conversation:list', (result) => {
    console.log("Conversation:list", result);
    if (result.data.type == "list") {
      let yourConversations = [];
      for (let i = 0; i < result.data.list.length; i++) {
        let user = result.data.list[i];
        yourConversations.push(user);
      }
      setConversations(yourConversations);
    }
  });

  socket.on('Conversation:update', (result) => {
    console.log('Conversation:update', result);
    let coversationIndex = conversations.findIndex((conv) => {
      return result.data._id == conv._id;
    })

    let newConversations = conversations;
    newConversations[coversationIndex] = result.data;

    setConversations(newConversations);

  });

  socket.on('Conversation:create', (result) => {
    console.log('Conversation:create', result);
    if (result.data.status == "success") {
      if (result.data.invite) {
        socket.emit('Conversation:invite', result.data.item._id, result.data.invite._id);
      }
      setConversations(result.data.item);
    }
  });

  function createConversation() {
    socket.emit('Conversation:create');
  }

  function openConversation(conversationId, user) {
    if (!conversationId) {
      socket.emit('Conversation:create', user);
    } else {
      socket.emit('Message:get', conversationId, 300);
    }
  }

  function leaveFromConversation(conversationId) {
    socket.emit('Conversation:left', conversationId);
  }

  let conversationsList = null;
  if (conversations.length > 0) {
    conversationsList = conversations.map((conv) => {
      return (
        <div onClick={(e) => openConversation(conv._id)} className="Chat-element">
          <span>{conv.name}</span>
          <button onClick={(e) => leaveFromConversation(conv._id)} className="Leave-from-conversation">Leave</button>
        </div>
      )
    });
  }

  let contactsList = null;
  if (users.length > 0) {
    contactsList = users.map((user) => {
      if (user._id == self._id) return false;
      let conversationWith = false;
      if (conversations.length > 0) {
        conversationWith = conversations.find((conv) => {
          return conv.users.length == 2 && conv.users.indexOf(self._id) + 1 > 0 && conv.users.indexOf(user._id) + 1 > 0;
        });
      }

      let leaveButton = null;
      if (conversationWith) {
        leaveButton = (<button onClick={(e) => leaveFromConversation(conversationWith)} className="Left-from-conversation">Leave</button>)
      }

      return (
        <div className="Chat-element">
          <div className={user.online ? "user-status-online" : "user-status-offline"}></div>
          <span onClick={(e) => openConversation(conversationWith, user)}>
            {user.name + " " + user.surname}
          </span>
          {leaveButton}
        </div>
      )
    });
  }

  let createConversationButton = (<center><button onClick={createConversation} className="create-new-conversation">Create new conversation</button></center>)
  return (
    <div>
      <div>
        <button data-state={"contacts"} onClick={handleSetComponentState}> Contacts </button>
        <button data-state={"conversations"} onClick={handleSetComponentState}> Conversations </button>
      </div>
      <h3>{componentState}</h3>
      <hr />
      {componentState == "contacts" ? contactsList : conversationsList}
      {componentState == "conversations" ? createConversationButton : false}
    </div>
  );
}

export default ConversationComponent;