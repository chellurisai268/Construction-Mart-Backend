var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    username : String,
    password : String,
    role : String,
    mobile : Number
})

const User = mongoose.model('user',userSchema);
module.exports = User;