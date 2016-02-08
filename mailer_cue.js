var fs = fs = require('fs');
var MY_KEYS = require('./my_keys.js'); //throw your keys here
var Lob = require('lob')(MY_KEYS.TEST_LOB_KEY);
var uuid = require('uuid');
var events = require('events');
var bunyan = require('bunyan');

var sendCards = require('./app_modules/serial_mail_cue.js');

var eventEmitter = new events.EventEmitter();
var log = bunyan.createLogger({
  name: "mailer_status",
  streams: [{
      path: './log.json',
  }]
});

log.info("Server Startup");


//prep card Shipment info
var shipment_id=uuid.v1();
var number_of_cards = 3;

var cardShipment ={
  send_to: {
    name:'test_joe',
    address:'123 Main Street',
    city:'Main View',
    state:'KY',
    zip:'40502',
  },
  email:"dima@dima.com",
  number_of_cards:number_of_cards,
  shipment_id:shipment_id,
};
//Confirm shipping info + price

//Confirm payment

//Iterate through the shipping cue one item at a time :(
//var sendCards = Object.create(serialCue);
sendCards.init(cardShipment);
eventEmitter.on('success', function(){
  console.log("succeded");
  sendCards.eachIteration();
});

eventEmitter.on('fail', function(err){
  console.log("failed");
  sendCards.status="fail";
  console.log(err);
  sendCards.eachIteration();
});

//Send user to confirmation page

//Send email to admin
