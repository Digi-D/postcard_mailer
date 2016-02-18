//NEED TO: add decent design, installation shots from sites
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
  var final_price = req.query.number_of_cards*config.PRICE_PER_CARD;
  var visitor_info = {
    first_name:req.query.visitor_first_name,
    last_name:req.query.visitor_last_name,
    address_1:req.query.visitor_address_1,
    address_2:req.query.visitor_address_2,
    city:req.query.visitor_city,
    state:req.query.visitor_state,
    zip:req.query.visitor_zip,
    number_of_cards:req.query.number_of_cards,
    price:final_price,
  }
  var confirmationMessage = function (params_to_validate, path_to_confirmation_view, callback) {
    this.params_to_validate = params_to_validate;
    var are_params_valid = true;
    console.log(this.params_to_validate.first_name);
    callback(path_to_confirmation_view, {
      visitor_info:this.params_to_validate,
      params_valid:are_params_valid
    });
  }
//
  var generateConfirmView = function(path, validation_state){
    res.render(path, validation_state);
  }

  confirmationMessage(visitor_info, __dirname + "/views/" + "confirm", generateConfirmView);



  //console.log(confirmation_messages.params_valid);
})


var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})
