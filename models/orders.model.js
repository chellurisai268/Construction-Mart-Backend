const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    username : String,
    status : [
        {
            action : String,
            timestamp : Number
        }
    ],
    cartItems : [
        {
            name : String,
            price : String,
            imgUrl : String,
            company : String,
            category : String,
            count : Number
        }
    ]
},{timestamps:true})

const Order = mongoose.model('order',orderSchema);
module.exports = Order; 