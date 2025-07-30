import * as Engine from "./engine/main.js";
import * as Loader from "./engine/loader.js";

window.onload = async () => {
  const Scene = Engine.init();

  const manager = new Loader.Manager({ cb: start });
  Loader.Load("./assets/thing.glb", manager, Scene, { scale: 1.05 });
};

function start() {
  document.querySelector("button").onclick = () => { Engine.startXR("ar") };
}
