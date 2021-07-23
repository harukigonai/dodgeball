import logo from './logo.svg';
import './App.css';
import Sketch from "react-p5";
import Bot from "./Bot"
import Ball from "./Ball"

function App() {

  var cam;

  function setup(p5, canvasParentRef) {  
    p5.createCanvas(700, 500, p5.WEBGL).parent(canvasParentRef);
    p5.pixelDensity(2);
    p5.frameRate(120);

    let partialBallConfigs = { 
      vel: { x: 0, y: 0, z: 0 },
      angVel: { x: 0, y: 0, z: 0 },
      mass: 20,
      radius: 50
    }

    let ball1 = new Ball(p5, { ...partialBallConfigs, pos: { x: -550, y: 1000, z: -1750 }});
    let ball2 = new Ball(p5, { ...partialBallConfigs, pos: { x: -300, y: 1000, z: -1750 }});
    let ball3 = new Ball(p5, { ...partialBallConfigs, pos: { x: -100, y: 1000, z: -1750 }});
    let ball4 = new Ball(p5, { ...partialBallConfigs, pos: { x: 100, y: 1000, z: -1750 }});
    let ball5 = new Ball(p5, { ...partialBallConfigs, pos: { x: 300, y: 1000, z: -1750 }});
    let ball6 = new Ball(p5, { ...partialBallConfigs, pos: { x: 500, y: 1000, z: -1750 }});

    balls.push(ball1, ball2, ball3, ball4, ball5, ball6);

    // console.log(balls)
    //balls.push(ball6);
    



    let bot1 = new Bot(p5, 1000, 0, 2000, 2, 50, 200, 0);
    let bot2 = new Bot(p5, 300, 0, 2000, 2, 50, 200, 0);
    let bot3 = new Bot(p5, -300, 0, 2000, 2, 50, 200, 0);
    let bot4 = new Bot(p5, -1000, 0, 2000, 2, 50, 200, 0);
    let bot5 = new Bot(p5, 1000, 0, -2000, 2, 50, 200, 1);
    let bot6 = new Bot(p5, 300, 0, -2000, 2, 50, 200, 1);
    let bot7 = new Bot(p5, -300, 0, -2000, 2, 50, 200, 1);
    let bot8 = new Bot(p5, -1000, 0, -2000, 2, 50, 200, 1);
    
    bots.push(bot1, bot2, bot3, bot4, bot5, bot6, bot7, bot8);





  //bots.push(bot1);
  
//   bot9 = new Bot(1000, 0, 2000, 2, 50, 200, 0);
//   bot10 = new Bot(300, 0, 2000, 2, 50, 200, 0);
//   bot11 = new Bot(-300, 0, 2000, 2, 50, 200, 0);
//   bot12 = new Bot(-1000, 0, 2000, 2, 50, 200, 0);
//   bot13 = new Bot(1000, 0, -2000, 2, 50, 200, 1);
//   bot14 = new Bot(300, 0, -2000, 2, 50, 200, 1);
//   bot15 = new Bot(-300, 0, -2000, 2, 50, 200, 1);
//   bot16 = new Bot(-1000, 0, -2000, 2, 50, 200, 1);
  
//   bots.push(bot9, bot10, bot11, bot12, bot13, bot14, bot15, bot16);
  
  //bots.push(bot1, bot2, bot3, bot4);
  
  cx = p5.width / 2;
  cy = 50;
  buffer = p5.createGraphics(700, 350);
  buffer.background(175);
  buffer.translate(350, 175);

  cam = p5.createCamera();
  cam.setPosition(0, hei / 2 - thick - ball1.r, -2000);
  cam.centerX = 0;
  cam.centerY = hei / 2 - thick - ball1.r;
  cam.centerZ = -2000 + 433.3;

}





  //make it possible to knock ball out of bot's hand 
  //make bot wait before throwing
  //make bots dodge
  //if one bot is already going for a ball, the other bots should stay back
  //if the ball hits someone and then a teammate catches it, the hit person should be safe
  //make bots able to jump

  //make playerdie when hit

  let m = 10;
  let g = 0.4;
  let acc = g;

  let mu = 1;

  let e = 0.9;
  let a = 0.66;

  let camVelX = 0;
  let camVelY = 0;
  let camVelZ = 0;
  let camSpeed = 6;

  let cosTheta = 0;
  let theta = 0;

  let forward = 0;
  let back = 0;

  let spacePressed = 0;

  let fallSpeed = 0;

  let ballGrabbed = 0;

  let len = 4000;
  let wid = 2000;
  let hei = 2000;
  let thick = 10;
  let personWidth = 100;
  let personHeight = 200;

  let rho = 1.225;

  let canLook; 

  // let collidedBalls = new Array();
  // let balls = new Array();
  let collidedBalls = [];
  let balls = [];


  let grabbedBall = -1;

  let rightHanded = 1;
  let timeLastDropped = 0;
  let timeBallGrabbed = 0;
  let ballSpin = 0;

  let timeTappedA = -1;
  let timeTappedD = -1;

  let doingLeftSlide = 0;
  let doingRightSlide = 0;

  let slideProgress = 1;
  let slideDir = -1;

  let keyWasDown65 = 0;
  let keyWasDown68 = 0; 

  let timeLastSlided = 0;

  let bots = [];

  let playerAlive = 1;

  let leftClickPreviouslyHeld;
  let rightClickPreviouslyHeld;

  let playerAlreadyDead = 0;

  let endGame = -1;
  let gameAlreadyOver = 0;

  let px2 = -1;
  let py2 = -1;
  let cx, cy;

  let buffer;

  function draw(p5) {
    // let txt = p5.createP('');
    
    // if(endGame != -1 && !gameAlreadyOver){
    //   if(endGame == 0){
    // 	  txt = p5.createP('Draw!');
    // }
    // else if(endGame == 1){
    //   txt = p5.createP('Won!');
    // }
    // else if(endGame == 2){
    //   txt = p5.createP('Lost!');
    // }
    // gameAlreadyOver = 1;
    
    // }
    
    // txt.position(9000, 1000);
    // txt.style('font-size', '180px');
    // txt.style('font-style', 'normal');
    // txt.style('font-weight', 'bold');
    // txt.style('font-family', 'Gill Sans, sans-serif');
    
    
    p5.background(175);



    // for(let i = 0; i < balls.length; i++){
    //   console.log(balls[i].pos.x);
    // }



    
    
    p5.stroke(0);
    p5.strokeWeight(2);
    
    let c = p5.color(140);
    p5.fill(c);
    
    c = p5.color('hsba(160, 100%, 50%, 0.5)');

    p5.push();
    p5.fill(c);
    p5.translate(-(wid / 2 + thick / 2), 0, 0);
    p5.tint(255, 0);
    p5.box(thick, hei, len);
    p5.pop();

    p5.push();
    p5.fill(c);
    p5.translate(wid / 2 + thick / 2, 0, 0);
    p5.box(thick, hei, len);
    p5.pop();

    p5.push();
    p5.fill(c);
    p5.translate(0, hei / 2 + thick / 2, 0);
    p5.box(wid, thick, len);
    p5.pop();

    p5.push();
    p5.fill(c);
    p5.translate(0, -(hei / 2 + thick / 2), 0);
    p5.box(wid, thick, len);
    p5.pop();

    p5.push();
    p5.fill(c);
    //c = color('hsba(0, 100%, 50%, 0.5)');
    //fill(c);
    p5.translate(0, 0, len / 2 + thick / 2);
    p5.box(wid, hei, thick);
    p5.pop();

    p5.push();
    p5.fill(c);
    //c = color('hsba(0, 100%, 50%, 0.5)');
    //fill(c);
    p5.translate(0, 0, -(len / 2 + thick / 2));
    p5.box(wid, hei, thick);
    p5.pop();
    
    p5.push();
    p5.fill(c);
    p5.translate(0, hei / 2 + thick / 2, 0);
    p5.box(wid, thick, 20);
    p5.pop();
    
    //playerAlive = 1;
    
    
    for(let i = 0; i < balls.length; i++){
      balls[i].recentlyCollided = 0;
    }
    collidedBalls = [];
    
    for(let i = 0; i < balls.length; i++){
      balls[i].drawBall(p5);
    }
    
    for(let i = 0; i < balls.length; i++){
      for(let j = i + 1; j < balls.length; j++){ 
        balls[i].ballCollide(balls[j], e);
      }
    }
    
    for(let i = 0; i < balls.length; i++){
      if(balls[i].recentlyCollided == 1){
        collidedBalls.push(i);
      }
    }

    keyPressed(p5);
    
  //   for(let i = 0; i < balls.length; i++){
  //     balls[i].collideWall();
  //     //run collision command

  //     balls[i].collidePlayer(cam.eyeX, cam.eyeY, cam.eyeZ, personWidth, personHeight, -1);
        
  //     for(let j = 0; j < bots.length; j++){
  //       balls[i].collidePlayer(bots[j].pos.x, bots[j].pos.y, bots[j].pos.z, bots[j].width, bots[j].height, j);
  //     }

  //     //change to collide with bots as well

  //     balls[i].magnusEffect();
  //     balls[i].slipping();
      
  //     balls[i].setTeam();
      
  //     balls[i].playerCanMove(cam.eyeX, cam.eyeY, cam.eyeZ);
  //     //make equivalent for bots
      
  //     balls[i].updateMotion();
  //   }
    
    cam.pan(-p5.movedX * 0.002);
    if(canLookCheck(p5) == 1){  
      cam.tilt(p5.movedY * 0.002);
    }
    
    if(playerAlive){
      cam.eyeX += camVelX;
      cam.centerX += camVelX;
      cam.eyeY += camVelY;
      cam.centerY += camVelY;
      cam.eyeZ += camVelZ;
      cam.centerZ += camVelZ;
    }
    
    if(playerAlive == 0 && ballGrabbed){
      balls[grabbedBall].grabbed = 0;
      grabbedBall = -1;
      ballGrabbed = 0;
    }
    
    for(let i = 0; i < bots.length; i++){
      if(bots[i].alive == 0){
        bots.splice(i, 1);
      }
    }
    
    // if(frameCount / 120 <= 3){
    //   print(3);
    // }

    // console.log(bots[1].pos)
    
    for(let i = 0; i < bots.length; i++){ 
      bots[i].drawBot(p5);
      if(!bots[i].ballGrabbed){
        bots[i].runToBall(balls, hei, thick);
        bots[i].pickUpBall(p5, balls);  
      }
      if(bots[i].ballGrabbed){
        bots[i].ballInHand(p5, balls, i, bots, playerAlive, cam, collidedBalls, hei, thick, a, e, wid, len, ballGrabbed, grabbedBall)
      }
      if(bots[i].canThrowBall){
        bots[i].throwBall(p5, balls, i, g);
      }
      bots[i].collideWall(p5, hei, thick, wid, len);
        
      bots[i].collidePlayer(p5, cam.eyeX, cam.eyeY, cam.eyeZ, personWidth, personHeight);
      for(let j = 0; j < bots.length; j++){
        if(j != i){
          bots[i].collidePlayer(p5, bots[j].pos.x, bots[j].pos.y, bots[j].pos.z, bots[j].width, bots[j].height);
        }
      }
      
      if(p5.frameCount % 10 == 0){
        bots[i].ballIncoming(p5, balls, hei, thick);
      }
      
      bots[i].postDodgingDamping(hei, thick);
      
      bots[i].updateMotion(p5, g);
      
    }
    
    for(let i = 0; i < balls.length; i++){
      for(let j = i + 1; j < balls.length; j++){ 
        balls[i].ballCollide(balls[j]);
      }
    }
    
    
    for(let i = 0; i < balls.length; i++){
      balls[i].collideWall(p5, {
        hei: hei, 
        thick: thick, 
        a: a, 
        e: e, 
        wid: wid, 
        len: len, 
        bots: bots, 
        playerAlive: playerAlive, 
        ballGrabbed: ballGrabbed, 
        balls: balls, 
        grabbedBall: grabbedBall
      });
      //run collision command

      balls[i].collidePlayer(p5, cam.eyeX, cam.eyeY, cam.eyeZ, personWidth, personHeight, -1, personHeight, e, a, personWidth, camVelY, m);
        
      for(let j = 0; j < bots.length; j++){
        balls[i].collidePlayer(p5, bots[j].pos.x, bots[j].pos.y, bots[j].pos.z, bots[j].width, bots[j].height, j, personHeight, e, a, personWidth, camVelY, m);
      }

      //change to collide with bots as well

      balls[i].magnusEffect(p5, m);
      balls[i].slipping(wid, thick, len, hei, mu, m, g);
      
      balls[i].setTeam(len, thick);
      
      balls[i].playerCanMove(cam.eyeX, cam.eyeY, cam.eyeZ, wid, thick, camVelX, len, personWidth, camVelZ);
      //make equivalent for bots
      
      balls[i].updateMotion(p5, g);
    }

    
    //no idea if this actually works
    //but its to make sure that balls that arent being seeked by bots 
    //are set to not be seeked
    let ballsBeingSeeked = [];
    for(let i = 0; i < bots.length; i++){
      ballsBeingSeeked.push(bots[i].seekingBall);
    }
    for(let i = 0; i < ballsBeingSeeked.length; i++){
      if(ballsBeingSeeked[i] != -1){
        balls[ballsBeingSeeked[i]].seekedByBot = 0;
      }
    }
    

    // let playerBallDist = Math.sqrt((cam.eyeX - ball1.pos.x) ** 2 + (cam.eyeY - ball1.pos.y) ** 2 + (cam.eyeZ - ball1.pos.z) ** 2);
    // if (playerBallDist < ball1.r + personWidth / 2) {
      //print('ded');
    // }

    //buffer.stroke(0);
    //if (frameCount > 1) {
    //buffer.line(px2, py2, x2, y2);
    //}

    //px2 = 2;
    //py2 = 2;
    
    // for(let i = 0; i < bots.length; i++){ 
    //   if(bots[i].alive == 0){
    //     bots.splice(i, 1);
    //   }
    // }
    if (playerAlive == 0){  
    cam.eyeX = -300;
    cam.eyeY = 0;
    cam.eyeZ = -len / 2 + 100;
    
    if(!playerAlreadyDead){
      cam.centerY = -300;
      cam.centerY = 0;
      cam.centerZ = -len / 2 + 100 + 433.3;
      
      // print(123);
      
      playerAlreadyDead = 1;
    }
    }
    
    let teamZeroCount = 0;
    let teamOneCount = 0;
    for(let i = 0; i < bots.length; i++){
    if(bots[i].alive){
        if(bots[i].team == 0){
      teamZeroCount++;
      }
      else if(bots[i].team == 1){
      teamOneCount++;
      }
    }
    
    if(playerAlive){
      teamOneCount++;
    }
    }
    if(teamZeroCount == 0 && teamOneCount == 0){
    endGame = 0;
    }
    else if(teamZeroCount == 0){
    endGame = 1;
    }
    else if(teamOneCount == 0){
    endGame = 2;
    }
  }

  function keyPressed(p5) {
    // let camSpeed = 6;

    let eyeCenterVector = p5.createVector(cam.centerX - cam.eyeX,
                                  cam.centerY - cam.eyeY,
                                  cam.centerZ - cam.eyeZ);
                                  
    //IF ON GROUND
    onGround(p5);

    wallCollide(p5);
    //prevent phasing thru wall
    
    //grav
    mvtAndGrav(p5);
    
    grabBall(p5, eyeCenterVector);

    //Pointerlock:

    if (p5.keyIsDown(84)) {
      p5.requestPointerLock();
    }


    return false;
  }

  function canLookCheck(p5){
    
    let zxMag = Math.sqrt((cam.centerZ - cam.eyeZ) ** 2 + 
                    (cam.centerX - cam.eyeX) ** 2);
    let dirTheta = 0; 
    
    dirTheta = Math.tan((cam.centerY - cam.eyeY) / zxMag);
    
    if(canLook == 0 && ((dirTheta <= - Math.PI / 2 * 0.9 && p5.movedY >= 0) || 
                        (dirTheta >= Math.PI / 2 * 0.9 && p5.movedY <= 0))){
      canLook = 1;
    }
    else if(dirTheta <= - Math.PI / 2 * 0.9 || dirTheta >= Math.PI / 2 * 0.9){
      canLook = 0;
    }
    else if(dirTheta > - Math.PI / 2 * 0.9 || dirTheta < Math.PI / 2 * 0.9){
      canLook = 1;
    }
    
    return canLook;
  }

  function rotateVectorY(p5, vector, angle){
    let result = p5.createVector(-1, vector.y, -1);

    result.x = vector.x * Math.cos(angle) - vector.z * Math.sin(angle);
    result.y = vector.y;
    result.z = vector.x * Math.sin(angle) + vector.z * Math.cos(angle);
    
    return result;
  }

  function slideCheck(p5){
    //execute if doingBarrelRolls are false
    
    if(p5.keyIsDown(65) && (p5.keyIsDown(65) != keyWasDown65)){
      
      if(p5.frameCount / 120 - timeTappedA <= 0.1){
        doingLeftSlide = 1;
      }
      timeTappedA = p5.frameCount / 120;
      
    }
      
    keyWasDown65 = p5.keyIsDown(65);
    
    
    if(p5.keyIsDown(68) && (p5.keyIsDown(68) != keyWasDown68)){
      
      if(p5.frameCount / 120 - timeTappedD <= 0.5){
        doingRightSlide = 1;
      }
      
      timeTappedD = p5.frameCount / 120;
    }
      
    keyWasDown68 = p5.keyIsDown(68);

    
  }

  function slide(p5){
    //execute only if doingWBarrelRoll is true
    
    if(slideProgress == 1){
      slideDir = p5.createVector(cam.centerX - cam.eyeX,
                              0,
                              cam.centerZ - cam.eyeZ);
    
      slideDir.normalize();
      if(doingLeftSlide){
        slideDir = rotateVectorY(p5, slideDir, - Math.PI / 2);
      }
      else if(doingRightSlide){
        slideDir = rotateVectorY(p5, slideDir, Math.PI / 2);
      }
    }
    
    camVelX = slideProgress * 10 * camSpeed * slideDir.x;
    camVelZ = slideProgress * 10 * camSpeed * slideDir.z;
    
      
    slideProgress -= 0.1;
    if(slideProgress <= 0){
      doingLeftSlide = 0;
      doingRightSlide = 0;
      slideProgress = 1;
      timeLastSlided = p5.frameCount / 120;
    }
  }


  function onGround(p5){
    if (cam.eyeY > hei / 2 - thick - personHeight - 0.05) {

      //JUMP
      if (p5.keyIsDown(32) && spacePressed == 0) {
        camVelY = 0;
        camVelY += -15;

        spacePressed = 1;
      } else {
        spacePressed = 0;
      }

      fallSpeed = 0;
      
    }
  }

  function wallCollide(p5){
    if (cam.eyeY > hei / 2 - thick - personHeight - 0.05 && !p5.keyIsDown(32)) {
      cam.setPosition(cam.eyeX, hei / 2 - thick - personHeight - 0.1, cam.eyeZ);

      camVelX = 0;
      camVelY = 0;
      camVelZ = 0;
      
      //sliding
      if(p5.frameCount / 120 - timeLastSlided >= 0.7){
        slideCheck(p5);
        
        if(doingLeftSlide || doingRightSlide){
          slide(p5);
        }
      }
    }

    if (cam.eyeY <= -(hei / 2 - thick - personHeight)) {
      cam.setPosition(cam.eyeX, -(hei / 2 - thick - personHeight - 3), cam.eyeZ);
    }

    if (cam.eyeX >= wid / 2 - thick - personWidth / 2 ) {
      cam.setPosition(wid / 2 - thick - personWidth / 2 - 3, cam.eyeY, cam.eyeZ);
    }

    if (cam.eyeX <= -(wid / 2 - thick - personWidth / 2)) {
      cam.setPosition(-(wid / 2 - thick - personWidth / 2 - 3), cam.eyeY, cam.eyeZ);
    }

    if (cam.eyeZ >= 0) {
      cam.setPosition(cam.eyeX, cam.eyeY, - 3);
    }

    if (cam.eyeZ <= -(len / 2 - thick - personWidth / 2)) {
      cam.setPosition(cam.eyeX, cam.eyeY, -(len / 2 - thick - personWidth / 2 - 3));
    }
  }

  function mvtAndGrav(p5){
    // let camSpeed = 3;

    if (cam.eyeY < hei / 2 - thick - personHeight - 0.05) {

      if (p5.keyIsDown(68) && p5.keyIsDown(65)) {
        camVelX = 0;
        camVelZ = 0;
      } 
      else if (p5.keyIsDown(68) && p5.keyIsDown(87)) {
        let dirNormXZ = p5.createVector(cam.centerX - cam.eyeX, 
                                    0, 
                                    cam.centerZ - cam.eyeZ);
        dirNormXZ.normalize();
        dirNormXZ = rotateVectorY(p5, dirNormXZ, Math.PI / 4);
        
        camVelX = camSpeed * dirNormXZ.x;
        camVelZ = camSpeed * dirNormXZ.z;
      } 
      else if (p5.keyIsDown(68) && p5.keyIsDown(83)) {
        let dirNormXZ = p5.createVector(cam.centerX - cam.eyeX, 
                                    0, 
                                    cam.centerZ - cam.eyeZ);
        dirNormXZ.normalize();
        dirNormXZ = rotateVectorY(p5, dirNormXZ, 3 * Math.PI / 4);
        
        camVelX = camSpeed * dirNormXZ.x;
        camVelZ = camSpeed * dirNormXZ.z;
      } 
      else if (p5.keyIsDown(65) && p5.keyIsDown(87)) {
        let dirNormXZ = p5.createVector(cam.centerX - cam.eyeX, 
                                    0, 
                                    cam.centerZ - cam.eyeZ);
        dirNormXZ.normalize();
        dirNormXZ = rotateVectorY(p5, dirNormXZ, - Math.PI / 4);
        
        camVelX = camSpeed * dirNormXZ.x;
        camVelZ = camSpeed * dirNormXZ.z;
      } 
      else if (p5.keyIsDown(65) && p5.keyIsDown(83)) {
        let dirNormXZ = p5.createVector(cam.centerX - cam.eyeX, 
                                    0, 
                                    cam.centerZ - cam.eyeZ);
        dirNormXZ.normalize();
        dirNormXZ = rotateVectorY(p5, dirNormXZ, - 3 * Math.PI / 4);
        
        camVelX = camSpeed * dirNormXZ.x;
        camVelZ = camSpeed * dirNormXZ.z;
      } 
      else if (p5.keyIsDown(87) && p5.keyIsDown(83)) {
        camVelX = 0;
        camVelZ = 0;
      } 
      else if (p5.keyIsDown(68) && !doingLeftSlide && !doingRightSlide) {
        let dirNormXZ = p5.createVector(cam.centerX - cam.eyeX, 
                                        0, 
                                        cam.centerZ - cam.eyeZ);
        dirNormXZ.normalize();
        dirNormXZ = rotateVectorY(p5, dirNormXZ, Math.PI / 2);
        camVelX = camSpeed * dirNormXZ.x;
        camVelZ = camSpeed * dirNormXZ.z;

        // console.log(dirNormXZ.z)
      } 
      else if (p5.keyIsDown(65) && !doingLeftSlide && !doingRightSlide) {
        let dirNormXZ = p5.createVector(cam.centerX - cam.eyeX, 
                                    0, 
                                    cam.centerZ - cam.eyeZ);
        dirNormXZ.normalize();
        dirNormXZ = rotateVectorY(p5, dirNormXZ, - Math.PI / 2);
        
        camVelX = camSpeed * dirNormXZ.x;
        camVelZ = camSpeed * dirNormXZ.z;
      } 
      else if (p5.keyIsDown(87) && p5.keyIsDown(16)) {
        let dirNormXZ = p5.createVector(cam.centerX - cam.eyeX, 
                                    0, 
                                    cam.centerZ - cam.eyeZ);
        dirNormXZ.normalize();
        dirNormXZ = rotateVectorY(p5, dirNormXZ, 0);
        
        camVelX = 3 * camSpeed * dirNormXZ.x;
        camVelZ = 3 * camSpeed * dirNormXZ.z;
      } 
      else if (p5.keyIsDown(87)) {
        let dirNormXZ = p5.createVector(cam.centerX - cam.eyeX, 
                                    0, 
                                    cam.centerZ - cam.eyeZ);
        
        dirNormXZ.normalize();
        dirNormXZ = rotateVectorY(p5, dirNormXZ, 0);
        
        camVelX = camSpeed * dirNormXZ.x;
        camVelZ = camSpeed * dirNormXZ.z;

        // camVelX = 3;
        // camVelZ = 3;
        
      } 
      else if (p5.keyIsDown(83)) {
        let dirNormXZ = p5.createVector(cam.centerX - cam.eyeX, 
                                    0, 
                                    cam.centerZ - cam.eyeZ);
        dirNormXZ.normalize();
        dirNormXZ = rotateVectorY(p5, dirNormXZ, - Math.PI);
        
        camVelX = camSpeed * dirNormXZ.x;
        camVelZ = camSpeed * dirNormXZ.z;
      } 
      
    
        
      if(fallSpeed <= 1.5 * acc){
        fallSpeed += 0.1 * acc;
      }

      camVelY += fallSpeed;
    }
  }

  function grabBall(p5, eyeCenterVector){
    let dirHat = eyeCenterVector.copy().normalize();
    
    if(collidedBalls.includes(grabbedBall)){
      timeLastDropped = p5.frameCount / 120;
      ballGrabbed = 0;
      balls[grabbedBall].grabbed = 0;
      grabbedBall = -1;
    }
    
    let canGrabBall = 0;
    if(p5.frameCount / 120 - timeLastDropped >= 1){
      canGrabBall = 1;
    }
    
    let throwStrength = -1;
    if(p5.frameCount / 120 - timeBallGrabbed < 1){
      throwStrength = (p5.frameCount / 120 - timeBallGrabbed) * 75;
    }
    else if(p5.frameCount / 120 - timeBallGrabbed >= 1){
      throwStrength = 75;
    }
      
    if(canGrabBall == 1){ 
      for(let i = 0; i < balls.length && ballGrabbed == 0; i++){
        if(!balls[i].grabbed){ 
          let ballVel = balls[i].vel.mag();
          let ballSpin = Math.sqrt(balls[i].w.x ** 2 +
                            balls[i].w.y ** 2 +
                            balls[i].w.z ** 2);


          let vVector = p5.createVector(balls[i].pos.x - cam.eyeX,
                                    balls[i].pos.y - cam.eyeY,
                                    balls[i].pos.z - cam.eyeZ);

          let projVector = dirHat.copy().mult(vVector.dot(dirHat));
          
          let projMag = projVector.mag();
          let perpVector = vVector.copy().sub(projVector);
          let perpMag = perpVector.mag();

          let slope = 0.25;
          
          
          
          let relVel = p5.createVector(balls[i].vel.x - camVelX,
                                    balls[i].vel.y - camVelY,
                                    balls[i].vel.z - camVelZ);
          let relVelMag = relVel.mag();
          //account for spin also
          
          let upperProbLimit = Math.E ** (-relVelMag / 30) * 1000;
          
          let randomNum = Math.random() * 1000;
          let probReached = randomNum <= upperProbLimit;
          //print(upperProbLimit + ' ' + randomNum);
          
          if (p5.mouseIsPressed && p5.mouseButton === p5.LEFT && 
              slope * projMag >= perpMag && projMag < 500 && ballGrabbed == 0 && probReached) {
            ballGrabbed = 1;
            grabbedBall = i;
            balls[grabbedBall].grabbed = 1;
            timeBallGrabbed = p5.frameCount / 120; 
            
            leftClickPreviouslyHeld = 1;
          }
          else{
            leftClickPreviouslyHeld = 0;
          }
        }
      }

      if(ballGrabbed == 1){
        if(balls[grabbedBall].alive){
          balls[grabbedBall].botsHit = [];
          balls[grabbedBall].caughtByTeam = 1;
        }
        
        let rho = Math.sqrt((cam.centerX - cam.eyeX) ** 2 + 
                      (cam.centerY - cam.eyeY) ** 2 +
                      (cam.centerZ - cam.eyeZ) ** 2);
        let theta = Math.atan2(cam.centerX - cam.eyeX,
                          cam.centerZ - cam.eyeZ);
        
        let phi = Math.cos((cam.centerY - cam.eyeY) / Math.sqrt((cam.centerX - cam.eyeX) ** 2 + (cam.centerY - cam.eyeY) ** 2 + (cam.centerZ - cam.eyeZ) ** 2));
        
        
        rho /= 2;
        phi -= Math.PI / 8;
        theta -= Math.PI / 8;
        
        let vecX = rho * Math.sin(phi) * Math.sin(theta);
        let vecY = rho * Math.cos(phi);
        let vecZ = rho * Math.sin(phi) * Math.cos(theta);
        
        balls[grabbedBall].pos.x = cam.eyeX + vecX;
        balls[grabbedBall].pos.y = cam.eyeY + vecY;
        balls[grabbedBall].pos.z = cam.eyeZ + vecZ;

        balls[grabbedBall].vel.mult(0);
        
        balls[grabbedBall].w.x = 0;
        balls[grabbedBall].w.y = 0;
        balls[grabbedBall].w.z = 0;

        balls[grabbedBall].collideWall(p5, {
          hei: hei, 
          thick: thick, 
          a: a, 
          e: e, 
          wid: wid, 
          len: len, 
          bots: bots, 
          playerAlive: playerAlive, 
          ballGrabbed: ballGrabbed, 
          balls: balls, 
          grabbedBall: grabbedBall
        });
        
        
        
        
        
        let ballDestination = p5.createVector(cam.eyeX + 100 * throwStrength * (cam.centerX - cam.eyeX), 
                                          cam.eyeY + 100 * throwStrength * (cam.centerY - cam.eyeY), 
                                          cam.eyeZ + 100 * throwStrength * (cam.centerZ - cam.eyeZ));
        
        let ballInitial = balls[grabbedBall].pos.copy();
        
        let throwDir = ballDestination.copy().sub(ballInitial);
        
      }

      if (((!p5.mouseIsPressed && leftClickPreviouslyHeld) || (p5.mouseIsPressed && p5.mouseButton === p5.RIGHT && leftClickPreviouslyHeld)) && ballGrabbed == 1) {
        
        let ballDestination = p5.createVector(cam.eyeX + 100 * throwStrength * (cam.centerX - cam.eyeX), 
                                          cam.eyeY + 100 * throwStrength * (cam.centerY - cam.eyeY), 
                                          cam.eyeZ + 100 * throwStrength * (cam.centerZ - cam.eyeZ));
        
        let ballInitial = balls[grabbedBall].pos.copy();
        
        let throwDir = ballDestination.copy().sub(ballInitial);
              
        let rho = Math.sqrt((throwDir.x) ** 2 + 
                      (throwDir.y) ** 2 +
                      (throwDir.z) ** 2);
        let theta = Math.atan2(throwDir.x,
                      throwDir.z);
        
        let phi = Math.cos(throwDir.y / Math.sqrt(throwDir.x ** 2 + throwDir.y ** 2 + throwDir.z ** 2));
        
        phi += 6.5 * Math.PI / 180;
        
        throwDir.x = rho * Math.sin(phi) * Math.sin(theta);
        throwDir.y = rho * Math.cos(phi);
        throwDir.z = rho * Math.sin(phi) * Math.cos(theta);
        
        throwDir.normalize();
        
      
      
          
        balls[grabbedBall].vel = throwDir.copy().mult(throwStrength);
        
        balls[grabbedBall].w.x = 0;
        balls[grabbedBall].w.y = 0;
        balls[grabbedBall].w.z = 0;

        balls[grabbedBall].alive = 1;
        
        ballGrabbed = 0;
        balls[grabbedBall].grabbed = 0;
        grabbedBall = -1;
              
      }
    }
  }

  return (
    <div className="page">
      <div className="desc">
        <header>Dodgeball</header>
        <p>Press the space bar to start the game. Use the up and down arrow keys to control the dino.</p>
      </div>
      <Sketch className={"sketch"} setup={setup} draw={draw} />;
      
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
    </div>
  );
}

export default App;
