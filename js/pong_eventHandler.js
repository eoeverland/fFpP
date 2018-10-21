// player 1 controls.
canvas.addEventListener('mousemove', event => {
  if(!stopped){p1.pos.y = (event.offsetY) - p1.size.y/2;}
});
// killswitch
window.addEventListener('keypress', function(pressed) {
  if(pressed.key == ' '){
    pressed.preventDefault();
    startStop();
  }
});
canvas.addEventListener('click', function(pressed) {
    if(stopped){
      startStop();
    }
});
// invoke AI
window.addEventListener('keypress', function(pressed) {
  if(pressed.key == 'a'){
    if(ai){
      ai = false;
      console.log("I'll be back.");
    }else {
      ai = true;
      console.log('En garde!');
    }
  }
});
/*
piltastkontroller
*/
window.addEventListener('keydown', function(pressed) {
  if(pressed.keyCode == 38){
    pressed.preventDefault();
    p1.vel.y = -550;
  } else if (pressed.keyCode == 40) {
    pressed.preventDefault();
    p1.vel.y = 550;
  }
});
window.addEventListener('keyup', function(pressed) {
  if(pressed.keyCode == 38 || pressed.keyCode == 40){
    p1.vel.y = 0;
  }
});
// window.addEventListener('keydown', function(pressed) {
//   if(pressed.keyCode == 40){
//     console.log(pressed);
//     p1.vel.y = 350;
//   }
// });


// reset game & score
window.addEventListener('keypress', function(pressed) {
  if(pressed.key == 'r'){
    document.getElementById('p1').innerHTML = "You: 0";
    document.getElementById('p2').innerHTML = "Duplex: 0";
    newGame();
  }
});
