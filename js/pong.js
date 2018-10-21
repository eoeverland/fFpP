class Vec {
  constructor(x=0, y=0){
    this.x = x;
    this.y = y;
  }
}

class Rect {
  constructor(w,h) {
    this.pos = new Vec;
    this.size = new Vec(w,h);
  }
  get left(){
    return this.pos.x - this.size.x / 2;
  }
  get right(){
    return this.pos.x + this.size.x / 2;
  }
  get top(){
    return this.pos.y;
  }
  get bottom(){
    return this.pos.y + this.size.y;
  }
}

class Paddle extends Rect{
  constructor(side){
    super(10,100);
    this.pos.y = canvas.height/2 - this.size.y/2;
    if(side == 'right'){
      this.pos.x = canvas.width - 30 - this.size.x/2;
    }else if(side == 'left'){
      this.pos.x = 30;
    }
    this.vel = new Vec;
  }
}

class Ball extends Rect {
  constructor(x,y){
    super(10,10);
    this.vel = new Vec;
  }
}

class Spark extends Rect {
  constructor(_xspeed, _yspeed){
    super(5,5);
    this.pos.x = ball.pos.x + 3;
    this.pos.y = ball.pos.y + 2;
    this.xspeed = _xspeed;
    this.yspeed = _yspeed;
  }
}

const canvas = document.getElementById('pong');
const context = canvas.getContext('2d');

let ball = new Ball;
ball.pos.y = canvas.height/2;
ball.pos.x = canvas.width/2;

const p1 = new Paddle('left');
const p2 = new Paddle('right');
p1.speed = 350;
p2.speed = 200;
let ai = true;
let stopped = true;

let home = 0;
let away = 0;
let round = 0;
let counter = 0;
let sparking = false;
let sparks = [];
let audio = [];

function loadAudio(){
  for(i = 0; i < 4; i++){
    let src = 'media/audio/Computer_Data_0' + i + '.m4a';
    audio[i] = new Audio(src);
  }
}

function createSparks(amount){
  for(i = 0; i < amount; i++){
    let speed = 9;
    sparks[i] = new Spark(Math.random() * (-speed - speed) + speed, Math.random() * (-speed - speed) + speed);
    setTimeout(function(){sparks = [];}, 500);
  }
}

function hit(amount=7,){
  let number = Math.floor(Math.random() * (0,4));
  console.log(number);
  audio[number].play();
  createSparks(amount);
  sparking = true;
  setTimeout(function(){sparking = false;}, 800);
}
function updateSparks(){
  if(sparking){
    for(i = 0; i < sparks.length; i++){
      sparks[i].pos.x += sparks[i].xspeed;
      sparks[i].pos.y += sparks[i].yspeed;
      sparks[i].xspeed *= 0.93;
      sparks[i].yspeed *= 0.93;
    }
  }
}

let lastTime;
function callback(millis){
  if(lastTime){
    update((millis - lastTime) / 1000);
  }
  lastTime = millis;
  requestAnimationFrame(callback);
}

// function for drawing a rectangle object
function drawRect(rect){
  context.fillStyle = '#fff';
  context.fillRect(rect.pos.x, rect.pos.y, rect.size.x, rect.size.y);
}

let canvasColor = 'rgb(0,118,229)';
function draw(){
  // draw canvas
  context.fillStyle = canvasColor;
  context.fillRect(0, 0, canvas.width, canvas.height);

  //draw the ball
  drawRect(ball);
  //draw paddle1
  drawRect(p1);
  //draw paddle2
  drawRect(p2);

  if(sparking){
    for(i = 0; i < sparks.length; i++){
      drawRect(sparks[i]);
    }
  }

}

function resetBall(){
  ball.vel.x = 0;
  ball.vel.y = 0;
  ball.pos.x = canvas.width/2;
  ball.pos.y = canvas.height/2;
  setTimeout(function(){
    ball.vel.x = 300;
    if(fiftyFifty()){
      ball.vel.x *= -1;
    }
    ball.vel.y = 145;
    if(fiftyFifty()){
      ball.vel.y *= -1;
    }
  }, 700);
}

var velX; // lagrer ball sin x-velocity under pause
var velY; // lagrer ball sin y-velocity under pause
function startStop(){
  if(ball.vel.x || ball.vel.y){
    velX = ball.vel.x;
    velY = ball.vel.y;
    ball.vel.x = 0;
    ball.vel.y = 0;
    stopped = true;
  }else{
    if(stopped){
      ball.vel.x = velX || 500;
      ball.vel.y = velY || 133;
      stopped = false;
    }else{
      resetBall();
    }
  }
}

function fiftyFifty(){
  if(Math.random(1) >= .5){
    return 0;
  } else {
    return 1;
  }
}

function changeDirection(b){
  b.vel.x *= -1;
}

function collide(){
  // collide player1
  if(ball.bottom > p1.top && ball.top < p1.bottom && ball.left < p1.right && ball.right > p1.left && ball.vel.x < 0){
    return true;
  }
  // collide player2
  if(ball.bottom > p2.top && ball.top < p2.bottom && ball.right > p2.left && ball.left < p2.right && ball.vel.x > 0){
    return true;
  }
}

function wallDetect(){
  //topp & bunn
  if(ball.top < 0 && ball.vel.y < 0){
    ball.vel.y *= -1;
  }
  if(ball.bottom > canvas.height && ball.vel.y > 0){
    ball.vel.y *= -1;
  }
  // AI goal
  if(ball.left < 0){
    away ++;
    round ++;
    document.getElementById('p2').innerHTML = "Duplex: " + away;
    resetBall();
    canvasColor = 'rgb(250,0,70)';
    setTimeout(function(){
      canvasColor = 'rgb(0,118,229)';
    } , 200);
  }
  // player goal
  if(ball.right > canvas.width){
    home ++;
    round ++;
    counter ++;
    document.getElementById('p1').innerHTML = "You: " + home;
    resetBall();
    canvasColor = 'rgb(0,230,90)';
    setTimeout(function(){
      canvasColor = 'rgb(0,118,229)';
    } , 200);
  }
}

function blinkScreen(color){
  canvasColor = color;
  setTimeout(function(){
    canvasColor = 'rgb(0,118,229)';
  } , 200);
}

function checkBoundaries(){
  wallDetect();
  if(collide()){
    // check if the ball is on the top quarter of the paddle
    if(ball.bottom < p1.pos.y + p1.size.y/4 || ball.bottom < p2.pos.y + p2.size.y/2){
      ball.vel.y -=85;
      hit(15);
    }
    // check if the ball is on the top half of the paddle
     else if(ball.bottom < p1.pos.y + p1.size.y/2 || ball.bottom < p2.pos.y + p2.size.y/2){
      ball.vel.y -=45;
      hit();
    }
    // check if the ball is on the bottom half of the paddle
    if(ball.top > p1.pos.y + p1.size.y/4 || ball.top > p2.pos.y + p2.size.y/4){
      ball.vel.y +=85;
      hit();
    }
      // check if the ball is on the bottom quarter of the paddle
     else if(ball.top > p1.pos.y + p1.size.y/2 || ball.top > p2.pos.y + p2.size.y/2){
      ball.vel.y +=45;
      hit(15);
    }
  changeDirection(ball);
  }
}

function newGame(){
  resetBall();
  counter = 0;
  away = 0;
  home = 0;
  p2.speed = 200;
}

function AI(dt){
  if(ai){
    // kontrollør, ai's paddle kan ikke bevege seg fortere enn ballen's y-fart
    if(p2.speed > ball.vel.y){
      p2.vel.y = ball.vel.y;
    }
    if(ball.pos.x > canvas.width/3){
      if(ball.pos.y < p2.top + 20){
        p2.vel.y = -p2.speed;
      }else if(ball.pos.y > p2.bottom - 20) {
        p2.vel.y = p2.speed;
      }else {
        p2.vel.y = 0;
      }
    } else if (ball.pos.x < canvas.width/3){
      if(p2.pos.y + p2.size.y/2 > canvas.height/2 + 10){
          p2.vel.y = -p2.speed;
      }else if(p2.pos.y + p2.size.y/2 < canvas.height/2 -10){
        p2.vel.y = p2.speed;
      } else {
        p2.vel.y = 0;
      }
    }

    p2.pos.y += p2.vel.y * dt;
  }
}

// oppdaterer elementer sin posisjon på siden
function update(dt){
  // ball sin bevegelse
  ball.pos.x += ball.vel.x * dt;
  ball.pos.y += ball.vel.y * dt;

  p1.pos.x += p1.vel.x * dt;
  p1.pos.y += p1.vel.y * dt;

  AI(dt);

  if(sparking){
    updateSparks();
  }

  if(counter%3 == 0 && counter != 0){
    if(p2.speed < 600){
      p2.speed *= 1.3;
    counter++;
    }
  }

  draw();
  checkBoundaries();
}

loadAudio();

callback();
