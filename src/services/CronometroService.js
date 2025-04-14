export default class CronometroService {
  Cron = 0;
  Segundos = 0;
  Milisegundos = 0;

  timer() {
    if ((this.Milisegundos += 10) == 1000) {
      this.Milisegundos = 0;
      this.Segundos++;
    }
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
}
