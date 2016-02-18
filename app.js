//NEED TO: add decent design, installation shots from sites
//Questions: How to validate address?
var express = require('express');
var app = express();
var hbars = require('express-handlebars');

var config = require('./app_modules/config.js');
var validate = require('./app_modules/validate_form.js');
var hbarsHelpers = require('./app_modules/helpers.js');


app.engine('handlebars',
  hbars({
    defaultLayout: 'container',
    helpers:hbarsHelpers
  })
);
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
// present the project and address/number of postcards to the viewers
   res.render( __dirname + "/views/" + "index" );
})

app.get('/result', function (req, res) {
//report result of the card charge and postcard send requests to the viewers
   res.render( __dirname + "/views/" + "results" );
})

app.get('/get_visitor_info', function (req, res) {
//recieve, validate and render out for confimation by user all of the parameters of the order

  var visitor_info = {
    first_name:req.query.visitor_first_name,
    last_name:req.query.visitor_last_name,
    email:req.query.visitor_email,
    address_1:req.query.visitor_address_1,
    address_2:req.query.visitor_address_2,
    city:req.query.visitor_city,
    state:req.query.visitor_state,
    zip:req.query.visitor_zip,
    number_of_cards:req.query.number_of_cards,
    price:0 //just a placeholder for now make this prettier!
  }

  validate.confirmationMessage(visitor_info, __dirname + "/views/" + "confirm", function(path, validation_state){
    res.render(path, validation_state);
  });

})


var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})
