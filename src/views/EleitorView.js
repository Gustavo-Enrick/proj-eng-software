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

document.getElementById("btnSobre").addEventListener("click", () => {
  document.getElementById("modalSobre").style.display = "flex";
});
document.getElementById("fecharModalSobre").addEventListener("click", () => {
  document.getElementById("modalSobre").style.display = "none";
});

window.addEventListener("click", (e) => {
  const modal = document.getElementById("modalSobre");
  if (e.target === modal) modal.style.display = "none";
});

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

  audio.pause();

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

//Configuração do botão de Iniciar
document.getElementById("formSimulacao").addEventListener("submit", (e) => {
  e.preventDefault();
  audio.pause();

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

      const contagem = {
        Lula: model.turtles.breeds.lula.length,
        Bolsonaro: model.turtles.breeds.bolsonaro.length,
        Arthur: model.turtles.breeds.arthurVal.length,
      };

      if (
        model.Timer.Segundos == agentOptions.duracao &&
        estaEmpatado(contagem)
      ) {
        agentOptions.duracao += 10;
      } else if (model.Timer.Segundos == agentOptions.duracao) {
        animation.stop();
        salvarResultadoFinal();
      }
    },
    -1,
    30
  ).start();

  util.toWindow({ util, model, view, animation });
});

//Verifica o empate entre os eleitores
function estaEmpatado(contagem) {
  const valores = Object.values(contagem);
  const max = Math.max(...valores);
  const lideres = Object.entries(contagem).filter(
    ([_, v]) => v === max && v !== 0
  );
  return lideres.length > 1; // Mais de um com o maior valor
}

//Atualização nos valores quantitativos em tempo real
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

//Tocar música do candidato vencedor
const audio = new Audio();
function tocarMusicaCandidato(resultado) {
  let inicio = 0;
  let fim = 0;
  if (resultado === "Lula") {
    audio.src = "./assets/lula.mp3";
  } else if (resultado === "Bolsonaro") {
    audio.src = "./assets/bolsonaro.mp3";
  } else if (resultado === "Arthur") {
    audio.src = "./assets/arthur.mp3";
    inicio = 55;
    fim = 67;
  } else {
    audio.src = "./assets/empate.mp3";
  }

  audio.currentTime = inicio;

  audio.play().catch((err) => {
    console.error("Erro ao tocar música:", err);
  });
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

  let vencedor = Object.entries(contagem).reduce((a, b) =>
    b[1] > a[1] ? b : a
  )[0];

  if (contagem.Lula == 0 && contagem.Bolsonaro == 0 && contagem.Arthur == 0)
    vencedor = "Ninguém";

  const resultado = {
    timestamp: new Date().toLocaleTimeString(),
    vencedor,
    ...contagem,
  };

  tocarMusicaCandidato(vencedor);
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

//Modal de Resultado
function renderizarResultados() {
  const lista = document.getElementById("resultadosLista");
  lista.innerHTML = "";

  if (historicoResultados.length === 0) return;

  const ultimoResultado = historicoResultados[historicoResultados.length - 1];

  let cor = "gray";
  if (ultimoResultado.vencedor === "Lula") cor = "red";
  else if (ultimoResultado.vencedor === "Bolsonaro") cor = "green";
  else if (ultimoResultado.vencedor === "Arthur") cor = "blue";

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
    audio.pause();
  };
}
