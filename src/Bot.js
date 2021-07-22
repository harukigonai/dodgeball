export default class Bot {
    constructor(p5, x, y, z, mass, width, height, team) {
      this.pos = p5.createVector(x, y, z);
      this.mass = mass;
      this.width = width;
      this.height = height;
      this.vel = p5.createVector(0, 0, 0);
      this.theta = 0;
      this.phi = 0;
      this.team = team;
      this.seekingBall = -1;
      this.ballGrabbed = 0;
      this.ballNumGrabbed = -1;
      this.alive = 1;
      this.dodging = 0;
      
      this.throwCountDownStarted = 0;
      this.canThrowBall = 0;
      this.timeGrabbedBall = 0;
      
      this.canGrabBall = 1;
      this.timeLastDropped = 0;
      
      this.target = -1;
      this.targetVector = p5.createVector(-1, -1, -1);
    }
    
    drawBot(p5) {
      p5.push();
  
      p5.translate(this.pos.x, this.pos.y, this.pos.z);
      
      p5.angleMode(p5.RADIANS);
      
      p5.stroke(10);
      p5.strokeWeight(0.5);
      
      
      p5.cylinder(this.width / 2, this.height);
      
      p5.pop();
      
    }
    //have bot try to catch a ball that has struck another teammate
    //some glitch cant pick up ball
    runToBall(balls, hei, thick) {
      let closestBall = -1;
      let closestBallDistance = 9999999999999;
      
      for (let i = 0; i < balls.length; i++) {
        let ballVel = balls[i].vel.mag();
        let ballSpin = balls[i].w.mag();
        
        if(balls[i].grabbed == 0 && ballVel <= 15 && ballSpin <= 1 &&
          this.team == balls[i].team && (balls[i].seekedByBot == 0 || (balls[i].seekedByBot == 1 && this.seekingBall == i))){
          
          let botBallVector = balls[i].pos.copy().sub(this.pos);
          let ballDistance = botBallVector.mag();
  
          if (ballDistance < closestBallDistance) {
            closestBall = i;
            closestBallDistance = ballDistance;
          }
  
        }
    }
  
    if(closestBall != -1 && 
         this.pos.y >= hei / 2 - thick - this.height / 2 * 1.5){
        balls[closestBall].seekedByBot = 1;
        this.seekingBall = closestBall;
        
        let normToBall = balls[closestBall].pos.copy().sub(this.pos);
        normToBall.y = 0;
        normToBall.normalize();
  
        let botSpeed = 10;
  
        this.vel.x = normToBall.x * botSpeed;
        this.vel.z = normToBall.z * botSpeed;
        
        
        
        this.theta = Math.atan2(this.vel.x - this.pos.x, 
                           this.vel.z - this.pos.z);
        //should be:? 
        //this.theta = Math.atan2(this.vel.x, this.vel.z);
        
        
        this.phi = Math.PI / 2;
        
      }
      else{
        this.seekingBall = -1;
      }
    }
  
    pickUpBall(p5, balls) {
      
  
      // let throwStrength = -1;
      // if(frameCount / 120 - this.timeBallGrabbed < 1){
      //   throwStrength = (frameCount / 120 - timeBallGrabbed) * 75;
      // }
      // else if(frameCount / 120 - timeBallGrabbed >= 1){
      //   throwStrength = 75;
      // }
      
      
      if(p5.frameCount / 120 - this.timeLastDropped >= 1){
        this.canGrabBall = 1;
      }
      
      
      for(let i = 0; i < balls.length && !this.ballGrabbed; i++){
        let ballVel = balls[i].vel.mag();
        let ballSpin = balls[i].w.mag();
        
        let ballInRange = 0;
        let ballXZInRange = 0;
        let ballYInRange = 0;
        
        let ballXToBotX = balls[i].pos.x - this.pos.x; 
        let ballYToBotY = balls[i].pos.y - this.pos.y;
        let ballZToBotZ = balls[i].pos.z - this.pos.z;
        
        if(Math.sqrt(ballXToBotX ** 2 + ballZToBotZ ** 2) <= this.width / 2 * 4){
          ballXZInRange = 1;
        }
        
        if(Math.abs(ballYToBotY) <= this.height / 2 * 4){
          ballYInRange = 1;
        }
        
        if(ballXZInRange && ballYInRange){
          ballInRange = 1;
        }
        
        if(this.canGrabBall && ballInRange && !balls[i].grabbed && 
           ballVel <= 15 && ballSpin <= 1 && this.team == balls[i].team){
          this.ballNumGrabbed = i; 
          balls[i].grabbed = 1;
          this.ballGrabbed = 1;
          
          balls[i].seekedByBot = 0;
          this.seekingBall = -1;
          //is this line necessary or redundant?
        }
      }
    }
    //could the logic for the player be more smooth like this above?
    
    ballInHand(p5, balls, botNum, bots, playerAlive, cam, collidedBalls){
      
      this.canThrowBall = 1;
      
      if(this.ballGrabbed && !this.throwCountDownStarted){
        this.throwCountDownStarted = 1;
        this.timeGrabbedBall = p5.frameCount / 120;
      }
      // else if(!this.ballGrabbed){
      //   this.timeGrabbedBall = frameCount / 120;
      // }
      
      if(p5.frameCount / 120 - this.timeGrabbedBall >= 0.25){
        this.canThrowBall = 1;
      }
      else{
        this.canThrowBall = 0;
      }
      
      let rho = 150;
      
      balls[this.ballNumGrabbed].pos.x = this.pos.x + rho;
      balls[this.ballNumGrabbed].pos.y = this.pos.y;
      balls[this.ballNumGrabbed].pos.z = this.pos.z + rho;
      
      balls[this.ballNumGrabbed].vel.mult(0);
  
      balls[this.ballNumGrabbed].w.mult(0);
      
      
      this.target = -1;
      this.targetVector = p5.createVector(-1, -1, -1);
      let closestTargetDist = 99999999999999;
      for(let i = 0; i < bots.length + 1; i++){
        if(i < bots.length && botNum != i && bots[i].team != this.team){
          let botBotVector = bots[i].pos.copy().sub(this.pos);
          let botDistance = botBotVector.mag();
          
          if(botDistance < closestTargetDist){
            this.target = i;
            closestTargetDist = botDistance;
          }
        }
        if(i == bots.length && this.team == 0 && playerAlive){
          let botPlayerVector = p5.createVector(cam.eyeX - this.pos.x, cam.eyeY - this.pos.y, cam.eyeZ - this.pos.z);
          let playerDistance = botPlayerVector.mag();
          
          if(playerDistance < closestTargetDist){
            this.target = i;
            closestTargetDist = playerDistance;
          }
        }
      }
      
      
      
      
      if(this.target != -1){      
        if(this.target < bots.length){
          this.targetVector = bots[this.target].pos.copy();   
        }
        if(this.target == bots.length){
          this.targetVector = p5.createVector(cam.eyeX, cam.eyeY, cam.eyeZ);
        }
        
        this.theta = Math.atan2(this.targetVector.x - this.pos.x, 
                           this.targetVector.z - this.pos.z);
        this.phi = Math.atan2(Math.sqrt((this.targetVector.z - this.pos.z) ** 2 + 
                              (this.targetVector.x - this.pos.x) ** 2),
                         this.targetVector.y - this.pos.y);
        rho = (this.width / 2 + balls[this.ballNumGrabbed].r) * 1.5;
        
        balls[this.ballNumGrabbed].pos.x = this.pos.x + rho * Math.sin(this.theta) * Math.sin(this.phi);
        balls[this.ballNumGrabbed].pos.y = this.pos.y + rho * Math.cos(this.phi);
        balls[this.ballNumGrabbed].pos.z = this.pos.z + rho * Math.cos(this.theta) * Math.sin(this.phi);
        
        balls[this.ballNumGrabbed].vel.mult(0);
  
        balls[this.ballNumGrabbed].w.mult(0);
    
        balls[this.ballNumGrabbed].collideWall(p5);
      }
      if(this.target == -1){
        this.canThrowBall = 0;
      }
      
      
      
      
      if(collidedBalls.includes(this.ballNumGrabbed)){
        this.timeLastDropped = p5.frameCount / 120;
        
        this.canGrabBall = 0;
        
        this.ballGrabbed = 0;
        balls[this.ballNumGrabbed].grabbed = 0;
        this.ballNumGrabbed = -1;
        
        this.canThrowBall = 0;
        
        this.throwCountDownStarted = 0;
      }
    }
  
    throwBall(p5, balls, botNum, g) {
      //execute method only if ballIsInHand
      
      //find closest player on enemy team and set theta and phi to point at 
      //him 
      
      //set vx vy vz correspondingly
      
      //complicated to calculate for curve balls
      
  
        
      let horizDistToTarget = Math.sqrt((this.targetVector.z - this.pos.z) ** 2 + 
                                   (this.targetVector.x - this.pos.x) ** 2);
      let velTheta = -1;
      let goalVel = 75;
      let lowestError = 9999999999999999999;
      for(let i = 0; i <= Math.PI / 2; i += 0.01){
        let error = Math.abs(-Math.tan(i) * horizDistToTarget + 
                        (g * horizDistToTarget ** 2) /
                        (2 * goalVel ** 2 * Math.cos(i) ** 2) -
                        (this.targetVector.y - this.pos.y));
  
        if(error < lowestError){ 
          velTheta = i;
          lowestError = error;
        }
      }
      
      let velNormXZ = this.targetVector.copy().sub(balls[this.ballNumGrabbed].pos);
      velNormXZ.y = 0;
      velNormXZ.normalize();
  
      balls[this.ballNumGrabbed].vel.x = goalVel * Math.cos(velTheta) * velNormXZ.x;
      balls[this.ballNumGrabbed].vel.y = - goalVel * Math.sin(velTheta) * 0.8;
      balls[this.ballNumGrabbed].vel.z = goalVel * Math.cos(velTheta) * velNormXZ.z;
  
      balls[this.ballNumGrabbed].w = p5.createVector(0, 0, 0);
      
  
      balls[this.ballNumGrabbed].alive = 1;
      
      
  
      this.ballGrabbed = 0;
      balls[this.ballNumGrabbed].grabbed = 0;
      this.ballNumGrabbed = -1;
  
      this.targetVector = (-1, -1, -1);
      this.target = -1;
      
      this.throwCountDownStarted = 0;
      this.canThrowBall = 0;
    }   
  
    collideWall(p5, hei, thick, wid, len) {
      
      if (this.pos.y >= hei / 2 - thick - this.height / 2) {
          
        this.pos.y = hei / 2 - thick - this.height / 2;
        this.vel.y = 0;
        
      }
      
      if (this.pos.y <= -(hei / 2 - thick - this.height / 2)) {
        
        this.pos.y = - hei / 2 + thick + this.height / 2;
      }
      
      if (this.pos.x >= wid / 2 - thick - this.width / 2) {
        
        
        this.pos.x = wid / 2 - thick - this.width / 2;
      }
  
      if (this.pos.x <= -(wid / 2 - thick - this.width / 2)) {
        
        
        this.pos.x = - wid / 2 + thick + this.width / 2;
      }
      
      if(this.team == 0){ 
        if (this.pos.z >= len / 2 - thick - this.width / 2) {
  
          this.pos.z = len / 2 - thick - this.width / 2;
        }
  
        if (this.pos.z <= 0) {
  
          this.pos.z = 0;
        }
      }
      else if(this.team == 1){
        if (this.pos.z >= 0) {
  
          this.pos.z = 0;
        }
  
        if (this.pos.z <= -(len / 2 - thick - this.width / 2)) {
  
          this.pos.z = -len / 2 + thick + this.width / 2;
        }
      }
    }
  
    collidePlayer(p5, playerX, playerY, playerZ, playerWidth, playerHeight) {
      let playerToBotVector = p5.createVector(this.pos.x - playerX, 0, this.pos.z - playerZ);
      let botToPlayer = playerToBotVector.mag();
      let normal = playerToBotVector.copy().normalize();
      
      //fix this if statement
      if (botToPlayer <= this.width / 2 + playerWidth / 2 && 
          this.pos.y + this.height >= playerY - 20 && 
          this.pos.y - this.height <= playerY + playerHeight) {     
  
        let collideAngle1 = Math.atan2(normal.x, normal.z);
  
        // console.log(collideAngle1)
        
        if(botToPlayer <= (this.width / 2 + playerWidth / 2)) {
          this.pos.x = playerX + (this.width / 2 + playerWidth / 2 * 1.1) * Math.sin(collideAngle1);
          this.pos.z = playerZ + (this.width / 2+ playerWidth / 2 * 1.1) * Math.cos(collideAngle1);
        }      
      }
    }
  
    updateMotion(p5, g) {    
      let accel = p5.createVector(0, g, 0);
      
      this.vel.add(accel);
      this.pos.add(this.vel);
    }  
    ballIncoming(p5, balls, hei, thick){
      let incomingBall = -1;
      
      for(let i = 0; i < balls.length && this.dodging == 0 &&
          incomingBall == -1; i++){
        let velMag = balls[i].vel.mag();
        let angPhi = Math.cos(balls[i].vel.y / velMag);
        let angThe = Math.atan2(balls[i].vel.x, balls[i].vel.z);
        
        let s = 8;
        for(let j = 0; j <= s && balls[i].alive == 1 && 
            incomingBall == -1; j++){    
          let linePt = p5.createVector(balls[i].r * Math.cos(j * 2 * Math.PI / s),
                                    balls[i].r * Math.sin(j * 2 * Math.PI / s),
                                    0);
          
          let linePtP = p5.createVector(-1, -1, -1);
          linePtP.x = linePt.x 
          linePtP.y = - linePt.y * Math.sin(angPhi) + linePt.z * Math.cos(angPhi);
          linePtP.z = - linePt.y * Math.cos(angPhi) - linePt.z * Math.sin(angPhi);
      
          let linePtPP = p5.createVector(-1, -1, -1);
          linePtPP.x = linePtP.x * Math.cos(angThe) - linePtP.z * Math.sin(angThe);
          linePtPP.y = linePtP.y 
          linePtPP.z = linePtP.x * Math.sin(angThe) + linePtP.z * Math.cos(angThe);
          
          let o = linePtPP.copy().add(balls[i].pos);
          
          //maybe adjust this somehow
          let n = balls[i].vel.copy().normalize();
          
          let a = p5.createVector(0, -1, 0);
          
          let b = this.pos.copy();
          
          let rad = this.width / 2;
          
          // let sum = o.copy().add(n);
          // if(frameCount % 50 == 0){
          // line(o.x, o.y, o.z,
          //      o.x + 100*n.x,
          //      o.y + 100*n.y,
          //      o.z + 100*n.z);
          // }
          
          let nCrossA = n.copy().cross(a);
          let nCrossADotNCrossA = nCrossA.copy().dot(nCrossA);
          let bMinusO = b.copy().sub(o);
          let bMinusOCrossA = bMinusO.copy().cross(a);
          let nCrossADotBMinusOCrossA = nCrossA.copy().dot(bMinusOCrossA);
          let bMinusODotNCrossA = bMinusO.copy().dot(nCrossA);
          
          let discrim = nCrossA.copy().dot(nCrossA) * rad ** 2 - 
              bMinusODotNCrossA ** 2;
                  
          // && n.mag() != 0 prevents error if ball is still, causing
          // d to equal infinity
          if(discrim >= 0 && n.mag() != 0){
          
            let d = -1;
            
            for(let k = -1; k <= 1 && incomingBall == -1; k += 2){
              let numerator = nCrossADotBMinusOCrossA + k * Math.sqrt(discrim);
            
              let denominator = nCrossA.copy().dot(nCrossA)
               
              if(denominator != 0){
                d = numerator / denominator;
                              
                let nMultD = n.copy().mult(d)
  
                let t = a.copy().dot(nMultD.sub(bMinusO)); 
  
                if(-this.height / 2 <= t && t <= this.height / 2 && d >= 0){
                  incomingBall = i;
                }
              }
              
            
              
              
              let c = b.copy().add(a.copy().mult(k * this.height / 2));
  
              let aDotC = a.copy().dot(c);
              let aDotN = a.copy().dot(n);
              d = aDotC / aDotN;
              
              let nMultD = n.copy().mult(d)
  
              let check = nMultD.copy().sub(c);
              if(check.mag() ** 2 < rad ** 2 && d >= 0){
                incomingBall = i;
              }
            }
          } 
        }
      }
      if(incomingBall != -1 && 
         this.pos.y >= hei / 2 - thick - this.height / 2 * 1.5){  
        let velMag = balls[incomingBall].vel.mag();
        let angPhi = Math.cos(balls[incomingBall].vel.y / velMag);
        let angThe = Math.atan2(balls[incomingBall].vel.x, 
                           balls[incomingBall].vel.z);
        
        let negOrPos = Math.floor(3 * Math.random()) - 1;
        
        if(negOrPos == -1 || negOrPos == 1){
          let linePt = p5.createVector(negOrPos * 1,
                                    0,
                                    0);
  
          let linePtP = p5.createVector(-1, -1, -1);
          linePtP.x = linePt.x 
          linePtP.y = - linePt.y * Math.sin(angPhi) + linePt.z * Math.cos(angPhi);
          linePtP.z = - linePt.y * Math.cos(angPhi) - linePt.z * Math.sin(angPhi);
  
          let linePtPP = p5.createVector(-1, -1, -1);
          linePtPP.x = linePtP.x * Math.cos(angThe) - linePtP.z * Math.sin(angThe);
          linePtPP.y = linePtP.y 
          linePtPP.z = linePtP.x * Math.sin(angThe) + linePtP.z * Math.cos(angThe);
  
          this.vel = linePtPP.copy().mult(10); 
  
        }
        else if(negOrPos == 0){
  
          this.vel.y += -15;
        }
        this.dodging = 1;
      }
      else{
        this.dodging = 0;
      }
    }
    //https://en.wikipedia.org/wiki/User:Nominal_animal
  
    postDodgingDamping(hei, thick){
      if(!this.dodging && this.pos.y >= hei / 2 - thick - this.height / 2){  
        this.vel.mult(0.95);
      }
    }
  }