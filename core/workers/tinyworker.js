/* kind of worker */

export class TinyWorker {
  
  constructor(work) { //work is a closure
    this.delay = 1000; // milliseconds
    this.work = work;
    this.action = null;
  }
  
  start(message) {

    this.action = setInterval(() => {
      this.work(message)
    }, this.delay)    
  }
  
  kill() {
    clearInterval(this.action);
  }
  
  
}