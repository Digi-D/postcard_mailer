//NEED TO: add form validation, decent design, installation shots from sites
var express = require('express');
var app = express();
var hbars = require('express-handlebars');
var bodyParser = require('body-parser');
var config = require('./app_modules/config.js');

app.engine('handlebars',hbars({defaultLayout: 'container'}));
app.set('view engine', 'handlebars');


app.get('/', function (req, res) {
// present the project and address/number of postcards to the viewers
   res.render( __dirname + "/views/" + "index" );
})

// app.get('/confirm', function (req, res) {
// //confirm address, number of postcard and price with the viewiers
//    res.render( __dirname + "/" + "confirm" );
// })

app.get('/result', function (req, res) {
//report result of the card charge and postcard send requests to the viewers
   res.render( __dirname + "/" + "results" );
})

// app.get('/get_visitor_info', function (req, res) {
//
//    response = {
//       visitor_name:req.query.visitor_name,
//       visitor_address:req.query.visitor_address,
//       visitor_city:req.query.visitor_city,
//       visitor_state:req.query.visitor_state,
//       visitor_zip:req.query.visitor_zip,
//    };
//    console.log(response);
//    res.end(JSON.stringify(response));
// })

app.get('/get_visitor_info', function (req, res) {
  var visitor_info = {
    name:req.query.visitor_name,
    address_1:req.query.visitor_address,
    city:req.query.visitor_city,
    state:req.query.visitor_state,
    zip:req.query.visitor_zip,
  }
  //console.log(JSON.stringify(visitor_info));
  res.render( __dirname + "/views/" + "confirm", {visitor_info : visitor_info});
})



var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})
