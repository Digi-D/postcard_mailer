//NEED TO: add form validation, decent design, installation shots from sites
var express = require('express');
var app = express();
var hbars = require('express-handlebars');
var bodyParser = require('body-parser');
var config = require('./config.js'); //throw your keys and other settings here

app.engine('handlebars',hbars({defaultLayout: false}));
app.set('view engine', 'handlebars');


app.get('/', function (req, res) {
// present the project and address/number of postcards to the viewers
   res.sendFile( __dirname + "/views/" + "index.html" );
})
app.get('/confirm', function (req, res) {
//confirm address, number of postcard and price with the viewiers
   res.sendFile( __dirname + "/" + "confirm.html" );
})

app.get('/result', function (req, res) {
//report result of the card charge and postcard send requests to the viewers
   res.sendFile( __dirname + "/" + "result.html" );
})

app.get('/get_visitor_info', function (req, res) {

   response = {
      visitor_name:req.query.visitor_name,
      visitor_address:req.query.visitor_address,
      visitor_city:req.query.visitor_city,
      visitor_state:req.query.visitor_state,
      visitor_zip:req.query.visitor_zip,
   };
   console.log(response);
   res.end(JSON.stringify(response));
})

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})
