import './App.css';
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { useState } from "react";
import WebSocket from "./websocket";

function App() {
    const [stompClient, setStompClient] = useState(null);
    const [stompResponse, setStompResponse] = useState(null);
const subscribe = async (url) => {


    const token = "a24275df-70db-4d06-89ed-d5447d070c29"

    const callback = async (message) => {
        let response = JSON.parse(message.body);
        setStompResponse(response);
    };
    let newStompClient=null
    try {

        let socket = new SockJS(`ws://localhost:8000/ws/img/inference`);
        newStompClient = Stomp.over(socket);
        newStompClient.debug = null; // COMENTAR PARA DESACTIVAR COMENTARIOS DEL WEBSOCKET EN CONSOLA
        setStompClient(newStompClient);
        WebSocket().subscribeService(newStompClient, url, callback, token);

        socket.onclose = async () => {
            await subscribe(url, token);
        };
        // setReconnectStomp(false);
        // setTryActiveRequests(true);
    } catch (error) {
        console.error("error stomp client", error);
    }
};

const send_message = async (newStompClient, json) => {

    if (newStompClient) {
        WebSocket().clientSend(newStompClient, `ws://localhost:8000/ws/img/inference`, json,
            {
                "Api-Key": "a24275df-70db-4d06-89ed-d5447d070c29",
            })
        return newStompClient
    }
};


  return (
    <div className="App">
      <header className="App-header">
<h1>Image Upload</h1>
    <form id="uploadForm" encType="multipart/form-data">
        <input type="file" id="fileInput" name="image" accept="image/*"/>
        <button type="submit">Upload Image</button>
    </form>
    <div id="imagePreview"></div>
    <h1>WebSocket Connection</h1>
    <button onClick={subscribe}>Connect to socket</button>
    <button onClick={send_message}>Send message to web socket</button>
    <div id="executionTime_conn"></div>
    <div id="executionTime_"></div>
    <div id="response"></div>
      </header>
    </div>
  );
}

export default App;
