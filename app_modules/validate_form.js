var validator = require('validator');
var config = require('./config.js');

var isValidUSZip = function(sZip) {
   return /^\d{5}(-\d{4})?$/.test(sZip);
}

module.exports= {

  confirmationMessage: function (params_to_validate, path_to_confirmation_view, callback) {
    this.params_to_validate = params_to_validate;
    var country = "US";
    var are_params_valid = true;
    if(!validator.isAlpha(this.params_to_validate.first_name)){
      are_params_valid= false;
    }
    else if(!validator.isAlpha(this.params_to_validate.last_name)){
      are_params_valid= false;
    }
    else if(!validator.isEmail(this.params_to_validate.email)){
      are_params_valid= false;
    }
    else if(!validator.isAlpha(this.params_to_validate.city)){
      are_params_valid= false;
    }
    else if(!validator.isAlpha(this.params_to_validate.state)){
      are_params_valid= false;
    }
    else if(!validator.isInt(this.params_to_validate.zip)){
      are_params_valid= false;
    }
    else if(!validator.isInt(this.params_to_validate.number_of_cards)){
      are_params_valid= false;
    }
    else{
      //basic checks done | check zip and number_of_cards and bake correct price
      if(country=="US"){
        if(isValidUSZip(this.params_to_validate.zip)){
          are_params_valid= true;
        }
        else{
          are_params_valid = false;
        }
      }

      if(this.params_to_validate.number_of_cards>0){
          this.params_to_validate.price = this.params_to_validate.number_of_cards*config.PRICE_PER_CARD;
          are_params_valid = true;
      }
      else {
        are_params_valid= false;
      }





    }


    callback(path_to_confirmation_view, {
      //pass all of the form inputs and validation state to
      //handlebars engine to render
      visitor_info:this.params_to_validate,
      params_valid:are_params_valid
    });
  },
}
