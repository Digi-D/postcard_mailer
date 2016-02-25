//wraps around lob.com create card call to order multiple cards
//the API is not able to do this out of the box and I don't want to hammer their servers
//so all the requests are put into a cue and executed one after another
//each iteration over a cue member is reported back to app.js and logged there


var config = require('./config.js'); //throw your keys here
var Lob = require('lob')(config.TEST_LOB_KEY);
var fs = fs = require('fs');

var serialCue = {
  index: undefined,
  delivery_status: false,
  init:function(length_of_cue, params){
    this.length_of_cue = length_of_cue;
    this.index = 0;
    console.log("init cue index : "+this.index);
  },
  monitor: function(){
    //console.log(this.index);
    //this.handler();
     this.index++;
     if(this.index>=this.length_of_cue){
       this.handler(this.delivery_status);
       console.log('DELIVERY_STATUS: '+this.delivery_status);
     }
  },
  eachIteration: function(callback){
    console.log("do something");
    this.delivery_status = true;
    callback();
  },
  startProcessing: function(handler){
    this.handler = handler;
    for(var count=0;count<this.length_of_cue;count++){
      this.eachIteration(this.monitor.bind(this));
      //NOTE to self; if not bound to serialCue object's scope, the callback function will use
      //eachIteration object's scope and debugging hell will start
    }
  }
}

module.exports = Object.create(serialCue);
