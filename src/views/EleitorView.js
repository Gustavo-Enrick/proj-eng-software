import * as util from "https://code.agentscript.org/src/utils.js";
import TwoDraw from "https://code.agentscript.org/src/TwoDraw.js";
import Animator from "https://code.agentscript.org/src/Animator.js";
import Model from "../models/EleitorModel.js";

const worldOpts = {
  minX: -20,
  maxX: 20,
  minY: -20,
  maxY: 20,
};

const model = new Model(worldOpts); // no arguments => use default world options
model.setup();

const view = new TwoDraw(model, {
  div: "modelDiv",
  patchSize: 20,
  width: 600,
  drawOptions: {
    turtlesSize: 2,
    turtlesShape: "person",
    turtlesColor: (t) => model.coloring(t),//(t) => (model.coloring(t.breed.name)),//(t) => (t.breed.name === "bolsonaro" ? "green" : "red"),
    patchesColor: "black",
  },
});

const anim = new Animator(
  () => {
    model.step();
    view.draw();
  },
  -1, // -1 = run infinite
  60 // fps
);

util.toWindow({ util, model, view, anim });