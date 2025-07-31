import * as THREE from "three";
import { XRControllerModelFactory } from "three/addons/webxr/XRControllerModelFactory.js";
import { XRHandModelFactory } from 'three/addons/webxr/XRHandModelFactory.js';


const ModelFactory = new XRControllerModelFactory();
const HandFactory = new XRHandModelFactory();

let Controllers = [];
let ControllerModels = [];
let HandModels = [];
let Input = {
  left: {
    trigger: false,
    grip: false
  },
  right: {
    trigger: false,
    grip: false
  }
}

function Setup(parent, Renderer) {
  for (let i = 0; i < 2; i++) {
    Controllers[i] = Renderer.xr.getController(i);
    ControllerModels[i] = Renderer.xr.getControllerGrip(i);
    HandModels[i] = Renderer.xr.getHand(i);

    const name = i === 0 ? "left" : "right";
    Controllers[i].addEventListener("selectstart", () => {
      Input[name].trigger = true;
      parent.position.x += 0.1;
    });
    Controllers[i].addEventListener("selectend", () => {
      Input[name].trigger = false;
    });
    Controllers[i].addEventListener("squeezestart", () => {
      Input[name].grip = true;
    });
    Controllers[i].addEventListener("squeezeend", () => {
      Input[name].grip = false;
    });

    ControllerModels[i].add(ModelFactory.createControllerModel(ControllerModels[i]));
    HandModels[i].add(HandFactory.createHandModel(HandModels[i], "mesh"));

    parent.add(ControllerModels[i]);
    parent.add(HandModels[i]);
  }
}

export { Input, Setup };
