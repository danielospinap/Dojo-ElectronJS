var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var UserSchema = new Schema({
    correo: {
      type: String,
      required: 'Kindly enter the name of the task'
    },
    usuario: {
      type: String,
      required: 'Kindly enter the name of the task'
    },
    password: {
      type: String,
      required: 'Kindly enter the name of the task'
    },
});

module.exports = mongoose.model('User', UserSchema);
