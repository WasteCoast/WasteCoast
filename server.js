var express = require('express.io'),
    app  = express(),
    port = process.env.PORT || 3000,
    five = require('johnny-five'),
    board,
    input_weight
  ;



// Process arguments
var argv = require('optimist')
  .usage('Start arduino and webserver\nUsage: $0\nArguments:\n' +
    ' - Arduino input weight min\n' +
    ' - Arduino input weight max\n' +
    ' - Max weight in grams'
  )
  .demand(3)
  .argv;

var input_weight_min = argv._[0],
    input_weight_max = argv._[1],
    weight_max       = argv._[2];





app.http().io();

app.use(express.static(__dirname + '/public'));




// Routes
app.io.route('tare', function(req) {
  console.log('Tare');

  input_weight_min = input_weight.value;
  console.log(input_weight.value);

  updateWeight(input_weight_min);
});


function updateWeight(v) {

  // Broadcast to client
  app.io.broadcast('weight_change', {
    value: v,
    time: new Date()
  });

}




// Arduino
board = new five.Board();

board.on('ready', function() {

  input_weight = new five.Sensor({
    pin: 'A0',
    freq: 250
  });

  // On weight change
  input_weight.on('change', function(err, value) {
    updateWeight(value);
  });


  // Start server
  app.listen(port);
  console.log('Server started !');

});