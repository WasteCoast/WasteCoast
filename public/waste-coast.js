(function() {
  var socket   = io.connect(document.location.origin),
      historic = [];

  socket.on('init', function(data) {
    console && console.log(data)

    updateActualWeight(data.actual.value);
    updateTotalWeight(data.total.value);

    historic = data.historic;
  });

  socket.on('weight_change', function (data) {
    console && console.log(data);

    updateActualWeight(data.actual.value);


    if (data.total) {
      updateTotalWeight(data.total.value);
    }

    if (data.historic_entry) {
      historic.push(data.historic_entry);
    }
  });

  document.getElementById('tare').onclick = function() {
    socket.emit('tare');
  };

  function updateActualWeight(v) {
    document.getElementById('weight_actual').innerHTML = v;
  }

  function updateTotalWeight(v) {
    document.getElementById('weight_total').innerHTML = v;
  }
})();
