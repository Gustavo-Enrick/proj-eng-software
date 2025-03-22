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
   this.lula.setDefault("turn", -1);
   this.bolsonaro.setDefault("turn", -1);
   this.cidadao.setDefault("turn", -1);

    //Inicializando mapa
    this.patchBreeds("wall");

    this.patches.ask((p) => {
      if (util.randomFloat(10) < 0.01) {
        const neighbors = this.patches.inRadius(p, util.randomInt(10));
        neighbors.ask((n) => {
          n.setBreed(this.wall);
        });
      }
    });

    //Lula
    this.patches.filter(p => !p.isBreed(this.wall)).nOf(this.Lulista).ask((p) => {
      p.sprout(1, this.lula, (t) => {
        t.atEdge = "bounce";
        t.face(p.neighbors4.oneOf());
        t.rotate(45);
      });
    });

    //Bolsonaro
    this.patches.filter(p => !p.isBreed(this.wall)).nOf(this.Bolsonarista).ask((p) => {
      p.sprout(1, this.bolsonaro, (t) => {
        t.atEdge = "bounce";
        t.face(p.neighbors4.oneOf());
        t.rotate(45);
      });
    });

    //Cidadao
    this.patches.filter(p => !p.isBreed(this.wall)).nOf(this.Eleitor).ask((p) => {
      p.sprout(1, this.cidadao, (t) => {
        t.atEdge = "bounce";
        t.face(p.neighbors4.oneOf());
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
    if (closestLula && turtle.distance(closestLula) <= 2 && candidato === null) {
      candidato = this.lula;
    }

    //Está próximo do eleitor Bolsonaro?
    const closestBolsonaro = this.closestNeighbor(turtle, this.bolsonaro);
    if (closestBolsonaro && turtle.distance(closestBolsonaro) <= 2 && candidato === null) {
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
    if (closestCidadao && turtle.distance(closestCidadao) <= 10) {
      //Quando próximo, direcionar candidato para o eleitor
      turtle.face(closestCidadao);
    } else {
      turtle.heading += util.randomCentered(5);
    }
    
    this.colisionWall(turtle);
    turtle.forward(this.Velocidade);
  }

  //Colisao com a parede
  colisionWall(turtle) {
    const rtAngle = 90; // Math.PI / 2
    const turnAngle = rtAngle * turtle.turn;

    if (!this.wallClosest(turtle, turnAngle) && this.wallClosest(turtle, 1.5 * turnAngle)){
      turtle.rotate(-turnAngle);
    }
 
    while (this.wallClosest(turtle, 0)) turtle.rotate(turnAngle);
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