(function() {
  var socket = io.connect(document.location.origin),
      histo  = [];

  document.getElementById('tare').onclick = function() {
    socket.emit('tare');
  };

  socket.on('histo', function(data) {
    histo = data.histo;
  });

  socket.on('weight_change', function (data) {
    console && console.log(data);
    document.getElementById('weight_actual').innerHTML = data.actual;
    document.getElementById('weight_total').innerHTML  = data.total;
  });

})();
