import * as Engine from "./engine/main.js";
import * as Misc from "./engine/misc.js";
import * as Loader from "./engine/loader.js";
import * as Controller from "./engine/controller.js";

let Scene, Player;

window.onload = async () => {
  const _ = Engine.init();
  Scene = _.Scene;
  Player = _.Player

  const manager = new Loader.Manager({ cb: start });
  Loader.Load("./assets/thing.glb", manager, { parent: Scene, scale: 1.05, position: [0, 0, -2] });
  Misc.AmbientLight({ intensity: 0.8, parent: Scene });
  Misc.DirectionalLight({ position: [0, 2.5, 0], intensity: 2, parent: Scene });
  Misc.Cube({ parent: Scene });
};

function start() {
  const btn = document.querySelector("button");
  btn.onclick = () => {
    Engine.startXR("ar")
    loop();
  };
  btn.classList.remove("d-none");
}

function loop() {
  if (Controller.left.trigger) {
    Player.position.x += 1;
    Controller.left.trigger = false;
  }

  requestAnimationFrame(loop);
}
