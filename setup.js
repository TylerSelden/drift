import * as Loader from "./engine/loader.js";
import * as Objects from "./engine/objects.js";
import * as Entities from "./engine/entities.js";

const pairs = [];
let Scene, Cb, Manager;

export function loadAssets(scene, cb) {
  Scene = scene;
  Cb = cb;

  Manager = new Loader.Manager({ cb: createEntities });
  //Loader.Load("./assets/thing.glb", Manager, { scale: 1.05, offsetPos: [0, -0.825, 0] });
  Loader.Load("./assets/floor.glb", Manager);
  //createEntities();
}

function createEntities() {
  let radius = 0.23;
  let height = 1.62;
  let pos = [0, height / 2, -2];

//  pairs.push([Manager.models["./assets/thing.glb"], Objects.PPill({ radius, height }), pos]);
  pairs.push([Manager.models["./assets/floor.glb"], null, [0, 0.1, -2]]);
  pairs.push([Objects.VPill({ radius, height }), Objects.PPill({ radius, height, mass: 50 }), pos]);
  pairs.push([Objects.VCube(), Objects.PCube(), [0, 3, -2]]);
//  pairs.push([Objects.VSphere(), Objects.PSphere(), [0, 8, 0]]);
  pairs.push([Objects.VCube({ size: 10, color: 0xffeeaa }), Objects.PCube({ size: 10, mass: 0 }), [6, 0, 0]]);

  for (let pair of pairs) {
    let pos = pair[2] || [0, 0, 0];
    let quat = pair[3] || [0, 0, 0, 1];
    Entities.Add(new Entities.Entity(pair[0], pair[1], { pos, quat }));
  }

  sceneSetup();
}

function sceneSetup() {
  Objects.AmbientLight({ parent: Scene });
  Objects.DirectionalLight({ parent: Scene });

  Cb();
}
