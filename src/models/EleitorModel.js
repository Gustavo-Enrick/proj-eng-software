import Model from "../../libs/agentscript/src/Model.js";
import * as util from "../../libs/agentscript/src/utils.js";
import CronometroService from "../services/CronometroService.js";

class EleitorModel extends Model {
  nOfLula;
  nOfBolsonaro;
  nOfArthur;
  nOfCidadao;

  VelLula;
  VelBolsonaro;
  VelArthur;
  VelCidadao;

  TxConversaoLula;
  TxConversaoBolsonaro;
  TxConversaoArthur;

  Timer;
  Duracao;

  constructor(agentOptions, worldOptions = undefined) {
    super(worldOptions);

    this.nOfLula = agentOptions.nOfLula;
    this.nOfBolsonaro = agentOptions.nOfBolsonaro;
    this.nOfArthur = agentOptions.nOfArthur;
    this.nOfCidadao = agentOptions.nOfCidadao;

    this.VelLula = agentOptions.velLula;
    this.VelBolsonaro = agentOptions.velBolsonaro;
    this.VelArthur = agentOptions.velArthur;
    this.VelCidadao = agentOptions.velCidadao;

    this.TxConversaoLula = agentOptions.txConversaoLula;
    this.TxConversaoBolsonaro = agentOptions.txConversaoBolsonaro;
    this.TxConversaoArthur = agentOptions.txConversaoArthur;

    console.log(this.TxConversaoLula);
    console.log(this.TxConversaoBolsonaro);
    console.log(this.TxConversaoArthur);

    this.Timer = new CronometroService();
    this.Duracao = agentOptions.duracao;
  }

  //Inicializar raças
  //----------------------------------------------------------------------------------------
  setup() {
    //Declarando raças
    this.turtleBreeds("lula bolsonaro arthurVal cidadao");

    //Lula
    this.patches.nOf(this.nOfLula).ask((p) => {
      p.sprout(1, this.lula, (t) => {
        t.atEdge = "bounce";
        t.rotate(45);
      });
    });

    //Bolsonaro
    this.patches.nOf(this.nOfBolsonaro).ask((p) => {
      p.sprout(1, this.bolsonaro, (t) => {
        t.atEdge = "bounce";
        t.rotate(45);
      });
    });

    //Arthur Val
    this.patches.nOf(this.nOfArthur).ask((p) => {
      p.sprout(1, this.arthurVal, (t) => {
        t.atEdge = "bounce";
        t.rotate(45);
      });
    });

    //Cidadao
    this.patches.nOf(this.nOfCidadao).ask((p) => {
      p.sprout(1, this.cidadao, (t) => {
        t.atEdge = "bounce";
        t.rotate(45);
      });
    });
  }
  //----------------------------------------------------------------------------------------

  //Configuração de movimentação
  //----------------------------------------------------------------------------------------
  step() {
    this.Timer.startCron();

    this.bolsonaro.ask((b) => {
      b.forward(this.VelBolsonaro);
      this.walkCandidato(b);
    });

    this.lula.ask((l) => {
      l.forward(this.VelLula);
      this.walkCandidato(l);
    });

    this.arthurVal.ask((a) => {
      a.forward(this.VelArthur);
      this.walkCandidato(a);
    });

    this.cidadao.ask((c) => {
      c.forward(this.VelCidadao);
      this.walkEleitor(c);
    });
  }
  //----------------------------------------------------------------------------------------

  //Movimentação dos eleitores: cidadao
  //----------------------------------------------------------------------------------------
  walkEleitor(turtle) {
    this.colisionWall(turtle);

    let candidato = null;
    const closestLula = this.closestNeighbor(turtle, this.lula);
    const closestBolsonaro = this.closestNeighbor(turtle, this.bolsonaro);
    const closestArthurVal = this.closestNeighbor(turtle, this.arthurVal);

    //Está próximo do eleitor Lula?
    if (
      turtle.breed !== this.lula &&
      closestLula &&
      turtle.distance(closestLula) <= 2
    ) {
      candidato = this.lula;
    }
    //Está próximo do eleitor Bolsonaro?
    if (
      turtle.breed !== this.bolsonaro &&
      closestBolsonaro &&
      turtle.distance(closestBolsonaro) <= 2
    ) {
      candidato = this.bolsonaro;
    }
    //Está próximo do eleitor Bolsonaro?
    if (
      turtle.breed !== this.arthurVal &&
      closestArthurVal &&
      turtle.distance(closestArthurVal) <= 2
    ) {
      candidato = this.arthurVal;
    }

    //Se estiver próximo de um dos candidatos: converter este eleitor
    if (candidato !== null && this.cidadao.length > 0) {
      let conversao = util.randomInt(101);

      let conversaoCandidato = this.retornarTaxaConversao(candidato); // * 0.1;

      if (conversao <= conversaoCandidato && conversaoCandidato > 0) {
        this.converterEleitor(turtle, candidato);
      }
    } else {
      turtle.heading += util.randomCentered(30);
    }

    candidato = null;
  }
  //----------------------------------------------------------------------------------------

  //Movimentação dos candidatos: bolsonaro; lula
  //----------------------------------------------------------------------------------------
  walkCandidato(turtle) {
    this.colisionWall(turtle);

    //Está próximo do Cidadão?
    const closestCidadao = this.closestNeighbor(turtle, this.cidadao);
    if (closestCidadao && turtle.distance(closestCidadao) <= 10) {
      //Quando próximo, direcionar candidato para o eleitor
      turtle.face(closestCidadao);
    } else {
      turtle.heading += util.randomCentered(30);
    }

    let candidato = null;
    const closestLula = this.closestNeighbor(turtle, this.lula);
    const closestBolsonaro = this.closestNeighbor(turtle, this.bolsonaro);
    const closestArthurVal = this.closestNeighbor(turtle, this.arthurVal);

    //Está próximo do eleitor Lula?
    if (
      turtle.breed !== this.lula &&
      closestLula &&
      turtle.distance(closestLula) <= 2
    ) {
      candidato = this.lula;
    }

    //Está próximo do eleitor Bolsonaro?
    if (
      turtle.breed !== this.bolsonaro &&
      closestBolsonaro &&
      turtle.distance(closestBolsonaro) <= 2
    ) {
      candidato = this.bolsonaro;
    }

    //Está próximo do eleitor Arthur?
    if (
      turtle.breed !== this.arthurVal &&
      closestArthurVal &&
      turtle.distance(closestArthurVal) <= 2
    ) {
      candidato = this.arthurVal;
    }

    //Se estiver próximo de um dos candidatos: converter este eleitor
    if (candidato !== null && this.cidadao.length <= 0) {
      if (this.permitirReconversao(candidato, turtle)) {
        this.converterEleitor(turtle, candidato);
      }
    } else {
      if (this.permitirReconversao(this.cidadao, turtle) && (this.Timer.Segundos >= this.Duracao / 4) && (this.Timer.Segundos <= this.Duracao / 2)) {
        this.converterEleitor(turtle, this.cidadao);
      }

      turtle.heading += util.randomCentered(30);
    }
  }
  //----------------------------------------------------------------------------------------

  //Funções para conversão entre raças
  //----------------------------------------------------------------------------------------
  retornarTaxaConversao(candidato) {
    if (candidato === this.lula) return this.TxConversaoLula;

    if (candidato === this.bolsonaro) return this.TxConversaoBolsonaro;

    if (candidato === this.arthurVal) return this.TxConversaoArthur;

    return 0;
  }

  //Probabilidade de permitir a reconversão
  permitirReconversao(candidato, turtle) {
    let permitir = false;
    let conversao = util.randomInt(101);

    if (conversao == 100 && turtle.breed !== candidato) {
      permitir = true;
    }

    return permitir;
  }

  permitirConversao2(candidato, turtle) {
    let permitir = false;
    let conversao = util.randomInt(2);

    if (conversao == 1) {
      permitir = true;
    }

    return permitir;
  }

  //Capturar porcentagem de conversão
  retornarTaxaReconversao(candidato, turtle) {
    let taxaReconversao = 0;
    let taxaConversaoCandidato = this.retornarTaxaConversao(candidato);
    let taxaConversaoTurtle = this.retornarTaxaConversao(turtle.breed);

    taxaReconversao = taxaConversaoCandidato - taxaConversaoTurtle;

    if (taxaReconversao < 0) {
      return -1;
    }

    return taxaReconversao;
  }

  //Converter raça e adicionar valores no contador de convertidos
  converterEleitor(turtle, candidato) {
    turtle.hatch(1, candidato, turtle.die());

    this.nOfBolsonaro = this.bolsonaro.length;

    this.nOfLula = this.lula.length;

    this.nOfArthur = this.arthurVal.length;

    this.nOfCidadao = this.cidadao.length;
  }
  //----------------------------------------------------------------------------------------

  //Colisao com a parede
  //----------------------------------------------------------------------------------------
  colisionWall(turtle) {
    while (this.wallClosest(turtle, 0)) turtle.rotate(-45);
  }
  //Verifica se está encostrando na borda do mapa
  wallClosest(turtle, angle) {
    const patchLeft = turtle.patchLeftAndAhead(angle, 1);

    return !patchLeft;
  }
  //----------------------------------------------------------------------------------------

  //Verifica se uma raça está perto de outra
  //----------------------------------------------------------------------------------------
  closestNeighbor(turtle, neighbor) {
    let closest = false;

    if (neighbor.length > 0) {
      closest = neighbor.minOneOf((t) => t.distance(turtle));
    }

    return closest;
  }
  //----------------------------------------------------------------------------------------

  //Colorir raças
  coloring(turtle) {
    switch (turtle.breed) {
      case this.bolsonaro:
        return "green";
      case this.lula:
        return "red";
      case this.cidadao:
        return "gray";
      case this.arthurVal:
        return "blue";
      default:
        return "white";
    }
  }
}

export default EleitorModel;
