import * as util from "../../node_modules/agentscript/src/utils.js";
import TwoDraw from "../../node_modules/agentscript/src/TwoDraw.js";
import Animator from "../../node_modules/agentscript/src/Animator.js";
import GUI from "../../node_modules/agentscript/src/GUI.js";
import Model from "../models/EleitorModel.js";
import CronometroService from "../services/CronometroService.js";
import Color from "../../node_modules/agentscript/src/Color.js";

const worldOpts = {
  minX: -100,
  maxX: 100,
  minY: -80,
  maxY: 80,
};

const agentOptions = {
  lulista: 1,
  bolsonarista: 1,
  eleitor: 100,
  velocidade: 0.5,
};

const patchOptions = {
  wallColor: Color.typedColor(222, 184, 135),
  backgroundColor: Color.typedColor("black")
}

const model = new Model(agentOptions, worldOpts);
model.setup();

const cronometro = new CronometroService();

const view = new TwoDraw(model, {
  div: "modelDiv",
  width: 1000,
  drawOptions: {
    patchesColor: (p) =>
      p.breed.name === "walls" ? patchOptions.wallColor : patchOptions.backgroundColor,
    turtlesSize: 3,
    turtlesShape: "person",
    turtlesColor: (t) => model.coloring(t),
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
    slider: [0.5, [0.1, 1, 0.1]],
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
