import React, { useState, useEffect } from 'react';
import './App.css';

function FrameDetailsComponent({ API, socket }) {

  return (
    <>
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
    </>
  );
}

export default FrameDetailsComponent;