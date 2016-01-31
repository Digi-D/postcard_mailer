//testing Stripe Functionality

var fs = require('fs');
eval(fs.readFileSync('./my_keys.js').toString()); //throw your keys here
var express = require('express');
var hbars = require('express-handlebars');
var bodyParser = require('body-parser');
var stripe = require("stripe")(TEST_STRIPE_SECRET_KEY);

var app = express();

var json_parser = bodyParser.json();
app.engine('handlebars',hbars({defaultLayout: false}));
app.set('view engine', 'handlebars');


app.get('/', function (req, res) {
   res.render( __dirname + "/" + "simple_payment_form", {stripe_key:TEST_STRIPE_PUBLISHABLE_KEY});
})

app.post('/finalize_payment', json_parser, function (req, res) {
  console.log(req.body.tokenid+" "+req.body.payment_amount +" "+req.body.email);
  res.end('polo');

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
      }
    }
  );

  //console.log(req);
})

var server = app.listen(8081, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port);

})
