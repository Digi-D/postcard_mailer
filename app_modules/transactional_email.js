module.exports = {

  mail_processed_success:{
    from: 'INFINITE.INDUSTRIES <info@infinite.industries>',
    to: ['test@infinite.industries'],
    subject: 'Thank you for ordering the cards',
    text: 'All card orders came through OK'
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
  mail_processed_failure_admin_update:{
    from: 'INFINITE.INDUSTRIES <info@infinite.industries>',
    to: ['shifting.planes@gmail.com'],
    subject: 'ALERT!!!! something went wrong with an order',
    text: 'Quick order summary and contact info for the visitor'
  },
}
