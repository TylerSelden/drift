import * as Multiplayer from "./engine/plugins/multiplayer.js";


function onMsg(msg) {
  console.log(msg);
}

function onOpen() {
  console.log("Connection opened!");
}

function onClose() {
  console.log("Connection closed!");
}

window.conn1 = new Multiplayer.Connection("wss://server.benti.dev:8443/drift", "gameCode1", onMsg, { onOpen, onClose });
