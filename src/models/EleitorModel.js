import Model from "https://code.agentscript.org/src/Model.js";

class EleitorModel extends Model {
  constructor(worldOptions = undefined) {
    super(worldOptions);
  }

  setup() {
    this.turtleBreeds("lula bolsonaro cyro");

    //Lula
    this.patches.nOf(1).ask((p) => {
      p.sprout(1, this.lula, (t) => {
        t.face(p.neighbors4.oneOf());
      });
    });

    //Bolsonaro
    this.patches.nOf(1).ask((p) => {
      p.sprout(1, this.bolsonaro, (t) => {
        t.face(p.neighbors4.oneOf());
      });
    });

    //Cyro
    this.patches.nOf(1).ask((p) => {
      p.sprout(1, this.cyro, (t) => {
        t.face(p.neighbors4.oneOf());
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

    this.turtles.ask(turtle => {
      this.walk(turtle);
    });
  }

  walk(turtle) {
    let wiggleAngle = 30; // This is an interesting variable to play with

    // We look at three patches: directly ahead, ahead and to the right,
    // and ahead and to the left of the turtle
    let patchAhead = turtle.patchAhead(1);
    let patchRight = turtle.patchRightAndAhead(wiggleAngle, 1);
    let patchLeft = turtle.patchLeftAndAhead(wiggleAngle, 1);

    // If there's no patch to our right or left (because we're at the edge
    // of the world) we turn around.
    if (!patchRight) turtle.left(90);
    if (!patchLeft) turtle.right(90);

    // if(patchRight === undefined) turtle.left(90);
    // if(patchLeft === undefined) turtle.right(90);

    turtle.forward(0.3);
  }

  coloring(turtle) {
    switch (turtle.breed) {
      case this.bolsonaro:
        return "green";
      case this.lula:
        return "red";
      case this.cyro:
        return "blue";
      default:
        return "gray";
    }
  }
}

export default EleitorModel;
