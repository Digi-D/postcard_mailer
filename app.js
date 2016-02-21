//NEED TO: add decent design, installation shots from sites
//Questions: How to validate address?
var express = require('express');
var hbars = require('express-handlebars');
var bodyParser = require('body-parser');
var uuid = require('uuid');
var mandrill = require('mandrill-api/mandrill');

var config = require('./app_modules/config.js');
var validate = require('./app_modules/validate_form.js');
//var mailCue = require('./app_modules/mail_cue.js');
var hbarsHelpers = require('./app_modules/helpers.js');

var stripe = require("stripe")(config.TEST_STRIPE_SECRET_KEY);
var mandrill_client = new mandrill.Mandrill(config.MANDRILL_KEY);

var app = express();
var json_parser = bodyParser.json();

var mailgun = require('mailgun-js')({apiKey: config.MAILGUN_API_KEY, domain: config.MAILGUN_DOMAIN});

var data = {
  from: 'INFINITE.INDUSTRIES <info@infinite.industries>',
  to: 'shifting.planes@gmail.com',
  subject: 'Hello',
  text: 'Testing some Mailgun awesomness!'
};

mailgun.messages().send(data, function (error, body) {
  console.log(body);
});







app.engine('handlebars',
  hbars({
    defaultLayout: 'container',
    helpers:hbarsHelpers
  })
);
app.set('view engine', 'handlebars');

var message_2_user = {
		"template_content":[{
        "name": "example name",
        "content": "example content"
    }],

    "message": {
        "from_email":"info@infinite.industries",
        "to":[{"email":"shifting.planes@gmail.com"}],
        "subject": "test from Mandrill",
        "text": "First basic test from Mandrill."
    }
};

//ROUTES
app.get('/', function (req, res) {
// present the project and address/number of postcards to the viewers
   res.render( __dirname + "/views/" + "index" );

  //  mailCue.processMail(3, function(status){
  //    res.end('{"status":"success"}');
  //  });

   mandrill_client.messages.send(message_2_user,
     function(res){
          console.log(res);
      },
     function(err) {
          console.log(err);
         console.log("oops!");

      });
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
