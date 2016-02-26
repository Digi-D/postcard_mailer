var mailPostcards = require('./app_modules/mail_postcards');

var mail_params = {
  description: 'Demo Postcard job6',
  //skipping "from" attribute
  to: {
    name: 'Joe Smith',
    address_line1: '123 Main Street',
    address_city: 'Mountain View',
    address_state: 'CA',
    address_zip: '94041'
  },
  queue_length: 5
};

mailPostcards.init(mail_params);
callback = function(err, result) {
  console.log('we GOT IT!!!! -->', result);
};

mailPostcards.send(callback);

