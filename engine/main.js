import * as THREE from "three";
import * as Misc from "./misc.js";
import * as Controller from "./controller.js";

let Scene, Camera, Renderer, Player;


function init() {
  Renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  Renderer.xr.enabled = true;
  Renderer.shadowMap.enabled = true;
  Renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(Renderer.domElement);

  Scene = new THREE.Scene();
  Player = Misc.Group({ parent: Scene });
  Camera = Misc.Camera({ parent: Player });

  return { Scene, Player };
}

async function startXR(type = "vr") {
  if (!navigator.xr) return alert("This browser does not support WebXR");
  if (!await navigator.xr.isSessionSupported(`immersive-${type}`)) return alert(`This browser does not support immersive-${type}.`);

  const session = await navigator.xr.requestSession(`immersive-${type}`, {
    requiredFeatures: ["local-floor", "hand-tracking"]
  }).then(onSessionStarted);
}

function onSessionStarted(session) {
  Controller.Setup(Player, Renderer);
  Renderer.xr.setReferenceSpaceType("local-floor");
  Renderer.xr.setSession(session);
  Renderer.setAnimationLoop(() => {
    Renderer.render(Scene, Camera);
  });
}

export { init, startXR };
