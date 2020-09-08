import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import io from 'socket.io-client';


const URL = "localhost:3000";

var socket = io(URL);

ReactDOM.render(
  <React.StrictMode>
    <App URL={URL} socket={socket}/>
  </React.StrictMode>,
  document.getElementById('root')
);
