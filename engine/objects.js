import * as THREE from "three";
import * as CANNON from "cannon-es";

export function VBox({ size = [0.1, 0.1, 0.1], color = 0xff00ff, parent = null } = {}) {
  const geo = new THREE.BoxGeometry(size[0], size[1], size[2]);
  const mat = new THREE.MeshStandardMaterial({ color });
  const box = new THREE.Mesh(geo, mat);

  if (parent) parent.add(box);
  return box;
}

export function VCube({ size = 0.1, color = 0xff00ff, parent = null } = {}) {
  const cube = VBox({ size: [size, size, size], color });

  if (parent) parent.add(cube);
  return cube;
}

export function VSphere({ radius = 0.1, segments = 32, color = 0xff00ff, parent = null } = {}) {
  const geo = new THREE.SphereGeometry(radius, segments, segments / 2);
  const mat = new THREE.MeshStandardMaterial({ color });
  const sphere = new THREE.Mesh(geo, mat);

  if (parent) parent.add(sphere);
  return sphere;
}

export function VCylinder({ rTop = 0.1, rBot = 0.1, height = 0.5, segments = 16, color = 0xff00ff, parent = null } = {}) {
  const geo = new THREE.CylinderGeometry(rTop, rBot, height, segments);
  const mat = new THREE.MeshStandardMaterial({ color });
  const cylinder = new THREE.Mesh(geo, mat);

  if (parent) parent.add(cylinder);
  return cylinder;
}

export function VPill({ radius = 0.1, height = 0.1, segments = 32, color = 0xff00ff, parent = null } = {}) {
  const group = VGroup();
  VCylinder({ rTop: radius, rBot: radius, height: height - (radius * 2), segments, color, parent: group });
  const topSphere = VSphere({ radius, segments, color, parent: group });
  const botSphere = VSphere({ radius, segments, color, parent: group });
  topSphere.position.set(0, height / 2 - radius, 0);
  botSphere.position.set(0, -height / 2 + radius, 0);

  if (parent) parent.add(group);
  return group;
}

export function VGroup({ children = [], parent = null } = {}) {
  const group = new THREE.Group();
  for (const child of children) group.add(child);

  if (parent) parent.add(group);
  return group;
}

export function AmbientLight({ color = 0xffffff, intensity = 1, parent = null } = {}) {
  const light = new THREE.AmbientLight(color, intensity);

  if (parent) parent.add(light);
  return light;
}

export function DirectionalLight({ color = 0xffffff, intensity = 1, shadow = false, position = [1, 1, 1], target = [0, 0, 0], parent = null } = {}) {
  const light = new THREE.DirectionalLight(color, intensity);
  light.castShadow = shadow;
  light.position.set(...position);
  light.target.position.set(...target);

  light.add(light.target);
  if (parent) parent.add(light);
  return light;
}

export function Camera({ parent = null } = {}) {
  const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 1000);

  if (parent) parent.add(camera);
  return camera;
}

export function PBody(mass, shape, { linearDamping = 0.1, angularDamping = 0.2, type = CANNON.Body.DYNAMIC, offsetPos = [0, 0, 0], fixedRotation = false } = {}) {
  const body = new CANNON.Body({ mass, linearDamping, angularDamping, type, fixedRotation });
  body.addShape(shape, new CANNON.Vec3(...offsetPos));
  return body;
}

export function PBox({ size = [0.1, 0.1, 0.1], mass = 1, offsetPos = [0, 0, 0], fixedRotation = false } = {}) {
  size = size.map(val => val / 2);

  const shape = new CANNON.Box(new CANNON.Vec3(...size));
  return PBody(mass, shape, { offsetPos, fixedRotation });
}

export function PPlane({ mass = 1, offsetPos = [0, 0, 0], fixedRotation = false } = {}) {
  const shape = new CANNON.Plane();
  return PBody(mass, shape, { offsetPos, fixedRotation });
}

export function PCube({ size = 0.1, mass = 1, offsetPos = [0, 0, 0], fixedRotation = false } = {}) {
  return PBox({ size: [size, size, size], mass, offsetPos, fixedRotation });
}

export function PSphere({ radius = 0.1, mass = 1, offsetPos = [0, 0, 0], fixedRotation = false } = {}) {
  const shape = new CANNON.Sphere(radius);
  return PBody(mass, shape, { offsetPos, fixedRotation });
}

export function PCylinder({ rTop = 0.1, rBot = 0.1, height = 0.5, segments = 20, mass = 1, offsetPos = [0, 0, 0], fixedRotation = false } = {}) {
  const shape = new CANNON.Cylinder(rTop, rBot, height, segments);
  const quat = new CANNON.Quaternion();
  quat.setFromEuler(0, 0, Math.PI);
  shape.transformAllPoints(new CANNON.Vec3(), quat);

  return PBody(mass, shape, { offsetPos, fixedRotation });
}

export function PPill({ radius = 0.1, height = 0.1, segments = 32, mass = 1, offsetPos = [0, 0, 0], fixedRotation = false } = {}) {
  const cylinder = new CANNON.Cylinder(radius, radius, height - radius * 2, segments);
  const quat = new CANNON.Quaternion();
  quat.setFromEuler(0, 0, Math.PI);
  cylinder.transformAllPoints(new CANNON.Vec3(), quat);

  const sphere = new CANNON.Sphere(radius);

  const body = new CANNON.Body({ mass, linearDamping: 0.1, angularDamping: 0.2, fixedRotation });
  body.addShape(cylinder, new CANNON.Vec3(0, offsetPos[1], 0));
  body.addShape(sphere, new CANNON.Vec3(0, height / 2 - radius + offsetPos[1], 0));
  body.addShape(sphere, new CANNON.Vec3(0, -height / 2 + radius + offsetPos[1], 0));

  return body;
}
