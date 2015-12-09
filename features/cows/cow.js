import {Model} from '../../core/models/model'
import config from '../../app.config';
import {TinyWorker} from '../../core/workers/tinyworker'

let cowsList = [];

export class Cow extends Model {
  
  //static cowsList;
  static get cowsList() {
    return cowsList;
  }
 
  constructor(db, fields) {
    super(db, fields)
    
    /* fields
      - nickname
      - x
      - y
      - size
    */
    
    this.constraints = config().constraints;
    this.xVelocity = 1;
    this.yVelocity = -1;
    
  }
  
  move() {
    this.x += this.xVelocity;
    this.y += this.yVelocity;
    if(this.x <= this.constraints.border || this.x >= this.constraints.width - this.constraints.border) {
      this.x -= this.xVelocity;
      this.x = Math.max(this.x, this.constraints.border);
      this.x = Math.min(this.x, this.constraints.width - this.constraints.border);
      this.xVelocity = -this.xVelocity;
      this.x += this.xVelocity;
    }
    if(this.y <= this.constraints.border || this.y >= this.constraints.height - this.constraints.border) {
      this.y -= this.yVelocity;
      this.y = Math.max(this.y, this.constraints.border);
      this.y = Math.min(this.y, this.constraints.height - this.constraints.border);
      this.yVelocity = -this.yVelocity;
      this.y += this.yVelocity;
    }    
  };
  
  distance (boid) {
    var distX = this.x - boid.x;
    var distY = this.y - boid.y;
    return Math.sqrt(distX * distX + distY * distY);
  };  
  

  moveAway (boids, minDistance) {
    var distanceX = 0;
    var distanceY = 0;
    var numClose = 0;

    for(var i = 0; i < boids.length; i++) {
      var boid = boids[i];

      if(boid.x == this.x && boid.y == this.y) continue;

      var distance = this.distance(boid)
      if(distance < minDistance) {
        numClose++;
        var xdiff = (this.x - boid.x);
        var ydiff = (this.y - boid.y);

        if(xdiff >= 0) xdiff = Math.sqrt(minDistance) - xdiff;
        else if(xdiff < 0) xdiff = -Math.sqrt(minDistance) - xdiff;

        if(ydiff >= 0) ydiff = Math.sqrt(minDistance) - ydiff;
        else if(ydiff < 0) ydiff = -Math.sqrt(minDistance) - ydiff;

        distanceX += xdiff;
        distanceY += ydiff;
        boid = null;
      }
    }

    if(numClose == 0) return;

    this.xVelocity -= distanceX / 5;
    this.yVelocity -= distanceY / 5;
  };

  moveCloser (boids, distance) {
    if(boids.length < 1) return

    var avgX = 0;
    var avgY = 0;
    for(var i = 0; i < boids.length; i++) {
      var boid = boids[i];
      if(boid.x == this.x && boid.y == this.y) continue;
      if(this.distance(boid) > distance) continue;

      avgX += (this.x - boid.x);
      avgY += (this.y - boid.y);
      boid = null;
    }

    avgX /= boids.length;
    avgY /= boids.length;

    distance = Math.sqrt((avgX * avgX) + (avgY * avgY)) * -1.0
    if(distance == 0) return;

    this.xVelocity= Math.min(this.xVelocity + (avgX / distance) * 0.15, this.constraints.maxVelocity)
    this.yVelocity = Math.min(this.yVelocity + (avgY / distance) * 0.15, this.constraints.maxVelocity)

  };

  moveWith (boids, distance) {
    if(boids.length < 1) return

    // calculate the average velocity of the other boids
    var avgX = 0;
    var avgY = 0;
    for(var i = 0; i < boids.length; i++) {
      var boid = boids[i];
      if(boid.x == this.x && boid.y == this.y) continue;
      if(this.distance(boid) > distance) continue;

      avgX += boid.xVelocity;
      avgY += boid.yVelocity;
      boid = null;
    }
    avgX /= boids.length;
    avgY /= boids.length;

    distance = Math.sqrt((avgX * avgX) + (avgY * avgY)) * 1.0
    if(distance == 0) return;

    this.xVelocity= Math.min(this.xVelocity + (avgX / distance) * 0.05, this.constraints.maxVelocity)
    this.yVelocity = Math.min(this.yVelocity + (avgY / distance) * 0.05, this.constraints.maxVelocity)
  };
  
  // override [model]toJson
  toJson() {
    let tmp = super.toJson()
    delete tmp.worker;
    return tmp;
  }  
    
  start() {
    
    this.worker = new TinyWorker((message) =>{
      //console.log(message)
      this.moveWith(cowsList, 300);
      this.moveCloser(cowsList, 300);
      this.moveAway(cowsList, 15);      
      this.move();
            
      // here save coordinate
      //console.log(this.x, this.y, cowsList)
      //if(this.x && this.y) 
      this.update()   
    });
    
    this.worker.start("go");
    cowsList.push(this); 
  }
  
  kill() {
    this.worker.kill()
    delete this.worker;
    console.log("Cow Worker is killed.")
  }  
    
  // override [model]remove
  remove() {
    this.kill(); 
    let index = cowsList.indexOf(this);
    cowsList.splice(index, 1);
    return super.remove()
  }
  
} // end class
