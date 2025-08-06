import * as THREE from "three";
import * as Engine from "./engine/main.js";
import * as Entities from "./engine/entities.js";
import * as Objects from "./engine/objects.js";
import * as Loader from "./engine/loader.js";
import * as Controller from "./engine/controller.js";
import * as Multiplayer from "./engine/plugins/multiplayer.js";

import * as Setup from "./setup.js";

let Scene, Player, Renderer, Camera, World;

window.onload = async () => {
  ({ Scene, Player, Renderer, Camera, World } = Engine.init());

  Setup.loadAssets(Scene, start);
};

function start() {
  const btn = document.querySelector("button");
  btn.onclick = () => { Engine.startXR("ar", loop) };
  btn.classList.remove("d-none");
}

function loop(delta) {
  /*
  const speed = 2 * delta;

  const input = Controller.PollGamepad(Renderer, Player);
  Player.rotation.y -= input.right.joystick.x * speed;

  const zVec = new THREE.Vector3();
  Camera.getWorldDirection(zVec).setY(0).normalize();
  const xVec = new THREE.Vector3().crossVectors(zVec, Camera.up).normalize();

  Player.position.addScaledVector(zVec, speed * -input.left.joystick.y);
  Player.position.addScaledVector(xVec, speed * input.left.joystick.x);
  */
}
