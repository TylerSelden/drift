import * as Multiplayer from "./engine/plugins/multiplayer.js";

function onOpen() {
  console.log("opened!");
  Multiplayer.Send("IT WORKSSS");
}
function onMsg(msg) {
  console.log(msg);
}
function onClose() {
  console.log("closed!");
}

Multiplayer.Start("wss://server.benti.dev:8443/drift",
  "test",
  onMsg, { onOpen, onClose });

