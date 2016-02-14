//NEED TO: add form validation, decent design, installation shots from sites


var express = require('express');
var app = express();

//app.use(express.static('public'));

app.get('/', function (req, res) {
   res.sendFile( __dirname + "/" + "index.html" );
})

app.get('/process_get', function (req, res) {

   // Prepare output in JSON format
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
