import React, { useState } from 'react';
import './App.css';

function AuthComponent({ socket, handleAuthorised, handleSetSelf }) {
  const [authState, setAuthState] = useState(2);
  let cachedLogin = localStorage.getItem('login') != null ? localStorage.getItem('login') : "";
  let cachedPassword = localStorage.getItem('password') != null ? localStorage.getItem('password') : "";
  const [login, setLogin] = useState(cachedLogin);
  const [password, setPassword] = useState(cachedPassword);
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");

  function SetForm(event) {
    event.preventDefault();
    console.log("SetForm", event.target.dataset.form);
    setLogin("");
    setPassword("");
    setAuthState(event.target.dataset.form);
  }

  function UserRegister(event) {
    event.preventDefault();
    console.log("Register", login, password);
    socket.emit('User:register', login, password);
  }

  function UserAuth(event) {
    event.preventDefault();
    handleAuthorised(true);
    console.log("Auth", login, password);
    socket.emit('User:auth', login, password);
    localStorage.setItem('login', login);
    localStorage.setItem('password', password);
  }

  function handleInput(event) {
    let target = event.target;
    let inputType = target.className.split(" ")[1];
    let value = target.value;

    switch (inputType) {
      case "login": {
        setLogin(value);
        break;
      }
      case "password": {
        setPassword(value);
        break;
      }
      case "name": {
        setName(value);
        break;
      }
      case "surname": {
        setSurname(value);
        break;
      }
      default: break;
    }
  }

  socket.on('User:register', (result) => {
    console.log('User:register', result);
    if (result.data.status == "success") {
      setAuthState(2);
    } else {
      setAuthState(1);
    }
  });

  socket.on('User:auth', (result) => {
    console.log('User:auth', result);
    if (result.data.status == "success") {
      // AutoInvite by Link
      const URLSearch = new URLSearchParams(window.location.search);
      const inviteHash = URLSearch.get('invite');

      if (inviteHash) {
        socket.emit('Conversation:join', inviteHash);
        // Remove search param after join
        window.history.replaceState(null, null, window.location.pathname);
      }
      //

      handleSetSelf(result.data.item);
      handleAuthorised(true);
    } else {
      handleAuthorised(false);
    }
    return;
  });

  let form;
  if (authState == 1) {
    form = (
      <div className="form Register">
        <h2>Регистрация</h2>
        <div>
          <input className={"input login"} value={login} placeholder="Логин" onChange={handleInput}></input>
        </div>
        <div>
          <input className={"input password"} value={password} placeholder="Пароль" onChange={handleInput}></input>
        </div>
        <div>
          <input className={"input name"} value={name} placeholder="Имя" onChange={handleInput}></input>
        </div>
        <div>
          <input className={"input surname"} value={surname} placeholder="Фамилия" onChange={handleInput}></input>
        </div>
        <button onClick={UserRegister}>Регистрация</button>
        <button onClick={SetForm} data-form={2}>Авторизоваться</button>
      </div>
    )
  } else if (authState == 2) {
    form = (
      <div className="form Register">
        <h2>Авторизация</h2>
        <div>
          <input className={"input login"} value={login} placeholder="Логин" onChange={handleInput}></input>
        </div>
        <div>
          <input className={"input password"} value={password} placeholder="Пароль" onChange={handleInput}></input>
        </div>
        <button onClick={UserAuth}>Войти</button>
        <button onClick={SetForm} data-form={1}>Зарегистрироваться</button>
      </div>
    )
  }

  console.log("RENDER AUTH");
  return (
    <div className="form-background">
      {form}
    </div>
  );
}

export default AuthComponent;
