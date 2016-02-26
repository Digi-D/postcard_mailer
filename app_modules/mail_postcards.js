var fs = require('fs');
var config = require('./config.js'); //throw your keys here
var Lob = require('lob')(config.TEST_LOB_KEY);
var async = require('async');

var sendPostcard = function (mail_description, mail_to, cb) {
  Lob.postcards.create({
      description: mail_description,
      to: mail_to,
      front: fs.readFileSync('./media/LOB_template.png'),
      back: '<html style="padding-left:0.3in;padding-top:0.5in"><div style="font-size:0.3in">The International</div><div style="font-size:15px;padding-top:0.1in; padding-left:0.2in;font-family:sans-serif;">infinite.industries/the-international</div></html>',
    },
    function (err, res) {
      console.log(err);
      cb(err, res);   // !  - if you need success action  cb(null, res);
    });
};

var repeat = 3;

var mail_params = {};
var status = 'success';

module.exports = {
  status: status,
  init: function (params) {
    mail_params = params;
  },
  send: function (callback) {
    var result;
    var counter = 1;
    for (var i = 0; i < mail_params.queue_length; i++) {
      async.retry(
        {times: repeat, interval: 100},
        function (callback, results) {
          sendPostcard(mail_params.description, mail_params.to, callback);
        },
        function (err, result) {
          if (err) status = 'failure';
          if (counter == mail_params.queue_length) {
            callback(err, status);
          }
          counter++;
        });
    }
  }
};
