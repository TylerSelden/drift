import * as THREE from "three";
import * as Misc from "./misc.js";

let Scene, Camera, Renderer, Player;

async function startXR(type = "vr") {
  if (!navigator.xr) return alert("This browser does not support WebXR");
  if (!await navigator.xr.isSessionSupported(`immersive-${type}`)) return alert(`This browser does not support immersive-${type}.`);

  const session = await navigator.xr.requestSession(`immersive-${type}`, {
    requiredFeatures: ["local", "local-floor"]
  }).then(onSessionStarted);
}

function init() {
  Renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  Renderer.xr.enabled = true;
  Renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(Renderer.domElement);

  Scene = new THREE.Scene();
  Player = Misc.Group({ parent: Scene });
  Camera = Misc.Camera({ parent: Player });

  return Scene;
}

function onSessionStarted(session) {
  Renderer.xr.setReferenceSpaceType("local-floor");
  Renderer.xr.setSession(session);
  Renderer.setAnimationLoop(() => {
    Renderer.render(Scene, Camera);
  });
}

export { init, startXR };
