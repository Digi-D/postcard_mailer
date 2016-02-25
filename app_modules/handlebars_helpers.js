//Handlebars helpers here

module.exports = {
  hide_if_empty: function (eval_if_empty,options) {
    if(eval_if_empty=='none'){
      return options.inverse(this);
    }
    else {
      return options.fn(this);
    }
  }
}
