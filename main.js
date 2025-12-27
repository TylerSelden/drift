import * as THREE from "three";
import * as Engine from "./engine/main.js";
import * as Controller from "./engine/controller.js";

import * as Setup from "./setup.js";

let Scene, Player, Renderer, Camera, World;

window.onload = async () => {
  ({ Scene, Player, Renderer, Camera, World } = Engine.init());

  Setup.loadAssets(Scene, start);

  // FIXME
  window.THREE = THREE;
  window.Player = Player;
  window.Camera = Camera;
  window.World = World;
  window.LogLocked = [];
  window.LogLockOverride = false;
  window.Log = (msg = "") => {
    // get call ID
    const e = new Error();
    const regex = /\((.*):(\d+):(\d+)\)$/
    const match = regex.exec(e.stack.split("\n")[2]);
    const id = match[1] + match[2] + match[3];


    if (window.LogLocked[id] || window.LogLockOverride) return;
    window.LogLocked[id] = true;
    console.log(msg);
    setTimeout(() => window.LogLocked[id] = !window.LogLocked[id], 1000);
  };
};

function start() {
  const btn = document.querySelector("button");
  btn.onclick = () => { Engine.startXR("ar", () => {}, loop) };
  btn.classList.remove("d-none");
}

function loop(delta) {
  Log();
  Log(Camera.getWorldPosition(new THREE.Vector3()).x);
  Log(Player.PhysicalObj.position.x);

/*
  const speed = 2 * delta;

  const input = Controller.PollGamepad(Renderer, Player);
  Player.rotation.y -= input.right.joystick.x * speed;

  const zVec = new THREE.Vector3();
  Camera.getWorldDirection(zVec).setY(0).normalize();
  const xVec = new THREE.Vector3().crossVectors(zVec, Camera.up).normalize();

  Player.PhysicalObj.position.addScaledVector(zVec, speed * -input.left.joystick.y);
  Player.PhysicalObj.position.addScaledVector(xVec, speed * input.left.joystick.x);
*/
}
