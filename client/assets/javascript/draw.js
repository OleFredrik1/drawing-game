$(document).ready(function(){
  var mouseDown = false;
  var canvas = document.getElementById("canvas");
  var c = canvas.getContext("2d");
  var lastX = 0;
  var lastY = 0;
  $(document).unload(function(){
    socket.emit("avlogger");
  });
  $(document).on("mouseup", function(){
    mouseDown = false;
  });
  function pressMouseDown (e){
    mouseDown = true;
    lastX = e.pageX - canvas.offsetLeft;
    lasnY = e.pageY - canvas.offsetTop;
  }
  function moveMouse(e){
    if (mouseDown){
      var x = e.pageX - canvas.offsetLeft;
      var y = e.pageY - canvas.offsetTop;
      socket.emit("", { "lastX" : lastX, "lastY" : lastY, "x" : x, "y" : y});
      tegne(forrigeX, forrigeY, x, y);
      lastX = e.pageX - canvas.offsetLeft;
      lastY = e.pageY - canvas.offsetTop;
    }
  }
  function draw(preX, preY, x, y){
    c.beginPath();
    c.moveTo(preX, preY);
    c.lineTo(x, y);
    c.stroke();
  }
});