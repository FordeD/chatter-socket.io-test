import React, { useState, useEffect } from 'react';
import './App.css';

function FrameDetailsComponent({ API, socket }) {
  const [conversationDetails, setDetails] = useState(null);

  let conversationData = null;

  socket.on('Conversation:get', (result) => {
    if (result.data.status == "success") {
      setDetails(result.data.item);
    }
  });

  if (conversationDetails) {
    conversationData = (
      <div className="Contacts-data">
        <span>Name: {conversationDetails.name}</span>
        <span>Link: <a>{window.location.host + "/?invite=" + conversationDetails.invite_link}</a></span>
        <span>Register data: {new Date(conversationDetails.reg_date).toISOString()}</span>
        <span>Users: {conversationDetails.users.length}</span>
      </div>
    )
  }


  return (
    <>
      {conversationData}
    </>
  );
}

export default FrameDetailsComponent;