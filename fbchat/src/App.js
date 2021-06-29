/** Импорт зависимостей необходимых для работы React и React hooks */

import React, { useRef, useState } from "react";

/** Импорт зависимостей необходимых для работы firebase, fire store, fire-base-hooks  */

import firebase from "firebase/app";
import "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";

/** Импорт стилей  */

import "./App.css";

/** Запуск базы данных и с помощью уникальных данных приложения*/

firebase.initializeApp({
  apiKey: "AIzaSyCP3vNE6iprsfzMfZ9dtn9gj2z5v08tK5c",
  authDomain: "firechat-979cd.firebaseapp.com",
  projectId: "firechat-979cd",
  storageBucket: "firechat-979cd.appspot.com",
  messagingSenderId: "103461157896",
  appId: "1:103461157896:web:46ae8157713eeed71825bd",
});

/** Иницилизация базы данных firestore  */

const firestore = firebase.firestore();

/** Точка входа для приложения */

function App() {
  return (
    <div className="App">
      <ChatRoom />
    </div>
  );
}

/** компонент окна чата */

function ChatRoom() {
  // Якорь, созданный для промотки вниз после отправки сообщения
  const anchor = useRef();
  // получаем ссылку на коллекцию сообщений из firestore
  const messagesRef = firestore.collection("messages");
  //создаем очередь из сообщений по времени их создания
  const query = messagesRef.orderBy("createdAt").limit(100);
  // c помощью хука useCollectionData поместим значения сообщений в массив messages
  const [messages] = useCollectionData(query, { idField: "id" });
  //используем хук useState для получения значения инпута
  const [formValue, setFormValue] = useState("");


  const sendMessage = async (e) => {
    //предовратим стандартное поведение кнопки с типом sybmit
    e.preventDefault();
    // добавим значение сообщения и время создания сообщения в firestore
    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
    //вернем значение инпута к пустой строке
    setFormValue("");
    //включим прокрутку к якорю для улучшения UX =)
    anchor.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <main className='ChatRoom'>
        {messages &&
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
        <div ref={anchor}></div>
      </main>
      <form onSubmit={sendMessage}>
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="Напишите сообщение тут"
        />

        <button type="submit" disabled={!formValue}>
          Отправить сообщение
        </button>
      </form>
    </>
  );
}

/** простой компонент который принимает значения текста сообщения и айди сообщения от компонента ChatRoom */
function ChatMessage(props) {
  const { text } = props.message;
  return (
    <>
      <div>
        <p>{text}</p>
      </div>
    </>
  );
}

export default App;