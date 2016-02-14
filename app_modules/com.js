
var events = require('events');
var inter_com = new events.EventEmitter();

function comBus() {}

comBus.prototype.initListener = function(listener_name, handler) {
    this.listener_name = listener_name;
    this.handler_function = handler;
    inter_com.on(this.listener_name, this.handler_function);
};

comBus.prototype.sendMessage = function(listener_name, data) {
    this.listener_name = listener_name;
    this.data = data;
    inter_com.emit(this.listener_name, this.data);
};


module.exports = Object.create(comBus.prototype);
