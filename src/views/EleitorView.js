import * as util from "../../libs/agentscript/src/utils.js";
import TwoDraw from "../../libs/agentscript/src/TwoDraw.js";
import Animator from "../../libs/agentscript/src/Animator.js";
import Model from "../models/EleitorModel.js";
import Color from "../../libs/agentscript/src/Color.js";

const worldOpts = {
  minX: -100,
  maxX: 100,
  minY: -70,
  maxY: 70,
};

const patchOptions = {
  wallColor: Color.rgbaToPixel(222, 184, 135),
  backgroundColor: Color.rgbaToPixel(0, 0, 0),
};

let model, view, animation;


//Configurações dos inputs de velocidade
const rangeInputL = document.getElementById("velocidadeRangeL");
const velocidadeSpanL = document.getElementById("velocidadeValorL");
rangeInputL.addEventListener("input", () => {
  velocidadeSpanL.textContent = parseFloat(rangeInputL.value).toFixed(1);
});
const rangeInputB = document.getElementById("velocidadeRangeB");
const velocidadeSpanB = document.getElementById("velocidadeValorB");
rangeInputB.addEventListener("input", () => {
  velocidadeSpanB.textContent = parseFloat(rangeInputB.value).toFixed(1);
});
const rangeInputA = document.getElementById("velocidadeRangeA");
const velocidadeSpanA = document.getElementById("velocidadeValorA");
rangeInputA.addEventListener("input", () => {
  velocidadeSpanA.textContent = parseFloat(rangeInputA.value).toFixed(1);
});
const rangeInputC = document.getElementById("velocidadeRangeC");
const velocidadeSpanC = document.getElementById("velocidadeValorC");
rangeInputC.addEventListener("input", () => {
  velocidadeSpanC.textContent = parseFloat(rangeInputC.value).toFixed(1);
});


//Configuração do botão de Reiniciar
const btnReiniciar = document.getElementById("btnReiniciar");
btnReiniciar.addEventListener("click", () => {
  if (animation) {
    animation.stop();
    animation = null;
  }

  model = null;
  if (view) {
    document.getElementById("modelDiv").innerHTML = "";
    view = null;
  }

  document.getElementById("modalResultado").style.display = "none";

  document.getElementById("monitorLula").textContent = "0";
  document.getElementById("monitorBolsonaro").textContent = "0";
  document.getElementById("monitorArthur").textContent = "0";
  document.getElementById("monitorCidadao").textContent = "0";
  document.getElementById("monitorTempo").textContent = "0";

  document.getElementById("formSimulacao").reset();

  document.getElementById("velocidadeValorL").textContent = "0.5";
  document.getElementById("velocidadeValorB").textContent = "0.5";
  document.getElementById("velocidadeValorA").textContent = "0.5";
  document.getElementById("velocidadeValorC").textContent = "0.5";
});

//Comfiguração do botaão de Iniciar
document.getElementById("formSimulacao").addEventListener("submit", (e) => {
  e.preventDefault();

  const modalBox = document.getElementById("modalResultado");
  modalBox.style.display = "none";

  const formData = new FormData(e.target);
  const agentOptions = Object.fromEntries(
    [...formData.entries()].map(([key, value]) => [key, parseFloat(value)])
  );

  if (animation) animation.stop();

  model = new Model(agentOptions, worldOpts);
  model.setup();

  const container = document.getElementById("modelDiv");
  container.innerHTML = "";

  view = new TwoDraw(model, {
    div: "modelDiv",
    width: container.clientWidth,
    height: container.clientHeight,
    drawOptions: {
      patchesColor: () => patchOptions.backgroundColor,
      turtlesSize: 3,
      turtlesShape: "person",
      turtlesColor: (t) => model.coloring(t),
    },
  });

  animation = new Animator(
    () => {
      model.step();
      view.draw();
      atualizarMonitor();

      if (model.Timer.Segundos == agentOptions.duracao) {
        animation.stop();
        salvarResultadoFinal();
      }
    },
    -1,
    30
  ).start();

  util.toWindow({ util, model, view, animation });
});

//Atualzação nos valores quantitativos em tempo real
function atualizarMonitor() {
  if (!model) return;

  document.getElementById("monitorLula").textContent =
    model.turtles.breeds.lula.length;
  document.getElementById("monitorBolsonaro").textContent =
    model.turtles.breeds.bolsonaro.length;
  document.getElementById("monitorArthur").textContent =
    model.turtles.breeds.arthurVal.length;
  document.getElementById("monitorCidadao").textContent =
    model.turtles.breeds.cidadao.length;
  document.getElementById("monitorTempo").textContent = Math.floor(
    model.Timer.Segundos
  );
}

//Resultado das simulações
const historicoResultados = [];
function salvarResultadoFinal() {
  const agentes = model.turtles;
  const contagem = {
    Lula: agentes.breeds.lula.length,
    Bolsonaro: agentes.breeds.bolsonaro.length,
    Arthur: agentes.breeds.arthurVal.length,
  };

  const vencedor = Object.entries(contagem).reduce((a, b) =>
    b[1] > a[1] ? b : a
  )[0];

  const resultado = {
    timestamp: new Date().toLocaleTimeString(),
    vencedor,
    ...contagem,
  };

  retornarQtEleitor(resultado);
  historicoResultados.push(resultado);
  renderizarResultados();
}

function retornarQtEleitor(res) {
  if (res.vencedor == "Lula") return res.Lula;
  else if (res.vencedor == "Bolsonaro") return res.Bolsonaro;
  else if (res.vencedor == "Arthur") return res.Arthur;
  return 0;
}

function renderizarResultados() {
  const lista = document.getElementById("resultadosLista");
  lista.innerHTML = "";

  if (historicoResultados.length === 0) return;

  const ultimoResultado = historicoResultados[historicoResultados.length - 1];

  let cor = "#333";
  if (ultimoResultado.vencedor === "Lula") cor = "crimson";
  else if (ultimoResultado.vencedor === "Bolsonaro") cor = "green";
  else if (ultimoResultado.vencedor === "Arthur") cor = "royalblue";

  historicoResultados
    .slice()
    .reverse()
    .forEach((res) => {
      const li = document.createElement("li");
      li.textContent = `[${
        res.timestamp
      }] Vencedor: ${res.vencedor.toUpperCase()} | ${retornarQtEleitor(
        res
      )} no total`;
      lista.appendChild(li);
    });

  const modalBox = document.getElementById("modalResultado");
  const modalMensagem = document.getElementById("modalMensagem");

  modalBox.style.borderColor = cor;

  modalMensagem.innerHTML = `
    <div class="modal-header" style="background-color: ${cor};">
      ${ultimoResultado.vencedor} ganhou as eleições!
      <button id="modalFechar" title="Fechar">&times;</button>
    </div>
    <div class="modal-body">
      <div class="linha">
        <span>Quantidade Total:</span>
        <span class="valor" style="color: ${cor};">${retornarQtEleitor(
    ultimoResultado
  )}</span>
      </div>
      <div class="linha">
        <span>Hora de conclusão:</span>
        <span class="valor">${ultimoResultado.timestamp}</span>
      </div>
      <div class="linha">
        <span>Tempo:</span>
        <span class="valor">${Math.floor(model.Timer.Segundos)} s</span>
      </div>
    </div>
  `;

  modalBox.style.display = "block";

  // Remove event listeners anteriores para evitar múltiplos
  const btnFechar = document.getElementById("modalFechar");
  btnFechar.onclick = () => {
    modalBox.style.display = "none";
  };
}
