let canvas = document.getElementById('pong');
const context = canvas.getContext('2d');

class Vec {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
}

class Rect {
  constructor(w, h) {
    this.pos = new Vec;
    this.size = new Vec(w, h);
    this.draw = function(color = '#fff') {
      context.fillStyle = color;
      context.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
    }
  }
  get left() {
    return this.pos.x - this.size.x / 2;
  }
  get right() {
    return this.pos.x + this.size.x / 2;
  }
  get top() {
    return this.pos.y;
  }
  get bottom() {
    return this.pos.y + this.size.y;
  }
  get center() {
    return new Vec(this.pos.x + this.size.x / 2, this.pos.y + this.size.y / 2);
  }
}

class Paddle extends Rect {
  constructor(side) {
    super(10, 100);
    this.pos.y = canvas.height / 2 - this.size.y / 2;
    if (side == 'right') {
      this.pos.x = canvas.width - 30 - this.size.x / 2;
    } else if (side == 'left') {
      this.pos.x = 30;
    }
    this.vel = new Vec;
    this.velocity = 200;
    this.update = function(dt) {
      this.pos.x += this.vel.x * dt;
      this.pos.y += this.vel.y * dt;
    }
    this.segments = [-65, -50, -25, 0, 25, 50, 65];
  }
}

class Ball extends Rect {
  constructor(x, y) {
    super(10, 10);
    this.vel = new Vec;
    this.velocity = 500;
    this.update = function(dt) {
      this.pos.x += this.vel.x * dt;
      this.pos.y += this.vel.y * dt;
    }
    this.hit = function(angle) {
      this.vel.x = Math.cos(angle * Math.PI / 180) * this.velocity;
      this.vel.y = Math.sin(angle * Math.PI / 180) * this.velocity;
      console.log('ySpeed: ' + this.vel.y + '\n' +'xSpeed: ' + this.vel.x + '\n' + 'angle: ' + angle + '\n', ball);
      if(choosePaddle() == p2){
        this.vel.x *= -1;
      }
    }
  }
}

class Spark extends Rect {
  constructor(_xspeed, _yspeed) {
    super(Math.random() * (-3, -7) + 7, Math.random() * (-3, -7) + 7);
    this.vel = new Vec(_xspeed, _yspeed);
    this.pos.x = ball.pos.x + 3;
    this.pos.y = ball.pos.y + 2;
    this.update = function(dt) {
      this.pos.x += this.vel.x * dt;
      this.pos.y += this.vel.y * dt;
    }
  }
}

let ball = new Ball;
ball.pos.y = canvas.height / 2;
ball.pos.x = canvas.width / 2;

const p1 = new Paddle('left');
const p2 = new Paddle('right');
let ai = true;
let stopped = true;

let canvasColor = 'rgb(0,118,229)';
let home = 0;
let away = 0;
let counter = 0;
let sparking = false;
let sparks = [];
let audio = [];
let hitCounter = 0;

let sprites = [];
sprites.push(p1, p2, ball);

function loadAudio() {
  for (i = 0; i < 4; i++) {
    let src = 'media/audio/Computer_Data_0' + i + '.m4a';
    audio[i] = new Audio(src);
  }
}

function createSparks(amount) {
  for (i = 0; i < amount; i++) {
    let speed = 9;
    sparks[i] = new Spark(Math.random() * (-speed - speed) + speed, Math.random() * (-speed - speed) + speed);
    setTimeout(function() {
      sparks = [];
    }, 500);
  }
}

function animateSparks(amount = 7, ) {
  hitCounter += 1;
  audio[1].play();
  createSparks(amount);
  sparking = true;
  setTimeout(function() {
    sparking = false;
  }, 800);
}

function updateSparks() {
  if (sparking) {
    for (i = 0; i < sparks.length; i++) {
      sparks[i].pos.x += sparks[i].vel.x;
      sparks[i].pos.y += sparks[i].vel.y;
      sparks[i].vel.x *= 0.93;
      sparks[i].vel.y *= 0.93;
    }
  }
}

let lastTime;

function callback(millis) {
  if (lastTime) {
    update((millis - lastTime) / 1000);
  }
  lastTime = millis;
  requestAnimationFrame(callback);
}

function resetBall() {
  ball.vel.x = 0;
  ball.vel.y = 0;
  ball.pos.x = canvas.width / 2;
  ball.pos.y = canvas.height / 2;
  setTimeout(function() {
    ball.vel.x = 350;
    if (fiftyFifty()) {
      ball.vel.x *= -1;
    }
    ball.vel.y = 145;
    if (fiftyFifty()) {
      ball.vel.y *= -1;
    }
  }, 700);
  hitCounter = 0;
}

var velX; // lagrer ball sin x-velocity under pause
var velY; // lagrer ball sin y-velocity under pause
function startStop() {
  if (ball.vel.x || ball.vel.y) {
    velX = ball.vel.x;
    velY = ball.vel.y;
    ball.vel.x = 0;
    ball.vel.y = 0;
    stopped = true;
  } else {
    if (stopped) {
      ball.vel.x = velX || 500;
      ball.vel.y = velY || 133;
      stopped = false;
    } else {
      resetBall();
    }
  }
}
// ternary operator chooses randomly 0 || 1
function fiftyFifty() {
  return Math.random(1) >= .5 ? 0 : 1;
}

function draw() {
  // draw canvas
  context.fillStyle = canvasColor;
  context.fillRect(0, 0, canvas.width, canvas.height);

  for (i = 0; i < sprites.length; i++) {
    sprites[i].draw();
  }

  if (sparking) {
    for (i = 0; i < sparks.length; i++) {
      sparks[i].draw('#FFFF33');
    }
  }

}

function collide(paddle) {
  if (
    ball.bottom > paddle.top &&
    ball.top < paddle.bottom &&
    ball.left < paddle.right &&
    ball.right > paddle.left) {
    return true;
  }
  return false;
}

function wallDetect() {
  //topp & bunn
  if (ball.top < 0 && ball.vel.y < 0) {
    ball.vel.y *= -1;
  }
  if (ball.bottom > canvas.height && ball.vel.y > 0) {
    ball.vel.y *= -1;
  }
  // AI goal
  if (ball.left < 0) {
    away++;
    if (ai) {
      document.getElementById('p2').innerHTML = "AI: " + away;
    } else {
      document.getElementById('p2').innerHTML = "Player2: " + away;
    }
    audio[3].play();
    resetBall();
    canvasColor = 'rgb(250,0,70)';
    setTimeout(function() {
      canvasColor = 'rgb(0,118,229)';
    }, 200);
  }
  // player goal
  if (ball.right > canvas.width) {
    home++;
    counter++;
    if (ai) {
      document.getElementById('p1').innerHTML = "You: " + home;
    } else {
      document.getElementById('p1').innerHTML = "Player1: " + home;
    }
    audio[0].play();
    resetBall();
    canvasColor = 'rgb(0,230,90)';
    setTimeout(function() {
      canvasColor = 'rgb(0,118,229)';
    }, 200);
  }
}

function blinkScreen(color) {
  canvasColor = color;
  setTimeout(function() {
    canvasColor = 'rgb(0,118,229)';
  }, 200);
}

function checkBoundaries() {
  wallDetect();

  if (collide(choosePaddle())) {
    let parts = segmentPaddle(choosePaddle());
    for (i = 0; i < 7; i++) {
      if(ball.center.y > parts[i].x && ball.center.y < parts[i].y){
        ball.hit(choosePaddle().segments[i])
      }
    }
    animateSparks();

  }
}

function segmentPaddle(paddle) {
  let parts = [];
  for (i = 0; i < 7; i++) {
    parts[i] = new Vec(paddle.top + i * ((paddle.bottom - paddle.top) / 7), paddle.top + (i + 1) * ((paddle.bottom - paddle.top) / 7));
  }
  return parts;
}


function choosePaddle() {
  return ball.center.x < canvas.width / 2 ? p1 : p2;
}

function newGame() {
  resetBall();
  counter = 0;
  away = 0;
  home = 0;
  p2.velocity = 200;
}

function AI(dt) {
  if (ai) {
    // kontrollør, ai's paddle kan ikke bevege seg fortere enn ballen's y-fart
    if (p2.velocity > ball.vel.y) {
      p2.vel.y = ball.vel.y;
    }
    if (ball.pos.x > canvas.width / 3) { // If the ball is on the right two thirds of the canvas.
      if (ball.pos.y < p2.top + 20) { // ball is higher than p2's top 20px
        p2.vel.y = -p2.velocity; // p2 goes up
      } else if (ball.pos.y > p2.bottom - 20) { // Ball is lower than p2's bottom 20px
        p2.vel.y = p2.velocity; // p2 goes down
      } else {
        p2.vel.y = 0; // ball doesn't move
      }
    } else if (ball.pos.x < canvas.width / 3 || ball.vel.x < 1) { // ball is on the left third of the canvas.
      if (p2.pos.y + p2.size.y / 2 > canvas.height / 2 + 10) { // p2's center is 10px lower than the center
        p2.vel.y = -p2.velocity; // move up
      } else if (p2.pos.y + p2.size.y / 2 < canvas.height / 2 - 10) { // p2's center is higher than the center of canvas.
        p2.vel.y = p2.velocity; // Move down
      } else {
        p2.vel.y = 0; // don't move if the p2's center is within 10px of the canvas center.
      }
    }

    p2.pos.y += p2.vel.y * dt; // update p2
  }
}

// oppdaterer elementer sin posisjon på siden
function update(dt) {
  // ball sin bevegelse
  ball.pos.x += ball.vel.x * dt;
  ball.pos.y += ball.vel.y * dt;

  p1.pos.y += p1.vel.y * dt;

  p2.pos.y += p2.vel.y * dt;

  if (ai) {
    setTimeout(function() {
      AI(dt)
    }, 200);
  }

  // Increase the botspeed every 3rd point.
  if (counter % 3 == 0 && counter != 0 && ai) {
    if (p2.velocity < 600) {
      p2.velocity *= 1.3;
      counter++;
    }
  }

  if (sparking) {
    updateSparks(dt);
  }

  draw();
  checkBoundaries();
}

loadAudio();

callback();
