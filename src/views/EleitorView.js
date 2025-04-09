import * as util from "../../libs/agentscript/src/utils.js";
import TwoDraw from "../../libs/agentscript/src/TwoDraw.js";
import Animator from "../../libs/agentscript/src/Animator.js";
import GUI from "../../libs/agentscript/src/GUI.js";
import Model from "../models/EleitorModel.js";
import CronometroService from "../services/CronometroService.js";
import Color from "../../libs/agentscript/src/Color.js";

//Dimensões do mapa
const worldOpts = {
  minX: -100,
  maxX: 100,
  minY: -80,
  maxY: 80,
};

//Opções iniciais para a similuação
const agentOptions = {
  lulista: 1,
  bolsonarista: 1,
  arthurista: 1,
  eleitor: 100,
  velocidade: 0.5,
};

//Cores do mapa
const patchOptions = {
  wallColor: Color.rgbaToPixel(222, 184, 135), // Color.typedColor(222, 184, 135),
  backgroundColor: Color.rgbaToPixel(0, 0, 0), // Color.typedColor("black")
};

let model = new Model(agentOptions, worldOpts);
model.setup();

let cronometro = new CronometroService();

//Configurando visualização da simulação
const view = new TwoDraw(model, {
  div: "modelDiv",
  width: 1000,
  drawOptions: {
    patchesColor: (p) =>
      p.breed.name === "wall"
        ? patchOptions.wallColor
        : patchOptions.backgroundColor,
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
  -1, // -1 = passos infinitos
  60 // FPS
).stop();

//Configuração do menu lateral
const gui = new GUI({
  Lula: {
    monitor: [model, "Lulista"],
  },
  Bolsonaro: {
    monitor: [model, "Bolsonarista"],
  },
  ArthurVal: {
    monitor: [model, "Arthurista"],
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
  // Reiniciar: {
  //   button: () => {
  //     model.reset();
  //   }
  // }
});

//Injetando configurações
util.toWindow({ util, model, view, animation, gui });
