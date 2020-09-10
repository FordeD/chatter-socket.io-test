import React, { useState, useEffect } from 'react';
import './App.css';

function FrameChatComponent({ API, socket }) {

  return (
    <>
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
    </>
  );
}

export default FrameChatComponent;