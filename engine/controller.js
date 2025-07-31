import * as THREE from "three";
import { XRControllerModelFactory } from "three/addons/webxr/XRControllerModelFactory.js";
import { XRHandModelFactory } from 'three/addons/webxr/XRHandModelFactory.js';


const ModelFactory = new XRControllerModelFactory();
const HandFactory = new XRHandModelFactory();

let Controllers = [];
let ControllerModels = [];
let HandModels = [];
let Input;
resetInput();

function Setup(parent, Renderer) {
  for (let i = 0; i < 2; i++) {
    Controllers[i] = Renderer.xr.getController(i);
    ControllerModels[i] = Renderer.xr.getControllerGrip(i);
    HandModels[i] = Renderer.xr.getHand(i);

    const hand = i === 0 ? "left" : "right";
    Controllers[i].addEventListener("selectstart", () => {
      Input[hand].trigger = true;
      parent.position.x += 0.1;
    });
    Controllers[i].addEventListener("selectend", () => {
      Input[hand].trigger = false;
    });
    Controllers[i].addEventListener("squeezestart", () => {
      Input[hand].grip = true;
    });
    Controllers[i].addEventListener("squeezeend", () => {
      Input[hand].grip = false;
    });

    ControllerModels[i].add(ModelFactory.createControllerModel(ControllerModels[i]));
    HandModels[i].add(HandFactory.createHandModel(HandModels[i], "mesh"));

    parent.add(ControllerModels[i]);
    parent.add(HandModels[i]);
  }
}

function resetInput() {
  Input = {
    left: {
      trigger: false,
      grip: false,
      joystick: { x: 0, y: 0 }
    },
    right: {
      trigger: false,
      grip: false,
      joystick: { x: 0, y: 0 }
    }
  }
  return Input;
}

function PollGamepad(Renderer, Player) {
  const session = Renderer.xr.getSession();
  if (!session) return resetInput();

  session.inputSources.forEach((src) => {
    if (!src.gamepad) return resetInput();

    const hand = src.handedness;
    const gp = src.gamepad;

    if (gp.axes.length > 0) {
      Input[hand].joystick.x = gp.axes[2];
      Input[hand].joystick.y = gp.axes[3];
    }
  });

  return Input;
}

export { Setup, PollGamepad };
