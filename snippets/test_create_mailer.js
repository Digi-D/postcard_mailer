//testing Lob functionality
//https://lob.com/docs
//https://github.com/lob/lob-node

var fs = require('fs');
eval(fs.readFileSync('./my_keys.js').toString()); //throw your keys here
var Lob = require('lob')(TEST_LOB_KEY);


Lob.postcards.create({
  description: 'Demo Postcard job4',
  to: {
    name: 'Joe Smith',
    address_line1: '123 Main Street',
    address_city: 'Mountain View',
    address_state: 'CA',
    address_zip: '94041'
  },
  //skipping "from" attribute
  front: fs.readFileSync('./media/LOB_template.png'),
  back: '<html style="padding-left:0.3in;padding-top:0.5in"><div style="font-size:0.3in">The International</div><div style="font-size:15px;padding-top:0.1in; padding-left:0.2in;font-family:sans-serif;">infinite.industries/the-international</div></html>',
}, function (err, res) {
  console.log(err, res);
});
