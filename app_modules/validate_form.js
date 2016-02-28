//validate the form
//and pass the data to the handlebars template to render
var validator = require('validator');
var config = require('./config.js');

var isValidUSZip = function(sZip) {
   return /^\d{5}(-\d{4})?$/.test(sZip);
}

module.exports= {
  confirmationMessage: function (params_to_validate, path_to_confirmation_view, stripe_key, callback) {
    this.params_to_validate = params_to_validate;
    this.stripe_key = stripe_key;

    var country = "US";
    var validation_report = [];
    var are_params_valid = true;

    validation_report['report_timestamp'] = "bs_timestamp";
    if(!validator.isAlpha(this.params_to_validate.first_name)){
      are_params_valid= false;
      validation_report['first_name'] = this.params_to_validate.first_name;
      validation_report['first_name_status'] = "failed";
    }
    else if(!validator.isAlpha(this.params_to_validate.last_name)){
      are_params_valid= false;
      validation_report['last_name'] = this.params_to_validate.last_name;
      validation_report['last_name_status'] = "failed";
    }
    else if(!validator.isEmail(this.params_to_validate.email)){
      are_params_valid= false;
      validation_report['email'] = this.params_to_validate.email;
      validation_report['email_status'] = "failed";
    }
    else if(!validator.isAlpha(this.params_to_validate.city)){
      are_params_valid= false;
      validation_report['city'] = this.params_to_validate.city;
      validation_report['city_status'] = "failed";
    }
    else if(!validator.isAlpha(this.params_to_validate.state)){
      are_params_valid= false;
      validation_report['state'] = this.params_to_validate.state;
      validation_report['state_status'] = "failed";
    }
    else if(!validator.isInt(this.params_to_validate.zip)){
      are_params_valid= false;
      validation_report['zip'] = this.params_to_validate.zip;
      validation_report['zip_status'] = "failed";
    }
    else if(!validator.isInt(this.params_to_validate.number_of_cards)){
      are_params_valid= false;
      validation_report['number_of_cards'] = this.params_to_validate.number_of_cards;
      validation_report['number_of_cards_status'] = "failed";
    }
    else{
      //basic checks done | check zip and number_of_cards and bake correct price
      if(country=="US"){
        if(isValidUSZip(this.params_to_validate.zip)){
          are_params_valid= true;
        }
        else{
          are_params_valid = false;
          validation_report['zip'] = this.params_to_validate.zip;
          validation_report['zip_status'] = "wrong zip";
        }
      }

      if(this.params_to_validate.number_of_cards>0){
          this.params_to_validate.price = this.params_to_validate.number_of_cards*config.getGlobal('PRICE_PER_CARD');
          are_params_valid = true;
      }
      else {
        are_params_valid= false;
        validation_report['number_of_cards'] = this.params_to_validate.number_of_cards;
        validation_report['number_of_cards_status'] = "zero or less";
      }
    }

    validation_report['report_exit_status'] = are_params_valid;

    callback(path_to_confirmation_view, validation_report,{
      //pass all of the form inputs and validation state to
      //handlebars engine to render
      visitor_info:this.params_to_validate,
      params_valid:are_params_valid,
      stripe_key:this.stripe_key
    });
  },
}
