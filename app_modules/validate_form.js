var validateParams= {
  process:function(input_params) {
    var are_params_valid = true;
    console.log(input_params.first_name);
    return are_params_valid;
  }

}

module.exports= Object.create(validateParams)
