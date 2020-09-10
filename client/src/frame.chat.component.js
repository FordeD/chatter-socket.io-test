import React, { useState, useEffect } from 'react';
import './App.css';

function FrameChatComponent({ API, socket, users, self }) {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [conversationMessages, setConversationMessages] = useState(null);

  function handleInput(event) {
    let target = event.target;
    setMessageInput(target.value);
  }


  // TODO in progress
  function handleCall() {

  }

  function handleSend() {
    if (messageInput != "" && messageInput.length < 1024) {
      socket.emit('Message:send', conversationMessages, messageInput);
      setMessageInput("");
    }
  }

  socket.on('Message:send', (result) => {
    console.log('Message:send', result);
    if (result.data.status == "success") {
      setMessages(messages.push({ user: result.data, msg: result.data.msg, id: result.data.id }));
    }
  });

  socket.on('Message:get', (result) => {
    console.log('Message:get', result);
    if (result.data.status == "success") {
      if (result.data.list.length > 0) {
        let messages = result.data.list.map((message) => {
          return { user: result.data, msg: result.data.msg, id: result.data.id };
        });
        setMessages(messages);
        setConversationMessages(result.data.conversation);
      }
    }
  });

  let messagesList = messages.map((message) => {
    let author = "";
    if (message.user != self._id) {
      let currUser = users.findOne((user) => {
        return user.id == message.user;
      });
      author = currUser.name + " " + currUser.surname;
    } else {
      author = "You";
    }
    return (
      <li>
        <div>
          <b className="message-author">{author}</b>
          <sub className="message-timestamp">{new Date(message.date).toISOString()}</sub>
          <span data-from={message.user == self._id ? "self" : "other"} className="message">{message.msg}</span>
        </div>
      </li>
    )
  });

  return (
    <>
      <div className="Chat-messages-list">
        {messagesList}
      </div>
      <div className="Controls-panel">
        <button className="Video-call" onClick={handleCall}>Call</button>
        <input className="Message-input" value={messageInput} placeholder="Input..." onChange={handleInput}></input>
        <button className="Send-message" onClick={handleSend}>Send</button>
      </div>
    </>
  );
}

export default FrameChatComponent;