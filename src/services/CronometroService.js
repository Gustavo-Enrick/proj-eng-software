export default class CronometroService {
  Cron = 0;
  Segundos = 0;
  hour = 0;
  minute = 0;
  second = 0;
  millisecond = 0;

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
}
