var
  // Server
  express = require('express'),
  app     = express(),
  server  = require('http').createServer(app),
  io      = require('socket.io').listen(server),

  // Arduino
  five = require('johnny-five'),
  weight_sensor,
  board,

  // Balance logic
  balance = require('./balance'),
  prev_weight, weight, total_weight = 0

  ;


var histo = [
  { val: 0,    date:  '', in_min: false, in_max: false },
  { val: 121,  date:  '', in_min: false, in_max: false },
  { val: 434,  date:  '', in_min: false, in_max: false },
  { val: 510,  date:  '', in_min: false, in_max: false },
  { val: 790,  date:  '', in_min: false, in_max: false },
  { val: 987,  date:  '', in_min: false, in_max: false },
  { val: 1140, date:  '', in_min: false, in_max: false },
  { val: 0,    date:  '', in_min: false, in_max: false },
  { val: 179,  date:  '', in_min: false, in_max: false },
  { val: 582,  date:  '', in_min: false, in_max: false },
  { val: 893,  date:  '', in_min: false, in_max: false },
  { val: 1209, date:  '', in_min: false, in_max: false },
  { val: 1534, date:  '', in_min: false, in_max: false },
  { val: 2504, date:  '', in_min: false, in_max: false },
  { val: 3490, date:  '', in_min: false, in_max: false },
  { val: 4203, date:  '', in_min: false, in_max: false },
  { val: 4534, date:  '', in_min: false, in_max: false },
  { val: 5000, date:  '', in_min: false, in_max: true }
];

histo.forEach(function(v) {
  total_weight += v.val;
});




// Process arguments
/*
var argv = require('optimist')
  .usage('Start arduino and webserver\n' +
    'Usage: $0\n' +
    'To calibrate the balance pass arguments:\n' +
    ' - Weight expected\n' +
    ' - Arduino input weight actual\n' +
    ' - Arduino input weight min, where weight equals 0\n' +
    ' - Arduino input weight max'
  )
  .demand(4)
  .argv;
*/
// SWMTP calibrate with water bottle
balance.calibrate(1768, 353, 10, 827);
//balance.calibrate(argv._[0], argv._[1], argv._[2], argv._[3]);




// Server, Websockets
app.use(express.static(__dirname + '/public'));

io.sockets.on('connection', function (socket) {

  socket.emit('histo', { histo: histo });
  // TODO Emit initial weight
  //socket.emit('', { histo: histo });


  socket.on('tare', function (data) {

    if (weight_sensor) {
      balance.tare(weight_sensor.value);
      console.log('Tare balance ok');
    } else {
      console.log('Tare balance ko')
    }
  });

});



// Arduino
board = new five.Board();

board.on('ready', function() {

  weight_sensor = five.Sensor({
    pin:  'A0',
    freq: 250 // Check every 1/4 seconds
  });


  weight_sensor.on('change', function(err, value) {

    console.log('weight sensor value: ' + value);

    prev_weight = weight;

    weight = balance.getWeight(value);

    if (!prev_weight || prev_weight.val !== weight.val) {
      console.log(weight);
    }

    // TODO add diff between prev_weight and actual weight
    //weight.total = total_weight = ...;

    io.sockets.emit('weight_change', weight);

  });

  // TODO Define actual weight before start


  // Start server
  console.log('Server started !');
  server.listen(3000);

});
