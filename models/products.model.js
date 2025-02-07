const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name : String,
    price : String,
    imgUrl : String,
    company: String,
    category : String,
    description : String
})

const Product = mongoose.model('product',productSchema);
module.exports = Product;