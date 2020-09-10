import React, { useState, useEffect } from 'react';
import './App.css';

function ConversationComponent({ API, socket }) {

  return (
    <div className="Chat-element">
      <span>Conversation name</span>
      <button className="Left-from-conversation">Leave</button>
      <button className="Link-conversation">Invite</button>
    </div>
  );
}

export default ConversationComponent;