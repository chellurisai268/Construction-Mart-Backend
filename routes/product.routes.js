const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
const Product = require('../models/products.model');
const jwt = require("jsonwebtoken");
const routers = express.Router();
const mcurl =
  "mongodb+srv://jvdimvp:Pradeep903@cluster0.d2cwd.mongodb.net/ConstructionMart?retryWrites=true&w=majority&appName=Cluster0";
mongoose
  .connect(mcurl)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

  routers.get('/',(req,res)=>{
    Product.find()
    .then((data)=>{
        console.log(data);
        res.json(data);
    })
    .catch((err)=>{
        console.log(err);
    })
  })

  routers.get('/cat/:categoryname',async(req,res)=>{
    const { categoryname } = req.params;
    Product.find({
      $or: [
        { category: { $regex: categoryname, $options: "i" } }
    ]
    })
    .then((data)=>{
        console.log(data);
        res.json(data);
    })
    .catch((err)=>{
        console.log(err);
    })
  })

  routers.get('/:id',(req,res)=>{
    Product.findById(req.params.id)
    .then((data)=>{
        console.log(data);
        res.json(data)
    })
    .catch((err)=>{
        console.log(err);
    })
  })

  routers.post('/addnewproduct',(req,res)=>{
    const newproduct = new Product(req.body);
    newproduct.save()
    .then((product)=>{
        console.log(product);
        res.json({msg:'Product Saved Successfully'})
    })
    .catch((err)=>{
        console.log(err);
        res.json({msg:'Product saving failed', error : err.message});
    })
  })
  
  routers.get('/search/:searchQuery', async (req, res) => {
    console.log("req.query.searchQuery",req.params.searchQuery);
    try {
        const { searchQuery } = req.params; // Get search query from request
        if (!searchQuery) {
            return res.status(400).json({ message: "Search query is required" });
        }
        console.log("query",searchQuery);
        // Use MongoDB's `$regex` to search case-insensitively in name, company, and description
        const searchResults = await Product.find({
            $or: [
                { name: { $regex: searchQuery, $options: "i" } },
                { company: { $regex: searchQuery, $options: "i" } },
                { description: { $regex: searchQuery, $options: "i" } }
            ]
        });
        console.log("searchResults",searchResults);
        res.json(searchResults);
    } catch (error) {
        console.error("error",error);
        res.status(500).json({ message: "Server Error" });
    }
});


  module.exports = routers;
