let Entities = {};

let Scene, World;

function SetContext(scene, world) {
  Scene = scene;
  World = world;
}

function Add(entity) {
  let id = crypto.randomUUID();

  Entities[id] = entity;
  Scene.add(entity.VisualObj);
  if (entity.PhysicalObj) World.addBody(entity.PhysicalObj);

  return id;
}

function Remove(id) {
  Scene.remove(Entities[id].VisualObj);
  if (Entities[id].PhysicalObj) World.removeBody(Entities[id].PhysicalObj);
  delete Entities[id];
}

function Get(id = null) {
  if (!id) return Entities;
  return Entities[id];
}

function Interpolate() {
  for (const id in Entities) {
    Entities[id].Interpolate();
  }
}

class Entity {
  constructor(visualObj, physicalObj = null, { pos = [0, 0, 0], quat = [0, 0, 0, 1] } = {}) {
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
      this.PhysicalObj.position.set(...pos);
      this.PhysicalObj.quaternion.set(...quat);
      this.PhysicalObj.velocity.set(0, 0, 0);
      this.PhysicalObj.angularVelocity.set(0, 0, 0);
    }
  }

  Interpolate() {
    if (!this.PhysicalObj) return;
    this.VisualObj.position.copy(this.PhysicalObj.position);
    this.VisualObj.quaternion.copy(this.PhysicalObj.quaternion);
  }
}

export { SetContext, Add, Remove, Get, Interpolate, Entity };
