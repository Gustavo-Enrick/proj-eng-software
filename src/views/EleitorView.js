import * as util from "https://code.agentscript.org/src/utils.js";
import TwoDraw from "https://code.agentscript.org/src/TwoDraw.js";
import Animator from "https://code.agentscript.org/src/Animator.js";
import Model from "../models/EleitorModel.js";
import GUI from 'https://code.agentscript.org/src/GUI.js'

const worldOpts = {
  minX: -100,
  maxX: 100,
  minY: -80,
  maxY: 100,
};

const model = new Model(worldOpts); // no arguments => use default world options
model.setup();

const view = new TwoDraw(model, {
  div: "modelDiv",
  width: 1000,
  drawOptions: {
    turtlesSize: 5,
    turtlesShape: "person",
    turtlesColor: (t) => model.coloring(t),//(t) => (model.coloring(t.breed.name)),//(t) => (t.breed.name === "bolsonaro" ? "green" : "red"),
    patchesColor: "black"
  },
});

const animation = new Animator(
  () => {
    model.step();
    view.draw();
  },
  -1, // -1 = run infinite
  60 // fps
).stop();

const gui = new GUI({
  Tempo: {
    monitor: [model,'Segundos']
  },
  Parar: {
    switch: true,
    cmd: val => { if (val) { animation.stop(); model.pauseCron(); } else { animation.start(); model.startCron(); } },
},
})

util.toWindow({ util, model, view, animation, gui });
