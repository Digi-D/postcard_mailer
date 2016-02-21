//NEED TO: add decent design, installation shots from sites
//Questions: How to validate address?
var config = require('./app_modules/config.js');
var express = require('express');
var hbars = require('express-handlebars');
var bodyParser = require('body-parser');
var uuid = require('uuid');

var mailgun = require('mailgun.js');
var emailLibrary = require('./app_modules/transactional_email.js');
var mg = mailgun.client({username: 'api', key: config.MAILGUN_API_KEY});
var mail_domain = config.MAILGUN_DOMAIN;

var validate = require('./app_modules/validate_form.js');
//var mailCue = require('./app_modules/mail_cue.js');
var hbarsHelpers = require('./app_modules/helpers.js');

var stripe = require("stripe")(config.TEST_STRIPE_SECRET_KEY);
//var mailgun = require('mailgun-js')({apiKey: config.MAILGUN_API_KEY, domain: config.MAILGUN_DOMAIN});

var app = express();
var json_parser = bodyParser.json();


var mail_content = emailLibrary.mail_processed_success;
mail_content.to = ['dimabkup@gmail.com'];
mg.messages.create(mail_domain,mail_content)
  .then(msg => console.log(msg))
  .catch(err => console.log(err));


app.engine('handlebars',
  hbars({
    defaultLayout: 'container',
    helpers:hbarsHelpers
  })
);
app.set('view engine', 'handlebars');


//ROUTES
app.get('/', function (req, res) {
// present the project and address/number of postcards to the viewers
   res.render( __dirname + "/views/" + "index" );

  //  mailCue.processMail(3, function(status){
  //    res.end('{"status":"success"}');
  //  });
})

app.get('/result', function (req, res) {
//report result of the card charge and postcard send requests to the viewers
   res.render( __dirname + "/views/" + "results" );
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

  validate.confirmationMessage(visitor_info, __dirname + "/views/" + "confirm", function(path, validation_state){
    res.render(path, validation_state);
    mailCue.init(visitor_info);
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
        console.log("begin sending cards");
      }
    }
  );
})

//SERVER SETUP
var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})
