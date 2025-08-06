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
  Controller.Setup(Player.VisualObj, Renderer);
  Renderer.xr.setReferenceSpaceType("local-floor");
  Renderer.xr.setSession(session);

  Renderer.setAnimationLoop(() => {
    const deltaTime = Clock.getDelta();


    const pos = Camera.getWorldPosition(new THREE.Vector3()).toArray();
    const head = pos[1] + 0.1;
    if (pos[1] !== 0) {
      if (!Player.PhysicalObj) {
        Player.PhysicalObj = new Objects.PPill({
          radius: 0.25,
          mass: 60,
          height: head,
          offsetPos: [0, head / 2, 0],
          fixedRotation: true
        });
        World.addBody(Player.PhysicalObj);
      }

      Player.PhysicalObj.position.set(pos[0], Player.PhysicalObj.position.y, pos[2]);
    }

    World.step(1 / 60, deltaTime, 3);
    Entities.Interpolate(Camera.position);
    gameloop(deltaTime);
    Renderer.render(Scene, Camera);
  });
  cb();
}

export { init, startXR };
