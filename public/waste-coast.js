(function() {
  var socket = io.connect('http://127.0.0.1:3000');

  document.getElementById('tare').onclick = function() {
    socket.emit('tare');
  };

  socket.on('weight_change', function (data) {
    console.log(data);
    document.getElementsByName('weight')[0].value = data.value;
  });
})();
