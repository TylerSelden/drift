import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import * as Objects from "./objects.js";

const Loader = new GLTFLoader();

function Load(path, manager, { parent = null, scale = 1, pos = [0, 0, 0], quat = [0, 0, 0, 1], offsetPos = [0, 0, 0], offsetQuat = [0, 0, 0, 1] } = {}) {
  manager.register(path);
  Loader.load(path, (gltf) => {
    gltf.scene.scale.set(scale, scale, scale);
    gltf.scene.position.set(...offsetPos);
    gltf.scene.quaternion.set(...offsetQuat);

    const group = Objects.VGroup({ children: [gltf.scene] });

    group.position.set(...pos);
    group.quaternion.set(...quat);


    if (parent) parent.add(group);
    manager.submit(path, group);
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
  register = (path) => {
    this.models[path] = null;
  }
  submit = (path, obj) => {
    this.models[path] = obj;
    if (Object.values(this.models).every(v => v != null)) {
      if (this.elem) this.elem.classList.add("d-none");
      if (this.cb) this.cb();
    }
  }
  tick = () => {
    let l = Object.values(this.loaded).reduce((a, b) => a + b, 0);
    let t = Object.values(this.total).reduce((a, b) => a + b, 0);
    this.percentage = l / t * 100 || 0;

    if (this.elem) this.elem.innerText = `Loading (${this.percentage.toFixed(2)}%)`;

    if (this.percentage !== 100) {
      requestAnimationFrame(this.tick);
    } else {
      if (this.elem) this.elem.innerText = "Processing...";
    }
  }
}

export { Load, Manager };
