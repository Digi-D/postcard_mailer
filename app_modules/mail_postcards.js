var fs = require('fs');
var config = require('./config.js'); //throw your keys here
var Lob = require('lob')(config.TEST_LOB_KEY);
var async = require('async');

var sendPostcard = function(mail_description,mail_to){
  Lob.postcards.create({
    description:mail_description,
    to:mail_to,
    front: fs.readFileSync('./media/LOB_template.png'),
    back: '<html style="padding-left:0.3in;padding-top:0.5in"><div style="font-size:0.3in">The International</div><div style="font-size:15px;padding-top:0.1in; padding-left:0.2in;font-family:sans-serif;">infinite.industries/the-international</div></html>',
  },
  function (err, res) {
    console.log(err, res);
  })
}


var mailPostcards = {
  mail_params:{},
  init:function(params,cue_length){
    this.mail_params = {
      description: 'Demo Postcard job6',
      //skipping "from" attribute
      to: {
        name: 'Joe Smith',
        address_line1: '123 Main Street',
        address_city: 'Mountain View',
        address_state: 'CA',
        address_zip: '94041'
      }
    };
    
  },
  process_cue:function(){

  },
  send:function(){
    async.retry(
      {times: 3, interval: 100},
      sendPostcard(this.mail_params.description,this.mail_params.to),
      function(err, result) {
      // do something with the result
      });

  }
}

module.exports = Object.create(mailPostcards);
