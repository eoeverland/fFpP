// player 1 controls.
canvas.addEventListener('mousemove', event => {
  if(!stopped){p1.pos.y = event.offsetY - p1.size.y/2;}
});
// killswitch
window.addEventListener('keypress', function(pressed) {
  if(pressed.key == ' '){
    pressed.preventDefault();
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
//
// reset game & score
window.addEventListener('keypress', function(pressed) {
  if(pressed.key == 'r'){
    document.getElementById('p1').innerHTML = "You: 0";
    document.getElementById('p2').innerHTML = "Duplex: 0";
    newGame();
  }
});
