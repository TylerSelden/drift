import * as THREE from "three";
import * as Engine from "./engine/main.js";
import * as Entities from "./engine/entities.js";
import * as Objects from "./engine/objects.js";
import * as Loader from "./engine/loader.js";
import * as Controller from "./engine/controller.js";
import * as Multiplayer from "./engine/plugins/multiplayer.js";

let Scene, Player, Renderer, Camera;

window.onload = async () => {
  ({ Scene, Player, Renderer, Camera } = Engine.init());

  let objects = [];

  const manager = new Loader.Manager({ cb: start });
  Loader.Load("./assets/thing.glb", manager, { scale: 1.05, position: [0, 0, -2] });
  Objects.AmbientLight({ intensity: 0.8 });
  Objects.DirectionalLight({ position: [0, 2.5, 0], intensity: 2 });

  window.ent = new Entities.Entity(Objects.Cube());
  Entities.Add(window.ent);
};

function start() {
  const btn = document.querySelector("button");
  btn.onclick = () => { Engine.startXR("ar", loop) };
  btn.classList.remove("d-none");
}

let lastLoopTime = performance.now();
function loop() {
  const now = performance.now();
  const delta = now - lastLoopTime;
  lastLoopTime = now;
  const speed = 2 * delta / 1000;

  const input = Controller.PollGamepad(Renderer, Player);
  Player.rotation.y -= input.right.joystick.x * speed;

  const zVec = new THREE.Vector3();
  Camera.getWorldDirection(zVec).setY(0).normalize();
  const xVec = new THREE.Vector3().crossVectors(zVec, Camera.up).normalize();

  Player.position.addScaledVector(zVec, speed * -input.left.joystick.y);
  Player.position.addScaledVector(xVec, speed * input.left.joystick.x);
}
