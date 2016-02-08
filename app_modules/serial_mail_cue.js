var fs = fs = require('fs');
var MY_KEYS = require('./my_keys.js'); //throw your keys here
var Lob = require('lob')(MY_KEYS.TEST_LOB_KEY);
var uuid = require('uuid');
var events = require('events');
var bunyan = require('bunyan');


var serialCue = {
  init:function(new_job){
    //inhale where to ship and job details and initialize the first card shipment
    this.new_job=new_job;
    this.job_counter=0;
    this.status='success'
    this.renderCard();
  },
  eachIteration:function(){
    //create new job to put in the cue
    //when reach end of cue, call end method
    this.job_counter++;
    if(this.job_counter<this.new_job.number_of_cards){
      this.renderCard();
    }
    else{
      this.endCue();
    }
  },
  renderCard:function(){
    console.log(this.new_job.send_to.name + " "+this.job_counter+" of "+this.new_job.number_of_cards);
    Lob.postcards.create({
      description: 'Demo Postcard job4',
      to: {
        name: this.new_job.send_to.name,
        address_line1: this.new_job.send_to.address,
        address_city: this.new_job.send_to.city,
        address_state: this.new_job.send_to.state,
        address_zip: this.new_job.send_to.zip
      },
      //skipping "from" attribute
      front: fs.readFileSync('./media/LOB_template.png'),
      back: '<html style="padding-left:0.3in;padding-top:0.5in"><div style="font-size:0.3in">The International</div><div style="font-size:15px;padding-top:0.1in; padding-left:0.2in;font-family:sans-serif;">infinite.industries/the-international</div></html>',
    }, function (err, res) {
        if(err){
          eventEmitter.emit('fail',err);
        }
        else{
          if(res.id){
            eventEmitter.emit('success');
          }
          else {
            eventEmitter.emit('fail');
          }
        }

    });
  },
  endCue:function(){
    if(this.status=='success'){
      console.log("Done!Last one printed.");
    }
    else {
      console.log("One or more prints didn't render");
    }
  }
}

module.exports = Object.create(serialCue);
