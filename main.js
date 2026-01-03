import * as THREE from "three";
import * as Engine from "./engine/main.js";
import * as Objects from "./engine/objects.js";
import * as Entities from "./engine/entities.js";
import * as Setup from "./setup.js";

let Scene, Player, Renderer, Camera, World;

window.onload = async () => {
  ({ Scene, Renderer, Camera, World } = Engine.Init());

  Player = new Entities.Entity(new Objects.VGroup({ children: [Camera] }), Objects.PPill({
    radius: 0.25,
    mass: 70,
    height: 1.75,
    offsetPos: [0, 0.875, 0],
    fixedRotation: true,
    linearDamping: 0,
    angularDamping: 0
  }));
  Camera.position.y = 1.65;
  Entities.Add(Player);

  Setup.loadAssets(Scene, start);
};

const Clock = new THREE.Clock();
function start() {
  renderLoop();
  setInterval(logicLoop, 1000 / 60);
}
function renderLoop() {
  Engine.Render(Clock.getDelta());
  requestAnimationFrame(renderLoop);
}

function logicLoop() {
  Engine.UpdatePhysics(1 / 60);
}
