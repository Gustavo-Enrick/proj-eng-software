import Model from "https://code.agentscript.org/src/Model.js";

class EleitorModel extends Model {
  Cron = 0;
  Segundos =0;
  hour = 0;
  minute = 0;
  second = 0;
  millisecond = 0;

  constructor(worldOptions = undefined) {
    super(worldOptions);
  }

  timer() {
    if ((this.millisecond += 10) == 1000) {
      this.millisecond = 0;
      this.second++;
    }
    if (this.second == 60) {
      this.second = 0;
      this.minute++;
    }
    if (this.minute == 60) {
      this.minute = 0;
      this.hour++;
    }

    this.Segundos = this.second;
  }

  startCron() {
    this.pauseCron();
    
    this.Tempo = setInterval(() => {
      this.timer();
    }, 10);
  }

  pauseCron() {
    clearInterval(this.Tempo);
  }






  setup() {
    // this.startCron();
    
    this.turtleBreeds("lula bolsonaro cidadao");

    //Propriedade para as raças
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

    //lógica para trnaformar um agente em outro
    // if(turtle.breed === this.lula) {
    //   turtle.hatch(1, this.bolsonaro, (i) => turtle.die());
    // }

    //setar valor em propriedade da raça
    // turtle.patch.convertido += 1;

    turtle.forward(0.5);
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
