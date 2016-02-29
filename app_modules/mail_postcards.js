var fs = require('fs');
var config = require('./config.js'); //throw your keys here
var Lob = require('lob')(config.getKey('LOB_KEY'));
var async = require('async');

var mail_params = {
  description: null,
  //skipping "from" attribute
  to: {
    name: null,
    address_line1: null,
    address_city: null,
    address_state: null,
    address_zip: null
  },
  queue_length: null,
  email: null
};

var sendPostcard = function (mail_description, mail_to, callback) {
  //console.log(mail_description);
  //console.log(mail_to.address_state);

  Lob.postcards.create({
      description: mail_description,
      to: mail_to,
      front: fs.readFileSync('./media/the_international.png'),
      back: '<html style="padding-left:0.3in;padding-top:0.5in"><div style="font-size:0.3in">The International</div><div style="font-size:15px;padding-top:0.1in; padding-left:0.2in;font-family:sans-serif;">the-international.infinite.industries</div></html>',
    },
    function (err, res) {
      console.log('log:'+err);
      callback(err, res);
    });
};

var repeat = 3;

// var mail_params = {};
var status = 'success';

module.exports = {
  status: status,
  init: function (params) {

    mail_params.queue_length = params.number_of_cards;
    mail_params.description = "job_id-"+params.id;
    mail_params.to.name = params.first_name+" "+params.last_name;
    mail_params.to.address_line1 = params.address_1;
    // if(params.address_2.length>0){
    //   mail_params.to.address_line2 = params.address_2;
    // }
    mail_params.to.address_city = params.city;
    mail_params.to.address_state = params.state;
    mail_params.to.address_zip = params.zip;
    mail_params.email = params.email;
  },
  send: function (callback) {
    var result;
    var counter = 1;

    var sender =  function(){
      async.retry(
      {times: repeat, interval: 100},
      function (callback, results) {
        sendPostcard(mail_params.description, mail_params.to, callback);
      },
      function (err, result) {
        if (err) status = 'error';
        if (counter == mail_params.queue_length) {
          //err = {fake:'error'};
          callback(err, status, result);
          //returns the result info on the last card | not catching the case of
          //cards being sent over the break between two workdays
        }
        else {
          counter++;
          sender();
        }
      })
    }
    sender();
  },
  jobSummary: function(){
      return(mail_params);
  }
};
