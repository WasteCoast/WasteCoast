var five = require('johnny-five'),
  board, input_weight;

board = new five.Board();

board.on('ready', function() {

  input_weight = new five.Sensor({
    pin: 'A0',
    freq: 250
  });

  input_weight.on('change', function(err, value) {
    console.log(value, this.normalized);
  });
});