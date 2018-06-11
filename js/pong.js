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
  }
}

class Ball extends Rect {
  constructor(x,y){
    super(10,10);
    this.vel = new Vec;
  }
}

const canvas = document.getElementById('pong');
const context = canvas.getContext('2d');

let ball = new Ball;
ball.pos.y = canvas.height/2;
ball.pos.x = canvas.width/2;

const p1 = new Paddle('left');
const p2 = new Paddle('right');
p2.vel = new Vec;
p2.speed = 200;
let ai = true;
let stopped = true;

let home = 0;
let away = 0;
let round = 0;
let counter = 0;


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

  drawRect(new Rect(2,canvas.height));

  //draw the ball
  drawRect(ball);
  //draw paddle1
  drawRect(p1);
  //draw paddle2
  drawRect(p2);

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
      // check if the ball is on the top half of the paddle
    } else if(ball.bottom < p1.pos.y + p1.size.y/2 || ball.bottom < p2.pos.y + p2.size.y/2){
      ball.vel.y -=45;
    }
    // check if the ball is on the bottom half of the paddle
    if(ball.top > p1.pos.y + p1.size.y/4 || ball.top > p2.pos.y + p2.size.y/4){
      ball.vel.y +=85;
      // check if the ball is on the bottom quarter of the paddle
    } else if(ball.top > p1.pos.y + p1.size.y/2 || ball.top > p2.pos.y + p2.size.y/2){
      ball.vel.y +=45;
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

// oppdaterer elementer sin posisjon på siden
function update(dt){
  // ball sin bevegelse
  ball.pos.x += ball.vel.x * dt;
  ball.pos.y += ball.vel.y * dt;

  if(ai){
    // kontrollør, ai's paddle kan ikke bevege seg fortere enn ballen's y-fart
    if(p2.speed > ball.vel.y){
      p2.vel.y = ball.vel.y;
    }
    // hvis ballen er
    if(ball.pos.y < p2.top + 20){
      p2.vel.y = -p2.speed;
    }else if(ball.pos.y > p2.bottom - 20) {
      p2.vel.y = p2.speed;
    }else {
      p2.vel.y = 0;
    }
  }
  if(ai){
    p2.pos.y += p2.vel.y * dt;
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

callback();
