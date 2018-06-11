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
let ai = true;
let stopped = false;

let home = 0;
let away = 0;



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

function draw(){
  // Black canvas
  context.fillStyle = 'rgb(29,127,226)';
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
  ball = new Ball;
  ball.pos.x = canvas.width/2;
  ball.pos.y = canvas.height/2;
  ball.vel.x = 500;
  if(getRandomIntInclusive(0,1)){
    ball.vel.x *= -1;
  }
  ball.vel.y = 143;
  stopped = false;
}

var velX;
var velY;
function startStop(){
  if(ball.vel.x || ball.vel.y){
    velX = ball.vel.x;
    velY = ball.vel.y;
    ball.vel.x = 0;
    ball.vel.y = 0;
    stopped = true;
  }else{
    if(stopped){
      ball.vel.x = velX;
      ball.vel.y = velY;
      stopped = false;
    }else{
      resetBall();
    }
  }
}

// For å hente tilfeldig tall til 'ping, pong'
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

function changeDirection(b){
  b.vel.x *= -1;
  var pingpong = ['ping', 'pong'];
  console.log(pingpong[getRandomIntInclusive(0,1)], ball.pos);
}

function collide(){
  if((ball.bottom > p1.top && ball.top < p1.bottom && ball.left < p1.right && ball.vel.x < 0) || (ball.bottom > p2.top && ball.top < p2.bottom && ball.right > p2.left && ball.vel.x > 0)){
    return true;
  }else {
    return false;
  }
}

function wallDetect(){
  //topp & bunn
  if(ball.top < 0 || ball.bottom > canvas.height){
    ball.vel.y *= -1;
  }

  if(ball.left < 0){
    away ++;
    document.getElementById('p2').innerHTML = "Duplex: " + away;
    resetBall();
  }
  if(ball.right > canvas.width){
    home ++;
    document.getElementById('p1').innerHTML = "You: " + home;
    resetBall();
  }
}

function checkBoundaries(){
  wallDetect();
  if(collide()){
    if(ball.bottom < p1.pos.y + p1.size.y/2 || ball.bottom < p2.pos.y + p2.size.y/2){
      ball.vel.y -=45;
    }
    if(ball.top > p1.pos.y + p1.size.y/2 || ball.top > p2.pos.y + p2.size.y/2){
      ball.vel.y +=45;
    }
    changeDirection(ball);
  }
}

function update(dt){
  ball.pos.x += ball.vel.x * dt;
  ball.pos.y += ball.vel.y * dt;

  if(ai){
    if(ball.pos.y < p2.top + 20){
      p2.vel.y = -300;
    }else if(ball.pos.y > p2.bottom - 20) {
      p2.vel.y = 300;
    }else {
      p2.vel.y = 0;
    }
  }
  if(ai){
    p2.pos.y += p2.vel.y * dt;
  }

  draw();
  checkBoundaries();
}

callback();
