import * as THREE from "three";

function Box({ size = [0.1, 0.1, 0.1], color = 0xff00ff, position = [0, 0, 0], parent = null } = {}) {
  const geo = new THREE.BoxGeometry(size[0], size[1], size[2]);
  const mat = new THREE.MeshStandardMaterial({ color });
  const box = new THREE.Mesh(geo, mat);
  box.position.set(...position);

  if (parent) parent.add(box);
  return box;
}

function Cube({ size = 0.1, color = 0xff00ff, position = [0, 0, 0], parent = null } = {}) {
  const cube = Box({ size: [size, size, size], color, position });
  cube.position.set(...position);

  if (parent) parent.add(cube);
  return cube;
}

function AmbientLight({ color = 0xffffff, intensity = 1, parent = null } = {}) {
  const light = new THREE.AmbientLight(color, intensity);

  if (parent) parent.add(light);
  return light;
}

function DirectionalLight({ color = 0xffffff, intensity = 1, shadow = false, position = [1, 1, 1], target = [0, 0, 0], parent = null } = {}) {
  const light = new THREE.DirectionalLight(color, intensity);
  light.castShadow = shadow;
  light.position.set(...position);
  light.target.position.set(...target);

  light.add(light.target);
  if (parent) parent.add(light);
  if (parent) parent.add(light.target);
  return light;
}

function Camera({ parent = null } = {}) {
  const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 1000);

  if (parent) parent.add(camera);
  return camera;
}

function Group({ children = [], parent = null } = {}) {
  const group = new THREE.Group();
  for (const child of children) group.add(child);

  if (parent) parent.add(group);
  return group;
}


export { Box, Cube, AmbientLight, DirectionalLight, Camera, Group };
