// player 1 controls.
canvas.addEventListener('mousemove', event => {
  if(!stopped){p1.pos.y = (event.offsetY) - p1.size.y/2;}
});
// killswitch
window.addEventListener('keypress', function(pressed) {
  if(pressed.key == ' '){
    pressed.preventDefault();
    if(!stopped){
      document.exitPointerLock();
    }
    startStop();
  }
});
canvas.addEventListener('click', function(pressed) {
    if(stopped){
      // canvas.requestPointerLock();
      startStop();
    }
});
// invoke AI
window.addEventListener('keypress', function(pressed) {
  if(pressed.key == 'a'){
    if(ai){
      ai = false;
      document.getElementById('gameMode').innerHTML = "2 Player";
      console.log("I'll be back.");
      document.getElementById('p1').innerHTML = "Player1: " + '0';
      document.getElementById('p2').innerHTML = "Player2: " + '0';
      newGame();
    }else {
      ai = true;
      document.getElementById('gameMode').innerHTML = "You vs. AI";
      console.log('En garde!');
      document.getElementById('p1').innerHTML = "You: " + '0';
      document.getElementById('p2').innerHTML = "AI: " + '0';
      newGame();
    }
  }
});
/*
piltastkontroller spiller 1
*/
window.addEventListener('keydown', function(pressed) {
  if(pressed.key == 'w'){
    pressed.preventDefault();
    p1.vel.y = -550;
  } else if (pressed.key == 'd') {
    pressed.preventDefault();
    p1.vel.y = 550;
  }
});
window.addEventListener('keyup', function(pressed) {
  if(pressed.key == 'w' || pressed.key == 'd'){
    p1.vel.y = 0;
  }
});

// piltastkontroller spiller 2
  window.addEventListener('keydown', function(pressed) {
    if (pressed.keyCode == 38) {
      pressed.preventDefault();
      p2.vel.y = -550;
    } else if (pressed.keyCode == 40) {
      pressed.preventDefault();
      p2.vel.y = 550;
    }
  });
  window.addEventListener('keyup', function(pressed) {
    if (pressed.keyCode == 38 || pressed.keyCode == 40) {
      p2.vel.y = 0;
    }
  });



// reset game & score
window.addEventListener('keypress', function(pressed) {
  if(pressed.key == 'r'){
    document.getElementById('p1').innerHTML = "You: 0";
    document.getElementById('p2').innerHTML = "Duplex: 0";
    newGame();
  }
});
