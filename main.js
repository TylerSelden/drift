import * as THREE from "three";
import * as Engine from "./engine/main.js";
import * as Misc from "./engine/misc.js";
import * as Loader from "./engine/loader.js";
import * as Controller from "./engine/controller.js";
import * as Multiplayer from "./engine/plugins/multiplayer.js";

let Scene, Player, Renderer, Camera;

let ball;

window.onload = async () => {
  ({ Scene, Player, Renderer, Camera } = Engine.init());

  const manager = new Loader.Manager({ cb: start });
  Loader.Load("./assets/thing.glb", manager, { parent: Scene, scale: 1.05, position: [0, 0, -2] });
  Misc.AmbientLight({ intensity: 0.8, parent: Scene });
  Misc.DirectionalLight({ position: [0, 2.5, 0], intensity: 2, parent: Scene });
  Misc.Cube({ parent: Scene });
  

  ball = Misc.Sphere({ parent: Scene });
  window.conn = new Multiplayer.Connection("wss://server.benti.dev:8443/drift", "dev", moveBall, { onOpen, onClose });
};

function start() {
  const btn = document.querySelector("button");
  btn.onclick = () => { Engine.startXR("ar", loop, startSendPos) };
  btn.classList.remove("d-none");
}

function startSendPos() {
  setInterval(() => {
    if (!conn || !conn.DataChannel || conn.DataChannel.readyState !== "open") return;
    let pos = Camera.getWorldPosition(new THREE.Vector3()).toArray();
    conn.Send(new Float32Array(pos));
  }, 60);
}

let lastLoopTime = performance.now();
function loop() {
  const now = performance.now()
  const delta = (now - lastLoopTime) / 1000;
  lastLoopTime = now;
  const speed = 2 * delta;

  const input = Controller.PollGamepad(Renderer, Player);
  Player.rotation.y -= input.right.joystick.x * speed;

  const zVec = new THREE.Vector3();
  Camera.getWorldDirection(zVec).setY(0).normalize();
  const xVec = new THREE.Vector3().crossVectors(zVec, Camera.up).normalize();
  
  Player.position.addScaledVector(zVec, speed * -input.left.joystick.y);
  Player.position.addScaledVector(xVec, speed * input.left.joystick.x);
}


function moveBall(data) {
  const msg = new Float32Array(data);
  console.log(msg);
  ball.position.set(...msg);
}

function onOpen() {
  console.log("opened!");
}
function onClose() {
  console.log("c;psed!");
}
