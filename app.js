//NEED TO: add decent design, installation shots from sites
//Questions: How to validate address?
var config = require('./app_modules/config.js');
var express = require('express');
var hbars = require('express-handlebars');
var bodyParser = require('body-parser');
var uuid = require('uuid');

var mailgun = require('mailgun.js');
var emailLibrary = require('./app_modules/transactional_email_lib.js');
var mg = mailgun.client({username: 'api', key: config.MAILGUN_API_KEY});
var mail_domain = config.MAILGUN_DOMAIN;

var validate = require('./app_modules/validate_form.js');
var mailPostcards = require('./app_modules/mail_postcards.js');
var handlebarsHelpers = require('./app_modules/handlebars_helpers.js');

var stripe = require("stripe")(config.TEST_STRIPE_SECRET_KEY);

var app = express();
var json_parser = bodyParser.json();

// var mail_content = emailLibrary.mail_processed_success;
// mail_content.to = ['dimabkup@gmail.com'];
// mg.messages.create(mail_domain,mail_content)
//   .then(msg => console.log(msg))
//   .catch(err => console.log(err));

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
  res.render( __dirname + "/views/" + "index" );

    // mailCue.processMail(3, function(status){
    //   res.end('{"status":"success"}');
    // });
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
    address_2:req.query.visitor_address_2,
    city:req.query.visitor_city,
    state:req.query.visitor_state,
    zip:req.query.visitor_zip,
    number_of_cards:req.query.number_of_cards,
    price:0 //just a placeholder for now :( --> make this prettier!
  }

  mailPostcards.init(5,visitor_info);
  //initialize mail cue here but run it only after the credit card gets processed

  validate.confirmationMessage(visitor_info, __dirname + "/views/" + "confirm", function(path, validation_report,validation_state){
    //console.log(validation_report);   //send out validation report
    res.render(path, validation_state);
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
        console.log(charge);
        mailPostcards.send(function(delivery_status){
            if(delivery_status==true){
              res.end('{"status":"success"}');
            }
            else {
              res.end('{"status":"error"}');
            }
            //console.log('DELIVERY_STATUS: '+delivery_status);
            console.log("done done and done!");
          });
      }
    }
  );
})

app.get('/result', function (req, res) {
//report result of the card charge and postcard send requests to the viewers
  if(req.query.delivery_status=="success"){
    res.render( __dirname + "/views/" + "results", {delivery_status:true});
  }
  else{
    res.render( __dirname + "/views/" + "results",{delivery_status:false});
  }

})

//SERVER SETUP
var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})
