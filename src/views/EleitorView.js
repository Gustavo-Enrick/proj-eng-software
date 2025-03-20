import * as util from "https://code.agentscript.org/src/utils.js";
import TwoDraw from "https://code.agentscript.org/src/TwoDraw.js";
import Animator from "https://code.agentscript.org/src/Animator.js";
import GUI from "https://code.agentscript.org/src/GUI.js";
import Model from "../models/EleitorModel.js";
import CronometroService from "../services/CronometroService.js";

const worldOpts = {
  minX: -100,
  maxX: 100,
  minY: -80,
  maxY: 95,
};

const agentOptions = {
  lulista: 1,
  bolsonarista: 1,
  eleitor: 100,
  velocidade: 0.5,
};

const model = new Model(agentOptions, worldOpts);
model.setup();

const cronometro = new CronometroService();

const view = new TwoDraw(model, {
  div: "modelDiv",
  width: 1000,
  drawOptions: {
    turtlesSize: 3,
    turtlesShape: "person",
    turtlesColor: (t) => model.coloring(t), //(t) => (model.coloring(t.breed.name)),//(t) => (t.breed.name === "bolsonaro" ? "green" : "red"),
    patchesColor: "black",
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
  Lula: {
    monitor: [model, "Lulista"],
  },
  Bolsonaro: {
    monitor: [model, "Bolsonarista"],
  },
  Cidadao: {
    monitor: [model, "Eleitor"],
  },
  Velocidade: {
    slider: [1, [0.5, 3, 0.5]],
    cmd: (val) => (model.Velocidade = val),
  },
  Tempo: {
    monitor: [cronometro, "Segundos"],
  },
  Parar: {
    switch: true,
    cmd: (val) => {
      if (val) {
        animation.stop();
        cronometro.pauseCron();
      } else {
        animation.start();
        cronometro.startCron();
      }
    },
  },
});

util.toWindow({ util, model, view, animation, gui });
