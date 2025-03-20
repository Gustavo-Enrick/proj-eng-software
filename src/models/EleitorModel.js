import Model from "https://code.agentscript.org/src/Model.js";
import * as util from "https://code.agentscript.org/src/utils.js";

class EleitorModel extends Model {
  Lulista;
  Bolsonarista;
  Eleitor;
  Velocidade;

  constructor(agentOptions, worldOptions = undefined) {
    super(worldOptions);

    this.Lulista = agentOptions.lulista;
    this.Bolsonarista = agentOptions.bolsonarista;
    this.Eleitor = agentOptions.eleitor;
    this.Velocidade = agentOptions.velocidade;
  }

  //Inicializar raças
  setup() {
    this.turtleBreeds("lula bolsonaro cidadao");

    //Lula
    this.patches.nOf(this.Lulista).ask((p) => {
      p.sprout(1, this.lula, (t) => {
        t.atEdge = "bounce";
        t.rotate(45);
      });
    });

    //Bolsonaro
    this.patches.nOf(this.Bolsonarista).ask((p) => {
      p.sprout(1, this.bolsonaro, (t) => {
        t.atEdge = "bounce";
        t.rotate(45);
      });
    });

    //Cidadao
    this.patches.nOf(this.Eleitor).ask((p) => {
      p.sprout(1, this.cidadao, (t) => {
        t.atEdge = "bounce";
        t.rotate(45);
      });
    });
  }

  //Configuração de movimentação
  step() {
    this.bolsonaro.ask((b) => {
      this.walkCandidato(b);
    });

    this.lula.ask((l) => {
      this.walkCandidato(l);
    });

    this.cidadao.ask((c) => {
      this.walkEleitor(c);
    });
  }

  //Movimentação dos eleitores: cidadao
  walkEleitor(turtle) {
    let candidato = null;

    //Está próximo do Lula?
    const closestLula = this.closestNeighbor(turtle, this.lula);
    if (
      closestLula &&
      turtle.distance(closestLula) <= 2 &&
      candidato === null
    ) {
      candidato = this.lula;
    }

    //Está próximo do Bolsonaro?
    const closestBolsonaro = this.closestNeighbor(turtle, this.bolsonaro);
    if (
      closestBolsonaro &&
      turtle.distance(closestBolsonaro) <= 2 &&
      candidato === null
    ) {
      candidato = this.bolsonaro;
    }

    //Se estiver próximo de um dos candidatos: converter este eleitor
    if (candidato !== null) {
      turtle.hatch(1, candidato, (i) => turtle.die());
      this.converterEleitor(candidato);
    } else {
      turtle.heading += util.randomCentered(30);
    }

    turtle.forward(this.Velocidade);
  }

  //Movimentação dos candidatos: bolsonaro; lula
  walkCandidato(turtle) {
    //Está próximo do Cidadão?
    const closestCidadao = this.closestNeighbor(turtle, this.cidadao);

    if (closestCidadao && turtle.distance(closestCidadao) <= 2) {
      const cidadaoHeading = closestCidadao.heading;
      turtle.heading = cidadaoHeading * -1;
    } else {
      turtle.heading += util.randomCentered(30);
    }

    turtle.forward(this.Velocidade);
  }

  //verifica se uma raça está perto de outra
  closestNeighbor(turtle, neighbor) {
    let closest = false;

    if (neighbor.length > 0) {
      closest = neighbor.minOneOf((t) => t.distance(turtle));
    }

    return closest;
  }

  //Adicionar valores no contador de convertidos
  converterEleitor(candidato) {
    switch (candidato) {
      case this.bolsonaro:
        this.Bolsonarista++;
        break;
      case this.lula:
        this.Lulista++;
        break;
      default:
        break;
    }

    this.Eleitor--;
  }

  //Colorir raças
  coloring(turtle) {
    switch (turtle.breed) {
      case this.bolsonaro:
        return "green";
      case this.lula:
        return "red";
      case this.cidadao:
        return "gray";
      default:
        return "white";
    }
  }
}

export default EleitorModel;
