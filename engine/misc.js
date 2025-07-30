import * as THREE from "three";

function Box({ size = [0.1, 0.1, 0.1], color = 0xff00ff, position = [0, 0, 0], parent = null } = {}) {
  const geo = new THREE.BoxGeometry(size[0], size[1], size[2]);
  const mat = new THREE.MeshBasicMaterial({ color });
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


export { Box, Cube, Camera, Group };
