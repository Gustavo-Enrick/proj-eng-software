export default class CronometroService {
  Cron = 0;
  Segundos = 0;
  Milissegundos = 0;
  Tempo = null;

  timer() {
    if ((this.Milissegundos += 10) >= 1000) {
      this.Milissegundos = 0;
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
