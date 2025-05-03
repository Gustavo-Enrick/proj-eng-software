import Model from "../../libs/agentscript/src/Model.js";
import * as util from "../../libs/agentscript/src/utils.js";

class EleitorModel extends Model {
  Lulista;
  Bolsonarista;
  Arthurista;
  Eleitor;
  Velocidade;
  TxConversaoLula;
  TxConversaoBolsonaro;
  TxConversaoArthur;

  constructor(agentOptions, worldOptions = undefined) {
    super(worldOptions);

    this.Lulista = agentOptions.lulista;
    this.Bolsonarista = agentOptions.bolsonarista;
    this.Arthurista = agentOptions.arthurista;
    this.Eleitor = agentOptions.eleitor;
    this.Velocidade = agentOptions.velocidade;
    this.TxConversaoLula = 50;
    this.TxConversaoBolsonaro = 30;
    this.TxConversaoArthur = 40;
  }

  //Inicializar raças
  //----------------------------------------------------------------------------------------
  setup() {
    //Declarando raças
    this.turtleBreeds("lula bolsonaro arthurVal cidadao");

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

    //Arthur Val
    this.patches.nOf(this.Arthurista).ask((p) => {
      p.sprout(1, this.arthurVal, (t) => {
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
  //----------------------------------------------------------------------------------------

  //Configuração de movimentação
  //----------------------------------------------------------------------------------------
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
  //----------------------------------------------------------------------------------------

  //Movimentação dos eleitores: cidadao
  //----------------------------------------------
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
      let conversao = Math.floor(Math.random() * 101);

      let conversaoCandidato = this.retornarTaxaConversao(candidato);

      if (conversao <= conversaoCandidato) {
        this.converterEleitor(turtle, candidato);
      }
    } else {
      turtle.heading += util.randomCentered(30);
    }
  }
  //----------------------------------------------------------------------------------------

  retornarTaxaConversao(candidato) {
    if (candidato === this.arthurVal) return this.TxConversaoArthur;

    if (candidato === this.lula) return this.TxConversaoLula;

    if (candidato === this.bolsonaro) return this.TxConversaoBolsonaro;

    return 0;
  }

  retornarTaxaReConversao(candidato, turtle) {
    let taxaReconversao = 0;

    if (candidato === this.arthurVal) {
      taxaReconversao =
        this.TxConversaoArthur - this.retornarTaxaConversao(turtle.breed);
    }

    if (candidato === this.lula) {
      taxaReconversao =
        this.TxConversaoLula - this.retornarTaxaConversao(turtle.breed);
    }

    if (candidato === this.bolsonaro) {
      taxaReconversao =
        this.TxConversaoBolsonaro - this.retornarTaxaConversao(turtle.breed);
    }

    
    if(taxaReconversao <= 0) {
      return -1;
    }

    return taxaReconversao;
  }

  //Movimentação dos candidatos: bolsonaro; lula
  //----------------------------------------------------------------------------------------
  walkCandidato(turtle) {
    this.colisionWall(turtle);

    turtle.forward(this.Velocidade);

    //Está próximo do Cidadão?
    const closestCidadao = this.closestNeighbor(turtle, this.cidadao);
    if (closestCidadao && turtle.distance(closestCidadao) <= 10) {
      //Quando próximo, direcionar candidato para o eleitor
      turtle.face(closestCidadao);
    } 
    else {
      turtle.heading += util.randomCentered(30);
    }

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

    // //Se estiver próximo de um dos candidatos: converter este eleitor
    // if (candidato !== null) {
    //   this.converterEleitor(turtle, candidato);
    // } else {
    //   turtle.heading += util.randomCentered(30);
    // }

    //Se estiver próximo de um dos candidatos: converter este eleitor
    if (candidato !== null) {
      let conversao = Math.floor(Math.random() * 101);

      let conversaoCandidato = this.retornarTaxaReConversao(candidato,turtle);

      if (conversao <= conversaoCandidato) {
        this.converterEleitor(turtle, candidato);
      }
    } else {
      turtle.heading += util.randomCentered(30);
    }
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
