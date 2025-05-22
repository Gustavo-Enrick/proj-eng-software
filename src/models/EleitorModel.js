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

    this.TxConversaoLula = 20;
    this.TxConversaoBolsonaro = 30;
    this.TxConversaoArthur = 10;
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
      b.forward(this.Velocidade);
      this.walkCandidato(b);
    });

    this.lula.ask((l) => {
      l.forward(this.Velocidade);
      this.walkCandidato(l);
    });

    this.arthurVal.ask((a) => {
      a.forward(this.Velocidade);
      this.walkCandidato(a);
    });

    this.cidadao.ask((c) => {
      c.forward(this.Velocidade);
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
    if (closestLula && turtle.distance(closestLula) <= 2) {
      candidato = this.lula;
    }
    //Está próximo do eleitor Bolsonaro?
    if (closestBolsonaro && turtle.distance(closestBolsonaro) <= 2) {
      candidato = this.bolsonaro;
    }
    //Está próximo do eleitor Bolsonaro?
    if (closestArthurVal && turtle.distance(closestArthurVal) <= 2) {
      candidato = this.arthurVal;
    }

    //Se estiver próximo de um dos candidatos: converter este eleitor
    if (candidato !== null) {
      let conversao = util.randomInt(101);

      let conversaoCandidato = this.retornarTaxaConversao(candidato);

      if (conversao <= conversaoCandidato) {
        this.converterEleitor(turtle, candidato);
      }
    } else {
      turtle.heading += util.randomCentered(30);
    }
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
    if (closestLula && turtle.distance(closestLula) <= 2) {
      candidato = this.lula;
    }
    //Está próximo do eleitor Bolsonaro?
    if (closestBolsonaro && turtle.distance(closestBolsonaro) <= 2) {
      candidato = this.bolsonaro;
    }
    //Está próximo do eleitor Bolsonaro?
    if (closestArthurVal && turtle.distance(closestArthurVal) <= 2) {
      candidato = this.arthurVal;
    }

    //Se estiver próximo de um dos candidatos: converter este eleitor
    if (candidato !== null) {
      let conversao = util.randomInt(101);

      let reconversaoCandidato = this.retornarTaxaReconversao(
        candidato,
        turtle
      );

      if (conversao <= reconversaoCandidato) {
        this.converterEleitor(turtle, candidato);
      }
    } else {
      turtle.heading += util.randomCentered(30);
    }
  }
  //----------------------------------------------------------------------------------------

  //Funções para conversão entre raças
  //----------------------------------------------------------------------------------------
  retornarTaxaConversao(candidato) {
    if (candidato === this.arthurVal) return this.TxConversaoArthur;

    if (candidato === this.lula) return this.TxConversaoLula;

    if (candidato === this.bolsonaro) return this.TxConversaoBolsonaro;

    return 0;
  }

  //Probabilidade para permitir a conversão
  permitirConversao(candidato, turtle) {
    let permitir = false;
    let conversao = util.randomInt(2);

    if (turtle.breed.length >= candidato.length && conversao == 1) {
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

    if (
      candidato === this.arthurVal &&
      this.permitirConversao(candidato, turtle)
    ) {
      taxaReconversao =
        this.TxConversaoArthur - this.retornarTaxaConversao(turtle.breed);

      console.log("arthur", this.TxConversaoArthur);
      console.log(turtle.breed.name, this.retornarTaxaConversao(turtle.breed));
      console.log("taxa", taxaReconversao);
      console.log("-------------------------------------------");
    }

    if (candidato === this.lula && this.permitirConversao(candidato, turtle)) {
      taxaReconversao =
        this.TxConversaoLula - this.retornarTaxaConversao(turtle.breed);

      console.log("lula", this.TxConversaoLula);
      console.log(turtle.breed.name, this.retornarTaxaConversao(turtle.breed));
      console.log("taxa", taxaReconversao);
      console.log("-------------------------------------------");
    }

    if (
      candidato === this.bolsonaro &&
      this.permitirConversao(candidato, turtle)
    ) {
      taxaReconversao =
        this.TxConversaoBolsonaro - this.retornarTaxaConversao(turtle.breed);
      console.log("bozo", this.TxConversaoBolsonaro);
      console.log(turtle.breed.name, this.retornarTaxaConversao(turtle.breed));
      console.log("taxa", taxaReconversao);
      console.log("-------------------------------------------");
    }

    if (taxaReconversao <= 0) {
      return -1;
    }

    return taxaReconversao;
  }

  //Converter raça e adicionar valores no contador de convertidos
  converterEleitor(turtle, candidato) {
    if (
      turtle.breed == this.cidadao &&
      this.permitirConversao2(candidato, turtle)
    ) {
      turtle.hatch(1, candidato, (i) => turtle.die());
    }

    this.Bolsonarista = this.bolsonaro.length;

    this.Lulista = this.lula.length;

    this.Arthurista = this.arthurVal.length;

    this.Eleitor = this.cidadao.length;
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
