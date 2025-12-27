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
  Camera = Objects.Camera();
  Player = new Entities.Entity(Objects.VGroup({ children: [Camera] }), null, { isPlayer: true });
  Entities.Add(Player);

  return { Scene, Player, Renderer, Camera, World };
}

/*

F = M * A

F = 70 * A

A = m / (s^2)
A = d / (1/60) * (1/60)




*/

async function startXR(type = "vr", userRenderLoop = () => {}, userLogicLoop = () => {}, cb = () => {}) {
  if (!navigator.xr) return alert("This browser does not support WebXR");
  if (!await navigator.xr.isSessionSupported(`immersive-${type}`)) return alert(`This browser does not support immersive-${type}.`);

  const session = await navigator.xr.requestSession(`immersive-${type}`, {
    requiredFeatures: ["local-floor", "hand-tracking"]
  }).then((session) => {
    onSessionStarted(session, userRenderLoop, userLogicLoop, cb);
  });
}

function logicLoop(userLogicLoop) {
  const camWorldPos = Camera.getWorldPosition(new THREE.Vector3());
  if (!Player.PhysicalObj) {
    const headTop = Math.max(camWorldPos.y + 0.1, 1.8);
    Player.PhysicalObj = new Objects.PPill({
      radius: 0.25,
      mass: 70,
      height: headTop,
      offsetPos: [0, headTop / 2, 0],
      fixedRotation: true
    });
    World.addBody(Player.PhysicalObj);
    window.player = Player;
  }

  // Catch physicalobj up to camera's world position, ignore Y for now
  const displacement = camWorldPos.clone().sub(Player.PhysicalObj.position);
  const t = (1/60) * (1/60)
  const accel = displacement.divide(new THREE.Vector3(t, 1, t));
  const force = accel.multiply(new THREE.Vector3(70, 0, 70));
  Player.PhysicalObj.applyForce(force);

  userLogicLoop();
  World.step(1 / 60);
  Entities.Update(Camera.position.clone(), Camera.getWorldPosition(new THREE.Vector3()));
}

function renderLoop(userRenderLoop) {
  const deltaTime = Clock.getDelta();

  userRenderLoop(deltaTime);
  Renderer.render(Scene, Camera);
}

function onSessionStarted(session, userRenderLoop, userLogicLoop, cb) {
  Controller.Setup(Player.VisualObj, Renderer);
  Renderer.xr.setReferenceSpaceType("local-floor");
  Renderer.xr.setSession(session);

  setInterval(() => {
    logicLoop(userLogicLoop);
  }, 1000 / 60);

  Renderer.setAnimationLoop(() => {
    renderLoop(userRenderLoop);
  });

  cb();
}

export { init, startXR };
