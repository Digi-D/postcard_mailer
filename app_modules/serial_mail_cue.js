//wraps around lob.com create card call to order multiple cards
//the API is not able to do this out of the box and I don't want to hammer their servers
//so all the requests are put into a cue and executed one after another
//each iteration over a cue member is reported back to app.js and logged there


var config = require('./config.js'); //throw your keys here
var Lob = require('lob')(config.TEST_LOB_KEY);
var fs = fs = require('fs');


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
      description: this.new_job.description,
      to: {
        name: this.new_job.send_to.name,
        address_line1: this.new_job.send_to.address,
        address_city: this.new_job.send_to.city,
        address_state: this.new_job.send_to.state,
        address_zip: this.new_job.send_to.zip
      },
      //skipping "from" attribute
      front: fs.readFileSync('../media/LOB_template.png'),
      back: '<html style="padding-left:0.3in;padding-top:0.5in"><div style="font-size:0.3in">The International</div><div style="font-size:15px;padding-top:0.1in; padding-left:0.2in;font-family:sans-serif;">the-international.infinite.industries</div></html>',
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
