import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const Loader = new GLTFLoader();

function Load(path, manager, { parent = null, scale = 1, position = [0, 0, 0], rotation = [0, 0, 0] } = {}) {
  Loader.load(path, (gltf) => {
    gltf.scene.scale.set(scale, scale, scale);
    gltf.scene.position.set(...position);
    gltf.scene.rotation.set(...rotation);

    // traverse to set depthwrite and stuff

    // animations

    if (parent) parent.add(gltf.scene);
    manager.submit(path, gltf.scene);
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
    this.models = {};
    this.percentage = 0;
    this.cb = cb;

    this.elem = document.getElementById(elemId);
    this.elem.classList.remove("d-none");

    this.tick();
  }
  logStatus = (path, l, t) => {
    this.total[path] = t;
    this.loaded[path] = l;
  }
  submit = (path, obj) => {
    this.models[path] = obj;
  }
  tick = () => {
    let l = Object.values(this.loaded).reduce((a, b) => a + b, 0);
    let t = Object.values(this.total).reduce((a, b) => a + b, 0);
    this.percentage = l / t * 100 || 0;

    if (this.elem) this.elem.innerText = `Loading (${this.percentage.toFixed(2)}%)`;

    if (this.percentage !== 100) {
      requestAnimationFrame(this.tick);
    } else {
      if (this.elem) this.elem.classList.add("d-none");
      if (this.cb) this.cb();
    }
  }
}

export { Load, Manager };
