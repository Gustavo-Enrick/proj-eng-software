import Model from "https://code.agentscript.org/src/Model.js";

class EleitorModel extends Model {
  constructor(worldOptions = undefined) {
    super(worldOptions);
  }

  setup() {
    this.turtleBreeds("lula bolsonaro cidadao");

    this.patches.setDefault("convertido", 0);

    //Lula
    this.patches.nOf(1).ask((p) => {
      p.sprout(1, this.lula, (t) => {
        // t.face(p.neighbors4.oneOf());
        t.atEdge = "bounce";
        t.rotate(45);
      });
    });

    //Bolsonaro
    this.patches.nOf(1).ask((p) => {
      p.sprout(1, this.bolsonaro, (t) => {
        // t.face(p.neighbors4.oneOf());
        t.atEdge = "bounce";
        t.rotate(45);
      });
    });

    //Cidadao
    this.patches.nOf(10).ask((p) => {
      p.sprout(1, this.cidadao, (t) => {
        // t.face(p.neighbors4.oneOf());
        t.atEdge = "bounce";
        t.rotate(45);
      });
    });
  }

  step() {
    // this.bolsonaro.ask((b) => {
    //   this.walk(b);
    // });

    // this.lula.ask((l) => {
    //   this.walk(l);
    // });

    // this.cyro.ask((c) => {
    //   this.walk(c);
    // });

    this.turtles.ask((turtle) => {
      this.walk(turtle);
    });
  }

  walk(turtle) {
    turtle.right(util.randomInt(25));
    turtle.left(util.randomInt(25));

    let patchRight = turtle.patchRightAndAhead(30, 1);
    let patchLeft = turtle.patchLeftAndAhead(30, 1);

    if (!patchRight) turtle.left(90);
    if (!patchLeft) turtle.right(90);

    // let vizinho = turtle.patch.neighbors;


    //lógica para trnaformar um agente em outro
    // if(turtle.breed === this.lula) {
    //   turtle.hatch(1, this.bolsonaro, (i) => turtle.die());
    // }

 
    //setar valor em propriedade
    // turtle.patch.convertido += 1;

    turtle.forward(0.3);
  }

  coloring(turtle) {
    switch (turtle.breed) {
      case this.bolsonaro:
        return "green";
      case this.lula:
        return "red";
      case this.cidadao:
        return "gray";
      default:
        return "gray";
    }
  }
}

export default EleitorModel;
