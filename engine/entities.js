import * as THREE from "three";

const Entities = {};

let Scene, World;

function SetContext(scene, world) {
  Scene = scene;
  World = world;
}

function Add(entity) {
  let id = crypto.randomUUID();

  Entities[id] = entity;
  if (entity.VisualObj) Scene.add(entity.VisualObj);
  if (entity.PhysicalObj) World.addBody(entity.PhysicalObj);

  return id;
}

function Remove(id) {
  if (Entities[id].VisualObj) Scene.remove(Entities[id].VisualObj);
  if (Entities[id].PhysicalObj) World.removeBody(Entities[id].PhysicalObj);
  delete Entities[id];
}

function Get(id = null) {
  if (!id) return Entities;
  return Entities[id];
}

function Update() {
  for (const id in Entities) {
    Entities[id].Update();
  }
}

class Entity {
  constructor(visualObj, physicalObj = null, { pos = [0, 0, 0], quat = [0, 0, 0, 1] } = {}) {
    this.VisualObj = visualObj;
    this.PhysicalObj = physicalObj;
    this.Teleport(pos, quat);
  }

  Teleport(pos = [0, 0, 0], quat = [0, 0, 0, 1]) {
    if (this.VisualObj) {
      this.VisualObj.position.set(...pos);
      this.VisualObj.quaternion.set(...quat);
    }

    if (this.PhysicalObj) {
      this.PhysicalObj.position.set(...pos);
      this.PhysicalObj.quaternion.set(...quat);
      this.PhysicalObj.velocity.set(0, 0, 0);
      this.PhysicalObj.angularVelocity.set(0, 0, 0);
    }
  }

  Update() {
    if (!this.PhysicalObj || !this.VisualObj) return;
    this.VisualObj.position.copy(this.PhysicalObj.position);
    this.VisualObj.quaternion.copy(this.PhysicalObj.quaternion);
  }
}

export { SetContext, Add, Remove, Get, Update, Entity };
