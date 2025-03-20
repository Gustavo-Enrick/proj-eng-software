import Model from "../../node_modules/agentscript/src/Model.js";
import * as util from "../../node_modules/agentscript/src/utils.js";

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

    //Inicializando propriedades
    this.lula.setDefault("turn", +1);
    this.bolsonaro.setDefault("turn", +1);
    this.cidadao.setDefault("turn", -1);

    //Inicializando mapa
    this.patchBreeds("walls");

    this.patches.ask((p) => {
      if (util.randomFloat(3) < 0.01) {
        const neighbors = this.patches.inRadius(p, util.randomFloat(3));
        neighbors.ask((n) => {
          n.setBreed(this.walls);
        });
      }
    });

    //Lula
    this.patches.filter(p => !p.isBreed(this.walls)).nOf(this.Lulista).ask((p) => {
      p.sprout(1, this.lula, (t) => {
        t.atEdge = "bounce";
        t.rotate(45);
        t.face(p.neighbors4.oneOf());
      });
    });

    //Bolsonaro
    this.patches.filter(p => !p.isBreed(this.walls)).nOf(this.Bolsonarista).ask((p) => {
      p.sprout(1, this.bolsonaro, (t) => {
        t.atEdge = "bounce";
        t.rotate(45);
      });
    });

    //Cidadao
    this.patches.filter(p => !p.isBreed(this.walls)).nOf(this.Eleitor).ask((p) => {
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

  

//----------------------------------------------Separar em uma nova classe
  //Movimentação dos eleitores: cidadao
  walkEleitor(turtle) {
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

    //Se estiver próximo de um dos candidatos: converter este eleitor
    if (candidato !== null) {
      this.converterEleitor(turtle, candidato);
    } else {
       turtle.heading += util.randomCentered(5);
    }

    this.colisionWall(turtle);

    turtle.forward(this.Velocidade);
  }

  //Movimentação dos candidatos: bolsonaro; lula
  walkCandidato(turtle) {
    //Está próximo do Cidadão?
    const closestCidadao = this.closestNeighbor(turtle, this.cidadao);

    if (closestCidadao && turtle.distance(closestCidadao) <= 2) {
      turtle.face(this.patches.nOf(this.cidadao));
      const cidadaoHeading = closestCidadao.heading;
      turtle.heading = cidadaoHeading * -1;
    } else {
      //  turtle.heading += util.randomCentered(10);
    }

    this.colisionWall(turtle);

    turtle.forward(this.Velocidade);
  }

  //Colisao com a parede
  colisionWall(turtle) {
    const rtAngle = 90; // Math.PI / 2
    const turnAngle = rtAngle * turtle.turn;

    if (!this.wallAt(turtle, turnAngle) && this.wallAt(turtle, 1.5 * turnAngle)) {
      turtle.rotate(turnAngle);
    }else{
      // turtle.heading += util.randomCentered(10);
    }

    while (this.wallAt(turtle, 0)) turtle.rotate(-turnAngle);
  }

  //Identificar se a aparede está logo a frente da raça
  wallAt(turtle, angle) {
    const patchLocation = turtle.patchLeftAndAhead(angle, 1);
    return patchLocation && patchLocation.isBreed(this.walls);
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