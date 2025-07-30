import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const Loader = new GLTFLoader();

function Load(path, manager, parent, { scale = 1, position = [0, 0, 0] } = {}) {
  Loader.load(path, (gltf) => {
    gltf.scene.scale.set(scale, scale, scale);
    gltf.scene.position.set(...position);

    // traverse to set depthwrite and stuff

    // animations

    if (parent) parent.add(gltf.scene);
  }, (xhr) => {
    manager.logStatus(path, xhr.loaded, xhr.total);
  }, (err) => {
    throw new Error(err);
  });
}

class Manager {
  constructor({ elemId = "loading", cb = null } = {}) {
    this.loaded = {};
    this.total = {};
    this.percentage = 0;
    this.cb = cb;

    this.elem = document.getElementById(elemId);
    this.elem.classList.remove("hidden");

    this.tick();
  }
  logStatus = (path, l, t) => {
    this.total[path] = t;
    this.loaded[path] = l;
  }
  tick = () => {
    let l = Object.values(this.loaded).reduce((a, b) => a + b, 0);
    let t = Object.values(this.total).reduce((a, b) => a + b, 0);
    this.percentage = l / t * 100 || 0;

    if (this.elem) this.elem.innerText = `Loading (${this.percentage.toFixed(2)}%)`;

    if (this.percentage !== 100) {
      requestAnimationFrame(this.tick);
    } else {
      if (this.elem) this.elem.classList.add("hidden");
      if (this.cb) this.cb();
    }
  }
}

export { Load, Manager };
