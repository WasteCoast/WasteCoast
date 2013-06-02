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
  actual_weight,
  previous_weight,
  total_weight = { value: 0, date: '2013-05-28T18:50:33.154Z' }

  ;


// Historic
var historic = [
  { value: 4389, date: '2013-04-30T19:47:58.154Z' },
  { value: 4245, date: '2013-05-07T20:17:33.154Z' },
  { value: 4985, date: '2013-05-14T22:12:39.154Z' },
  { value: 4384, date: '2013-05-21T18:55:01.154Z' },
  { value: 4534, date: '2013-05-28T18:50:33.154Z' }
];

historic.forEach(function(v) {
  total_weight.value += v.value;
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




// Server
app.use(express.static(__dirname + '/public'));

// Websockets
io.sockets.on('connection', function (socket) {

  socket.emit('init', {
    actual: actual_weight,
    total:  total_weight,
    historic:  historic
  });

  socket.on('tare', function (data) {
    if (weight_sensor) {
      balance.tare(weight_sensor.value);
      console.log('Tare balance ok');
    } else {
      console.log('Tare balance ko')
    }
  });
});


/**
 * Update actual weight from arduino and add check to add to histo
 * @param v
 */
function updateWeight(v) {

  previous_weight = actual_weight;

  actual_weight = balance.getWeight(v);

  var weight_change = {
    actual: actual_weight
  }

  console.log('weight sensor value: ' + v + ', actual weight in grams: ' + actual_weight.value);

  // If actual_weight is lower than previous weight, we add an entry to historic and updates total
  if (previous_weight && actual_weight.value < previous_weight.value) {

    var delta = previous_weight.value - actual_weight.value;

    // Add entry historic
    var historic_entry = {
      value: delta,
      date:  new Date()
    };
    historic.push(historic_entry);
    weight_change.historic_entry = historic_entry;

    // Updates total weight
    total_weight.value += delta;
    total_weight.date = historic_entry.date;
    weight_change.total = total_weight;
  }

  io.sockets.emit('weight_change', weight_change);
}




// Arduino
board = new five.Board();

board.on('ready', function() {

  weight_sensor = five.Sensor({
    pin:  'A0',
    freq: 1000 // Check every seconds
  });

  weight_sensor.on('change', function(err, value) {
    updateWeight(value);
  });

  // Define initial weight
  previous_weight = actual_weight = balance.getWeight(weight_sensor.value);

  // Start server
  console.log('Server started !');
  server.listen(3000);
});