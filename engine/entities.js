let Entities = {};

let Scene;

function SetContext(scene) {
  Scene = scene;
}

function Add(entity) {
  let id = crypto.randomUUID();

  Entities[id] = entity;
  Scene.add(entity.VisualObj);

  return id;
}

function Remove(id) {
  Scene.remove(Entities[id]);
  delete Entities[id];
}

function Get(id = null) {
  if (!id) return Entities;
  return Entities[id];
}

class Entity {
  constructor(visualObj, physicalObj = null, pos = [0, 0, 0], quat = [0, 0, 0, 1]) {
    this.VisualObj = visualObj;
    this.PhysicalObj = physicalObj;

    this.IntPos = [];
    this.IntQuat = [];

    this.Teleport({ pos, quat });
  }

  Teleport({ pos = [0, 0, 0], quat = [0, 0, 0, 1]} = {}) {
    this.VisualObj.position.set(...pos);
    this.VisualObj.quaternion.set(...quat);

    if (this.PhysicalObj) {
      this.PhysicalObj.setTranslation({ x: pos[0], y: pos[1], z: pos[2] }, true);
      this.PhysicalObj.setRotation({ x: quat[0], y: quat[1], z: quat[2] }, true);
    }
  }
}

export { SetContext, Add, Remove, Get, Entity };
