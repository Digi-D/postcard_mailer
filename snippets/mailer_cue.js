var uuid = require('uuid');
var bunyan = require('bunyan');

var comBus = require('./app_modules/com.js');
var sendCards = require('./app_modules/serial_mail_cue.js');

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
  description:"strange new card",
  number_of_cards:number_of_cards,
  shipment_id:shipment_id,
};
//Confirm shipping info + price

//Confirm payment

//Iterate through the shipping cue one item at a time :(
//var sendCards = Object.create(serialCue);
8979876111sendCards.init(cardShipment);

com_broker.initListener('testing', pipeMe);
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
