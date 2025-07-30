import * as Engine from "./engine/main.js";
import * as Loader from "./engine/loader.js";

window.onload = async () => {
  const Scene = Engine.init();

  const manager = new Loader.Manager({ cb: start });
  Loader.Load("./assets/thing.glb", manager, Scene, { scale: 1.05 });
};

function start() {
  const btn = document.querySelector("button");
  btn.onclick = () => { Engine.startXR("ar") };
  btn.classList.remove("d-none");
}
