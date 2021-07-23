function multiply(a, b) {
    let m = new Array(4);  // initialize array of rows
    for (var r = 0; r < 4; ++r) {
        m[r] = new Array(4); // initialize the current row
        for (var c = 0; c < 4; ++c) {
            m[r][c] = 0;             // initialize the current cell
            for (var i = 0; i < 4; ++i) {
                m[r][c] += a[r][i] * b[i][c];
            }
        }
    }
    return m;
    
    // https://stackoverflow.com/questions/27205018/multiply-2-matrices-in-javascript
}

export default class Ball { 
    constructor(p5, ballConfigs) {
        this.pos = p5.createVector(ballConfigs.pos.x, ballConfigs.pos.y, ballConfigs.pos.z);
        this.vel = p5.createVector(ballConfigs.vel.x, ballConfigs.vel.y, ballConfigs.vel.z);
        this.w = p5.createVector(ballConfigs.angVel.x, ballConfigs.angVel.y, ballConfigs.angVel.z);
        this.m = ballConfigs.mass;
        this.r = ballConfigs.radius;

        this.seekedByBot = 0;
        this.team = -1;
        this.grabbed = 0;
        this.recentlyCollided = 0;
        
        this.botsHit = [];
        this.caughtByTeam = -1;
        
        this.alive = 0;
        this.prevM = new Array([1.0, 0.0, 0.0, 0.0], 
                               [0.0, 1.0, 0.0, 0.0], 
                               [0.0, 0.0, 1.0, 0.0], 
                               [0.0, 0.0, 0.0, 1.0]);
    }
    
    drawBall(p5) {
        p5.push();
        p5.translate(this.pos.x, this.pos.y, this.pos.z);
        p5.angleMode(p5.RADIANS);
        p5.stroke(10);
        p5.strokeWeight(0.5);
            
        let ctX = Math.cos(this.w.x);
        let stX = Math.sin(this.w.x);
        let rotM = new Array([1.0, 0.0, 0.0, 0.0], 
                             [0.0, ctX, stX, 0.0], 
                             [0.0, -stX, ctX, 0.0], 
                             [0.0, 0.0, 0.0, 1.0]);
        this.prevM = multiply(this.prevM, rotM);
        
        let ctY = Math.cos(this.w.y);
        let stY = Math.sin(this.w.y);
        rotM = new Array([ctY, 0.0, stY, 0.0], 
                         [0.0, 1.0, 0.0, 0.0], 
                         [-stY, 0.0, ctY, 0.0], 
                         [0.0, 0.0, 0.0, 1.0]);
        this.prevM = multiply(this.prevM, rotM);
        
        let ctZ = Math.cos(this.w.z);
        let stZ = Math.sin(this.w.z);
        rotM = new Array([ctZ, stZ, 0.0, 0.0], 
                         [-stZ, ctZ, 0.0, 0.0], 
                         [0.0, 0.0, 1.0, 0.0], 
                         [0.0, 0.0, 0.0, 1.0]);
        this.prevM = multiply(this.prevM, rotM);
        
        p5.applyMatrix(this.prevM[0][0], this.prevM[0][1], this.prevM[0][2], this.prevM[0][3],
                       this.prevM[1][0], this.prevM[1][1], this.prevM[1][2], this.prevM[1][3],
                       this.prevM[2][0], this.prevM[2][1], this.prevM[2][2], this.prevM[2][3],
                       this.prevM[3][0], this.prevM[3][1], this.prevM[3][2], this.prevM[3][3]);
        p5.sphere(this.r);
        p5.pop();
    }

    collideWall(p5, params) {
        let collided = 0;
        let vP = p5.createVector(-1, -1, -1);
        let wP = p5.createVector(-1, -1, -1);

        let a = params.a
        let e = params.e
        let len = params.len 
        let thick = params.thick
        let hei = params.hei 
        let wid = params.wid

        let dirs = ['x', 'y', 'z']

        for (let i = 0; i < 6; i++) {
            if (((i === 0 && this.pos.x >= wid / 2 - thick - this.r) || (i === 1 && this.pos.x <= -(wid / 2 - thick - this.r)) ||
                (i === 2 && this.pos.y >= hei / 2 - thick - this.r) || (i === 3 && this.pos.y <= -(hei / 2 - thick - this.r)) ||
                (i === 4 && this.pos.z >= len / 2 - thick - this.r) || (i === 5 && this.pos.z <= -(len / 2 - thick - this.r)))) {
                
                let face = i % 2 === 0 ? 1 : -1;
                let dir = parseInt(i / 2);

                let prev = dirs[(dir + 2) % 3]
                let curr = dirs[dir]
                let next = dirs[(dir + 1) % 3]
    
                let collideAngle = Math.atan2(this.vel.[prev], this.vel.[next]);
                
                wP.[prev] = Math.cos(collideAngle) * this.w.[prev] - Math.sin(collideAngle) * this.w.[next];
                wP.[curr] = this.w.[curr];
                wP.[next] = Math.sin(collideAngle) * this.w.[prev] + Math.cos(collideAngle) * this.w.[next];
    
                vP.[prev] = Math.cos(collideAngle) * this.vel.[prev] - Math.sin(collideAngle) * this.vel.[next];
                vP.[curr] = this.vel.[curr];
                vP.[next] = Math.sin(collideAngle) * this.vel.[prev] + Math.cos(collideAngle) * this.vel.[next];
    
                vP.[prev] = (1 - a * e) / (1 + a) * vP.[prev] + a * (1 + e) / (1 + a) * (face * this.r * wP.[next]);
                vP.[next] = (1 - a * e) / (1 + a) * vP.[next] + a * (1 + e) / (1 + a) * (-1 * face * this.r * wP.[prev]);
                vP.[curr] = -e * vP.[curr];
    
                wP.[prev] = (a - e) / (1 + a) * wP.[prev] + (1 + e) / (1 + a) * (vP.[next]) / (-1 * face * this.r);
                wP.[next] = (a - e) / (1 + a) * wP.[next] + (1 + e) / (1 + a) * (vP.[prev]) / (face * this.r);
    
                this.w.[prev] = Math.cos(collideAngle) * wP.[prev] + Math.sin(collideAngle) * wP.[next];
                this.w.[curr] = wP.[curr];
                this.w.[next] = -Math.sin(collideAngle) * wP.[prev] + Math.cos(collideAngle) * wP.[next];
        
                this.vel.[prev] = Math.cos(collideAngle) * vP.[prev] + Math.sin(collideAngle) * vP.[next];
                this.vel.[curr] = vP.[curr];
                this.vel.[next] = -Math.sin(collideAngle) * vP.[prev] + Math.cos(collideAngle) * vP.[next];
        
                this.pos.[curr] = face * (((i === 0 || i === 1) ? wid : ((i === 2 || i === 3) ? hei : len)) / 2 - thick - this.r);
                
                this.alive = 0;
                collided = 1;
            }
        }
        
        if(this.caughtByTeam == -1 && collided){
            for(let i = -1; i < bots.length ; i++){
            if(this.botsHit.includes(i)){
                if(i == -1){
                playerAlive = 0;
                
                //bots[botNum].alive = 0;
                
                if(ballGrabbed){
                    balls[grabbedBall].grabbed = 0;
                    grabbedBall = -1;
                    ballGrabbed = 0;
                }
                }
                else{
                bots[i].alive = 0;
                
                if(bots[i].ballNumGrabbed != -1){
                    balls[bots[i].ballNumGrabbed].grabbed = 0;
                }
                }
            }
            }      
        }
        
        if(collided){
            this.botsHit = [];
            this.caughtByTeam = -1;
        }
    }
  
    collidePlayer(p5, playerX, playerY, playerZ, playerWidth, playerHeight, botNum, personHeight, e, a, personWidth, camVelY, m) {
      
      let ballToPlayerVector = p5.createVector(this.pos.x - playerX, 
                                            0, 
                                            this.pos.z - playerZ);
      let ballToPlayer = ballToPlayerVector.mag();
      let normal = ballToPlayerVector.copy().normalize();
        
      
      
      
      if (ballToPlayer <= this.r + playerWidth / 2 && 
          ((botNum != -1 && 
            this.pos.y + this.r >= playerY - playerHeight / 2 && 
            this.pos.y - this.r <= playerY + playerHeight / 2) ||
           (botNum == -1 && 
            this.pos.y >= playerY - 20 && 
            this.pos.y <= playerY + personHeight))) {
  
        
        let collideAngle1 = Math.atan2(normal.x, normal.z);
        
        let vP1 = p5.createVector(-1, -1, -1);
        let wP1 = p5.createVector(-1, -1, -1); 
  
        wP1.x = Math.cos(collideAngle1) * this.w.x - Math.sin(collideAngle1) * this.w.z;
        wP1.y = this.w.y;
        wP1.z = Math.sin(collideAngle1) * this.w.x + Math.cos(collideAngle1) * this.w.z;
  
        vP1.x = Math.cos(collideAngle1) * this.vel.x - Math.sin(collideAngle1) * this.vel.z;
        vP1.y = this.vel.y;
        vP1.z = Math.sin(collideAngle1) * this.vel.x + Math.cos(collideAngle1) * this.vel.z;
        
        
        let collideAngle2 = Math.atan2(vP1.y, vP1.x);
        
        let vP2 = p5.createVector(-1, -1, -1);
        let wP2 = p5.createVector(-1, -1, -1); 
        
        
        wP2.y = Math.cos(collideAngle2) * wP1.y - Math.sin(collideAngle2) * wP1.x;
        wP2.z = wP1.z;
        wP2.x = Math.sin(collideAngle2) * wP1.y + Math.cos(collideAngle2) * wP1.x;
  
        //let vxP = Math.cos(collideAngle) * this.vx + Math.sin(collideAngle) * this.vz;
        vP2.y = Math.cos(collideAngle2) * vP1.y - Math.sin(collideAngle2) * vP1.x;
        vP2.z = vP1.z;
        vP2.x = Math.sin(collideAngle2) * vP1.y + Math.cos(collideAngle2) * vP1.x;
        
        vP2.y = ((1 - a * e) / (1 + a) * vP2.y + 
                 a * (1 + e) / (1 + a) * (-this.r * wP2.x));
        vP2.x = ((1 - a * e) / (1 + a) * vP2.x + 
                a * (1 + e) / (1 + a) * (this.r * wP2.y));
        vP2.z = -e * vP2.z;
        //negative sign to repel ball from player
        wP2.y = ((a - e) / (1 + a) * wP2.y + 
                 (1 + e) / (1 + a) * (vP2.x) / (this.r));
        wP2.x = ((a - e) / (1 + a) * wP2.x + 
                 (1 + e) / (1 + a) * (vP2.y) / (-this.r));
        
        wP1.y = Math.cos(collideAngle2) * wP2.y + Math.sin(collideAngle2) * wP2.x;
        wP1.z = wP2.z;
        wP1.x = -Math.sin(collideAngle2) * wP2.y + Math.cos(collideAngle2) * wP2.x;
  
        //let vxP = Math.cos(collideAngle) * this.vx + Math.sin(collideAngle) * this.vz;
        vP1.y = Math.cos(collideAngle2) * vP2.y + Math.sin(collideAngle2) * vP2.x;
        vP1.z = vP2.z;
        vP1.x = -Math.sin(collideAngle2) * vP2.y + Math.cos(collideAngle2) * vP2.x;
        
        
        //to hit ball if stationary
        wP1.x += -0.1; 
        
        
        this.w.x = Math.cos(collideAngle1) * wP1.x + Math.sin(collideAngle1) * wP1.z;
        this.w.y = wP1.y;
        this.w.z = -Math.sin(collideAngle1) * wP1.x + Math.cos(collideAngle1) * wP1.z;
  
        this.vel.x = Math.cos(collideAngle1) * vP1.x + Math.sin(collideAngle1) * vP1.z;
        this.vel.y = vP1.y;
        this.vel.z = -Math.sin(collideAngle1) * vP1.x + Math.cos(collideAngle1) * vP1.z;
           
        
        if(ballToPlayer <= (this.r + playerWidth / 2 )){
          this.pos.x = playerX + (this.r + playerWidth / 2) * 1.1 * Math.sin(collideAngle1);
          this.pos.z = playerZ + (this.r + playerWidth / 2) * 1.1 * Math.cos(collideAngle1);
          
        } 
        
        if(botNum != -1 && this.alive){        
          this.botsHit.push(botNum);
          
          
        }
        else if(botNum == -1 && this.alive){
          this.botsHit.push(botNum);
          
          //playerAlive = 0;
        }
      }
  
      //collision with top of player: 
  
      if (ballToPlayer <= this.r + personWidth / 2 && this.pos.y < playerY - 20 + 40 && this.pos.y > playerY - 20 - 40) {
        let collideAngle = Math.atan2(this.vel.x, this.vel.z);
        
        let vP = p5.createVector(-1, -1, -1);
        let wP = p5.createVector(-1, -1, -1); 
        
        wP.x = Math.cos(collideAngle) * this.w.x - Math.sin(collideAngle) * this.w.z;
        wP.y = this.w.y;
        wP.z = Math.sin(collideAngle) * this.w.x + Math.cos(collideAngle) * this.w.z;
  
        //let vxP = Math.cos(collideAngle) * this.vx + Math.sin(collideAngle) * this.vz;
        vP.x = Math.cos(collideAngle) * this.vel.x - Math.sin(collideAngle) * this.vel.z;
        vP.y = this.vel.y;
        vP.z = Math.sin(collideAngle) * this.vel.x + Math.cos(collideAngle) * this.vel.z;
        
        vP.x = ((1 - a * e) / (1 + a) * vP.x + 
                a * (1 + e) / (1 + a) * (this.r * wP.z));
        vP.z = ((1 - a * e) / (1 + a) * vP.z + 
                a * (1 + e) / (1 + a) * (- this.r * wP.x));
        vP.y = -e * vP.y;
        wP.x = ((a - e) / (1 + a) * wP.x + 
                (1 + e) / (1 + a) * (vP.z) / (- this.r));
        wP.z = ((a - e) / (1 + a) * wP.z + 
                (1 + e) / (1 + a) * (vP.x) / (this.r));
        
        this.w.x = Math.cos(collideAngle) * wP.x + Math.sin(collideAngle) * wP.z;
        this.w.y = wP.y;
        this.w.z = -Math.sin(collideAngle) * wP.x + Math.cos(collideAngle) * wP.z;
  
        //let vxP = Math.cos(collideAngle) * this.vx + Math.sin(collideAngle) * this.vz;
        this.vel.x = Math.cos(collideAngle) * vP.x + Math.sin(collideAngle) * vP.z;
        this.vel.y = vP.y;
        this.vel.z = -Math.sin(collideAngle) * vP.x + Math.cos(collideAngle) * vP.z;
        
        this.pos.y = playerY - 20 - 40;
        
  
      }
      
      
      //collision with bottom of player
      if (ballToPlayer <= this.r + personWidth / 2 && this.pos.y < playerY + personHeight + 50 && this.pos.y > playerY + personHeight - 50) {
        
        camVelY = this.vel.y;
        this.pos.y = playerY + personHeight;
      }
  
    }
    
    magnusEffect(p5, m){
      let lift = p5.createVector(-1, -1, -1);
      
      lift.x = 4 / 3 * (2 * Math.PI * (this.r ** 3) * (this.vel.y * this.w.z - this.vel.z * this.w.y)) / 10000000; 
      lift.y = 4 / 3 * (2 * Math.PI * (this.r ** 3) * (this.vel.z * this.w.x - this.vel.x * this.w.z)) / 10000000;
      lift.z = 4 / 3 * (2 * Math.PI * (this.r ** 3) * (this.vel.x * this.w.y - this.vel.y * this.w.x)) / 10000000;
          
      this.vel.add(lift.copy().div(m));
      
    }
    
    slipping(wid, thick, len, hei, mu, m, g){
    
      
      if(this.pos.x <= wid / 2 - thick * 1.075 - this.r &&
         this.pos.x >= -(wid / 2 - thick * 1.075 - this.r) &&
         this.pos.z <= len / 2 - thick * 1.075 - this.r && 
         this.pos.z >= -(len / 2 - thick * 1.075 - this.r)) { 
        if(this.pos.y <= hei / 2 - thick - this.r * 0.9 &&
           this.pos.y >= hei / 2 - thick - this.r * 1.1 &&
           this.vel.y <= 0.2 && this.vel.y >= -0.2 && 
          Math.abs(Math.sqrt(this.vel.x ** 2 + this.vel.z ** 2) - Math.sqrt((this.w.x) ** 2 + (this.w.z) ** 2) * this.r / 10) > 0){
  
          this.w.y *= 0.9;
  
          let wzP = Math.cos(-Math.PI / 2) * this.w.z - Math.sin(-Math.PI / 2) * this.w.x;
          let wxP = Math.sin(-Math.PI / 2) * this.w.z + Math.cos(-Math.PI / 2) * this.w.x;
  
          let angle = Math.atan2((this.vel.x + wxP * this.r), (this.vel.z + wzP * this.r));
  
          let finTime = (-this.vel.x - wxP * this.r) / (5 / 2 * mu * g * Math.sin(angle));
  
          if(Math.abs(finTime) <= 0.00001){
            finTime = (-this.vel.z - wzP * this.r) / (5 / 2 * mu * g * Math.cos(angle));
          }
  
          this.vel.x += 1 * mu * m * g * Math.sin(angle) * finTime;
          this.vel.z += 1 * mu * m * g * Math.cos(angle) * finTime;
  
          wxP += 1 * (3 / 2) * (mu * g / this.r) * Math.sin(angle) * finTime;
          wzP += 1 * (3 / 2) * (mu * g / this.r) * Math.cos(angle) * finTime;      
          this.w.z = Math.cos(Math.PI / 2) * wzP - Math.sin(Math.PI / 2) * wxP;
          this.w.x = Math.sin(Math.PI / 2) * wzP + Math.cos(Math.PI / 2) * wxP;
  
        }
      }
    }
    playerCanMove(playerX, playerY, playerZ, wid, thick, camVelX, len, personWidth, camVelZ){
      let ballToPlayer = Math.sqrt((this.pos.x - playerX) ** 2 + (this.pos.z - playerZ) ** 2);
      
      if(this.pos.x >= wid / 2 - thick - this.r && ballToPlayer <= (this.r + personWidth / 2 ) * 1.1) { 
        camVelX = 0;
        this.vel.x = 0;
        this.w.z = 0;
      }
      if(this.pos.x <= -(wid / 2 - thick - this.r) && ballToPlayer <= (this.r + personWidth / 2 ) * 1.1) { 
        camVelX = 0;
        this.vel.x = 0;
        this.w.z = 0;
      }
      if(this.pos.z >= len / 2 - thick - this.r && ballToPlayer <= (this.r + personWidth / 2 ) * 1.1) { 
        camVelZ = 0;
        this.vel.z = 0;
        this.w.x = 0;
      }
      if(this.pos.z <= -(len / 2 - thick - this.r) && ballToPlayer <= (this.r + personWidth / 2 ) * 1.1) { 
        camVelZ = 0;
        this.vel.z = 0;
        this.w.x = 0;
      }
    }
    ballCollide(ballTwo, e){
      let ballToBallVector = ballTwo.pos.copy().sub(this.pos);
      let ballToBallDist = ballToBallVector.mag();
      
      if(ballToBallDist <= this.r + ballTwo.r){
  
        if(this.vel.copy().sub(ballTwo.vel).mag() >= 50){
          this.recentlyCollided = 1;
          ballTwo.recentlyCollided = 1;
        }
        
        
        let rDiffMagnitude = ballToBallDist;
        
        let normalOne = ballToBallVector.copy().normalize();
  
        let normalTwo = normalOne.copy().mult(-1);
  
        let rOne = normalOne.copy().mult(this.r);
  
        let rTwo = normalTwo.copy().mult(ballTwo.r);
  
        let vp1 = this.pos.copy().sub(this.w.copy().cross(rOne));
        
        let vp2 = ballTwo.pos.copy().sub(ballTwo.w.copy().cross(rTwo));
      
        let vr = vp2.copy().sub(vp1);
  
        let jr = - (1 + e) * (vr.dot(normalOne)) / (1 / this.m + 1 / ballTwo.m);
        
        this.vel.sub(normalOne.copy().mult(-0.1 * jr / this.m));
  
        ballTwo.vel.add(normalOne.copy().mult(-0.1 * jr / ballTwo.m));
        //the negative sign and 0.1 make it work. why?
  
        ballTwo.pos = this.pos.copy().add(normalOne.mult(this.r + ballTwo.r));
  
        
      
          
        
      }
    }
    setTeam(len, thick){
      if(this.pos.z <= len / 2 - thick - this.r && this.pos.z >= 0){
        this.team = 0;
      }
      if(this.pos.z >= -(len / 2 - thick - this.r) && this.pos.z <= 0){
        this.team = 1;
      }
    }
    updateMotion(p5, g) {   
      let accel = p5.createVector(0, g, 0);
      
      this.vel.add(accel);
      this.pos.add(this.vel);
      
    }
  }
  