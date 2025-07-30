import * as Engine from "./engine/main.js";

document.querySelector("button").onclick = () => { Engine.startXR("ar") };
window.onload = Engine.init;
