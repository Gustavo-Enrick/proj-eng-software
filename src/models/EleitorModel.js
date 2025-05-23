import Model from "../../libs/agentscript/src/Model.js";
import * as util from "../../libs/agentscript/src/utils.js";

class EleitorModel extends Model {
  Lulista;
  Bolsonarista;
  Arthurista;
  Eleitor;
  Velocidade;

  constructor(agentOptions, worldOptions = undefined) {
    super(worldOptions);

    this.Lulista = agentOptions.lulista;
    this.Bolsonarista = agentOptions.bolsonarista;
    this.Arthurista = agentOptions.arthurista;
    this.Eleitor = agentOptions.eleitor;
    this.Velocidade = agentOptions.velocidade;
  }

  //Inicializar raças
  setup() {
    //Declarando raças
    this.turtleBreeds("lula bolsonaro arthurVal cidadao");

    //Declarando mapa
    this.patchBreeds("wall");

    //Configurando seed do mapa
    this.patches.ask((p) => {
      if (util.randomFloat(10) < 0.01) {
        const neighbors = this.patches.inRadius(p, util.randomInt(10));
        neighbors.ask((n) => {
          n.setBreed(this.wall);
        });
      }
    });

    //Lula
    this.patches
      .filter((p) => !p.isBreed(this.wall))
      .nOf(this.Lulista)
      .ask((p) => {
        p.sprout(1, this.lula, (t) => {
          t.atEdge = "bounce";
          t.rotate(45);
        });
      });

    //Bolsonaro
    this.patches
      .filter((p) => !p.isBreed(this.wall))
      .nOf(this.Bolsonarista)
      .ask((p) => {
        p.sprout(1, this.bolsonaro, (t) => {
          t.atEdge = "bounce";
          t.rotate(45);
        });
      });

    //Arthur Val
    this.patches
      .filter((p) => !p.isBreed(this.wall))
      .nOf(this.Arthurista)
      .ask((p) => {
        p.sprout(1, this.arthurVal, (t) => {
          t.atEdge = "bounce";
          t.rotate(45);
        });
      });

    //Cidadao
    this.patches
      .filter((p) => !p.isBreed(this.wall))
      .nOf(this.Eleitor)
      .ask((p) => {
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

    this.arthurVal.ask((a) => {
      this.walkCandidato(a);
    });

    this.cidadao.ask((c) => {
      this.walkEleitor(c);
    });
  }

  //----------------------------------------------
  //Movimentação dos eleitores: cidadao
  walkEleitor(turtle) {
    this.colisionWall(turtle);

    turtle.forward(this.Velocidade);

    let candidato = null;

    //Está próximo do eleitor Lula?
    const closestLula = this.closestNeighbor(turtle, this.lula);
    if (
      closestLula &&
      turtle.distance(closestLula) <= 2 &&
      candidato === null
    ) {
      candidato = this.lula;
    }

    //Está próximo do eleitor Bolsonaro?
    const closestBolsonaro = this.closestNeighbor(turtle, this.bolsonaro);
    if (
      closestBolsonaro &&
      turtle.distance(closestBolsonaro) <= 2 &&
      candidato === null
    ) {
      candidato = this.bolsonaro;
    }

    //Está próximo do eleitor Bolsonaro?
    const closestArthurVal = this.closestNeighbor(turtle, this.arthurVal);
    if (
      closestArthurVal &&
      turtle.distance(closestArthurVal) <= 2 &&
      candidato === null
    ) {
      candidato = this.arthurVal;
    }

    //Se estiver próximo de um dos candidatos: converter este eleitor
    if (candidato !== null) {
      this.converterEleitor(turtle, candidato);
    } else {
      turtle.heading += util.randomCentered(30);
    }
  }

  //Movimentação dos candidatos: bolsonaro; lula
  walkCandidato(turtle) {
    this.colisionWall(turtle);

    turtle.forward(this.Velocidade);

    //Está próximo do Cidadão?
    const closestCidadao = this.closestNeighbor(turtle, this.cidadao);
    if (closestCidadao && turtle.distance(closestCidadao) <= 10) {
      //Quando próximo, direcionar candidato para o eleitor
      turtle.face(closestCidadao);
    } else {
      turtle.heading += util.randomCentered(30);
    }
  }

  //Colisao com a parede
  colisionWall(turtle) {
    while (this.wallClosest(turtle, 0)) turtle.rotate(-45);
  }

  //Verifica se está encostrando na borda do mapa ou na parede (wall)
  wallClosest(turtle, angle) {
    const patchLeft = turtle.patchLeftAndAhead(angle, 1);

    return (patchLeft && patchLeft.isBreed(this.wall)) || !patchLeft;
  }

  //Verifica se uma raça está perto de outra
  closestNeighbor(turtle, neighbor) {
    let closest = false;

    if (neighbor.length > 0) {
      closest = neighbor.minOneOf((t) => t.distance(turtle));
    }

    return closest;
  }

  //Adicionar valores no contador de convertidos
  converterEleitor(turtle, candidato) {
    turtle.hatch(1, candidato, (i) => turtle.die());

    switch (candidato) {
      case this.bolsonaro:
        this.Bolsonarista++;
        break;
      case this.lula:
        this.Lulista++;
        break;
      case this.arthurVal:
        this.Arthurista++;
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
      case this.arthurVal:
        return "blue";
      default:
        return "white";
    }
  }
}

export default EleitorModel;
