var config = require('./config.js');
var mailgun = require('mailgun.js');
var mg = mailgun.client({username: 'api', key: config.getGlobal('LIVE_MAILGUN_API_KEY')});
var mail_domain = config.getGlobal('LIVE_MAILGUN_DOMAIN');

var email_templates = {

  mail_processed_success:{
    from: 'INFINITE.INDUSTRIES <info@infinite.industries>',
    to: ['test@infinite.industries'],
    subject: 'Thank you for ordering the cards!',
    text: 'Thank you for your order!'
  },
  mail_processed_succes_admin_update:{
    from: 'INFINITE.INDUSTRIES <info@infinite.industries>',
    to: ['shifting.planes@gmail.com'],
    subject: 'Successfull Order',
    text: 'Quick order summary'
  },
  mail_processed_failure:{
    from: 'INFINITE.INDUSTRIES <info@infinite.industries>',
    to: ['shifting.planes@gmail.com'],
    subject: 'Order Update',
    text: 'Unfortunately, one or more cards in your order has not been processed properly. We will review the details of the order and contact you as soon as possible.'
  },
  admin_update:{
    from: 'INFINITE.INDUSTRIES <info@infinite.industries>',
    to: ['shifting.planes@gmail.com'],
    subject: 'Order status and info',
    text: 'Quick order summary and contact info for the visitor'
  }
}


module.exports = {
  sendUserEmail:function(which_email, order_summary){

  },
  sendAdminEmail:function(order_status, which_email, order_summary){

    var mail_content = email_templates[which_email];

    mail_content.to = [config.getGlobal('ADMIN_EMAIL')];
    mail_content.subject = order_status+' Order '+order_summary.description;
    mail_content.text = "Order Status:"+order_status+
      "\nJob Number: "+order_summary.description+
      "\nContact Email: "+order_summary.email+
      "\nNumber of Cards: "+order_summary.queue_length+
      "\nSent to: "+order_summary.to.name+
      "\nAddress: "+order_summary.to.address_line1+
      "\nCity: "+ order_summary.to.address_city+
      "\nState: "+order_summary.to.address_state+
      "\nZip: "+order_summary.to.address_zip;
    mg.messages.create(mail_domain,mail_content)
      .then(msg => console.log(msg))
      .catch(err => console.log(err));
  },
  test:function(){
    console.log("yo!");
  }

}
