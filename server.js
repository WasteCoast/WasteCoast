var express = require('express.io'),
  app  = express(),
  port = process.env.PORT || 3000,
  five = require('johnny-five'),
  board,
  input_weight
  ;

app.http().io();

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.sendfile(__dirname + '/public/index.html')
});

app.io.route('tar', function(req) {
  console.log('Tar');
});


// Arduino
board = new five.Board();

board.on('ready', function() {
  console.log('Server started !');

  input_weight = new five.Sensor({
    pin: 'A0',
    freq: 250
  });

  input_weight.on('change', function(err, value) {
    console.log(value, this.normalized);
  });
});

// Start server
app.listen(port);