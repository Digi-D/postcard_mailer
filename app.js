var config = require('./app_modules/config.js');
config.setMode('TEST');

var express = require('express');
var hbars = require('express-handlebars');
var bodyParser = require('body-parser');
var uuid = require('uuid');

var validate = require('./app_modules/validate_form.js');
var mailPostcards = require('./app_modules/mail_postcards.js');
var handlebarsHelpers = require('./app_modules/handlebars_helpers.js');
var transactionalEmail = require('./app_modules/transactional_email.js');

var stripe = require("stripe")(config.getKey('STRIPE_SECRET_KEY'));

var app = express();
var json_parser = bodyParser.json();

app.use(express.static('public')); //to serve out CSS and Javascript
app.use(express.static('media')); //to serve out Image file for download

console.log(app.settings.env);

app.engine('handlebars',
  hbars({
    defaultLayout: 'container',
    helpers:handlebarsHelpers
  })
);
app.set('view engine', 'handlebars');

//ROUTES
app.get('/', function (req, res) {
// present the project and address/number of postcards to the viewers
  var card_price_val = config.getGlobal('PRICE_PER_CARD');
  res.render( __dirname + "/views/" + "index" ,{card_price:card_price_val});

})

app.get('/get_visitor_info', function (req, res) {
//recieve, validate and render out for confimation by user all of the parameters of the order
  var job_id=uuid.v1();
  var visitor_info = {
    id:job_id,
    first_name:req.query.visitor_first_name,
    last_name:req.query.visitor_last_name,
    email:req.query.visitor_email,
    address_1:req.query.visitor_address_1,
    //address_2:req.query.visitor_address_2,      // LOB throws and error here --> ?!!!
    city:req.query.visitor_city,
    state:req.query.visitor_state,
    zip:req.query.visitor_zip,
    number_of_cards:req.query.number_of_cards,
    price: undefined
  }

  mailPostcards.init(visitor_info);
  //initialize mail cue here but run it only after the credit card gets processed

  var stripe_key = config.getKey('STRIPE_PUBLISHABLE_KEY');
  validate.confirmationMessage(visitor_info, __dirname + "/views/" + "confirm", stripe_key, function(path, validation_report,validation_states){
    //console.log(validation_report);   //send out validation report
    res.render(path, validation_states);
  });

})

app.post('/finalize_payment', json_parser, function (req, res) {

  var charge = stripe.charges.create({
      amount: req.body.payment_amount ,
      currency: "usd",
      source: req.body.tokenid,
      receipt_email: req.body.email
    },function(err, charge) {
      if (err && err.type === 'StripeCardError') {
        // The card has been declined
      }
      else {
        console.log("Charge successfull begin sending cards.");
        mailPostcards.send(function(err, status, result){
           if(err){
            // WRITE TO LOG
            console.log(result);
            //email admin
            transactionalEmail.sendAdminEmail('FAILED','admin_update', mailPostcards.jobSummary());
            //return error to the front end
            res.end('{"status":"error"}');
           }
           else{
            //email admin
            transactionalEmail.sendAdminEmail('SUCCESS','admin_update', mailPostcards.jobSummary());
            //return success and some vars to the front end
            res.end('{"status":"success","deliver":"'+result.expected_delivery_date+'"}');
           }
           //console.log(result.expected_delivery_date);
         });
      }
    }
  );
})

app.get('/result', function (req, res) {
//report result of the card charge and postcard send requests to the viewers
  if(req.query.delivery_status=="success"){
    res.render( __dirname + "/views/" + "results", {delivery_status:true,delivery_date:req.query.delivery_date});
  }
  else{
    res.render( __dirname + "/views/" + "results",{delivery_status:false});
  }

})



//SERVER SETUP
var server = app.listen(8081, function () {

  console.log("Shazam!")

})
