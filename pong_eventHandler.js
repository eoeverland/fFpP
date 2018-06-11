// player 1 controls.
canvas.addEventListener('mousemove', event => {
  p1.pos.y = event.offsetY - p1.size.y/2;
});
// killswitch
window.addEventListener('keypress', function(pressed) {
  if(pressed.key == 'p'){
    startStop();
  }
});
canvas.addEventListener('click', function(pressed) {
    startStop();
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
// reset ball
// invoke AI
window.addEventListener('keypress', function(pressed) {
  if(pressed.key == 'r'){
    resetBall();
  }
});
