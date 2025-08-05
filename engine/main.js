import * as THREE from "three";
import * as CANNON from 'cannon-es';
import * as Entities from "./entities.js";
import * as Objects from "./objects.js";
import * as Controller from "./controller.js";

let Scene, World, Camera, Renderer, Player;
const Clock = new THREE.Clock();

function init() {
  Renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  Renderer.xr.enabled = true;
  Renderer.shadowMap.enabled = true;
  Renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(Renderer.domElement);

  Scene = new THREE.Scene();
  Player = Objects.VGroup({ parent: Scene });
  Camera = Objects.Camera({ parent: Player });

  World = new CANNON.World({ gravity: new CANNON.Vec3(0, -4, 0) });
  World.broadphase = new CANNON.SAPBroadphase(World);
  World.solver.iterations = 10;
  World.solver.tolerance = 0.001;
  const ground = new CANNON.Body({
    mass: 0,
    shape: new CANNON.Plane()
  });
  ground.quaternion.setFromAxisAngle(
    new CANNON.Vec3(1, 0, 0),
    -Math.PI / 2
  );
  World.addBody(ground);

  Entities.SetContext(Scene, World);

  return { Scene, Player, Renderer, Camera, World };
}

async function startXR(type = "vr", gameloop, cb = () => {}) {
  if (!navigator.xr) return alert("This browser does not support WebXR");
  if (!await navigator.xr.isSessionSupported(`immersive-${type}`)) return alert(`This browser does not support immersive-${type}.`);

  const session = await navigator.xr.requestSession(`immersive-${type}`, {
    requiredFeatures: ["local-floor", "hand-tracking"]
  }).then((session) => {
    onSessionStarted(session, gameloop, cb);
  });
}

function onSessionStarted(session, gameloop, cb) {
  Controller.Setup(Player, Renderer);
  Renderer.xr.setReferenceSpaceType("local-floor");
  Renderer.xr.setSession(session);
  Renderer.setAnimationLoop(() => {
    const delta = Clock.getDelta();
    World.step(1 / 60, delta, 3);
    Entities.Interpolate();
    gameloop(delta);
    Renderer.render(Scene, Camera);
  });
  cb();
}

export { init, startXR };
