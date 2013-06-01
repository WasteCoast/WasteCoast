(function() {
  var socket = io.connect('http://127.0.0.1:3000');

  document.getElementById('tar').onclick = function() {
    socket.emit('tar');
  };
})();
