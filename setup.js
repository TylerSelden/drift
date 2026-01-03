import * as CANNON from "cannon-es";
import * as Loader from "./engine/plugins/loader.js";
import * as Objects from "./engine/objects.js";
import * as Entities from "./engine/entities.js";

const pairs = [];
let Scene, Cb, Manager;

export function loadAssets(scene, cb) {
  Scene = scene;
  Cb = cb;

  Manager = new Loader.Manager();
  Manager.register("./assets/stadium.glb");
  Manager.register("./assets/skybox.glb");
  Manager.load(createEntities);
}

function createEntities() {
  const ground = Objects.PPlane({ mass: 0 });
  ground.quaternion.setFromAxisAngle(
    new CANNON.Vec3(1, 0, 0),
    -Math.PI / 2
  );
  pairs.push([null, ground, null, Object.values(ground.quaternion)])

  pairs.push([Manager.models["./assets/skybox.glb"], null, [0, 0, 0]]);
  pairs.push([Manager.models["./assets/stadium.glb"], null, [0, 0, 0]]);
  pairs.push([Objects.VCube({ size: 1, color: 0xaaaaff }), Objects.PCube({ size: 1, mass: 50, fixedRotation: true }), [0, 0.5, -2]]);
  pairs.push([Objects.VCube({ size: 10, color: 0xffeeaa }), Objects.PCube({ size: 10, mass: 0 }), [20, 0, 0]]);

  for (let pair of pairs) {
    const pos = pair[2] || [0, 0, 0];
    const quat = pair[3] || [0, 0, 0, 1];

    Entities.Add(new Entities.Entity(pair[0], pair[1], { pos, quat }));
  }

  sceneSetup();
}

function sceneSetup() {
  Objects.AmbientLight({ parent: Scene });
  Objects.DirectionalLight({ parent: Scene });

  Cb();
}
