const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
const Order = require('../models/orders.model');
const jwt = require("jsonwebtoken");
const route = express.Router();
const mcurl =
  "mongodb://localhost:27017/c-Mart";
mongoose
  .connect(mcurl)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

  route.get('/orders',(req,res)=>{
    Order.find()
    .then((data)=>{
        console.log(data);
        res.json(data)
    })
    .catch((err)=>{
        console.log(err);
    })
  })

  route.delete('/deleteproduct/:id',(req,res)=>{
    const productId = req.params.id;
    Order.findByIdAndDelete(productId)
    .then((result)=>{
      if(!result){
        res.json({msg:'Product not found'})
      }
      res.json({msg : 'Product Deleted Successfully'});
    })
    .catch((err)=>{
      console.log(err);
      res.json({msg : 'Error in deleting Product', error : err.message});
    })
  })


  route.post('/placeorder',(req,res)=>{
    const neworder = new Order(req.body);
    neworder.status.push({ action : 'placed', timestamp : Date.now() });
    neworder.save()
    .then((order)=>{
        console.log(order);
        res.json({msg:'Order Placed'})
    })
    .catch((err)=>{
        res.json({msg:'Place Ordered Failed',error : err.message})
    })
  })

  route.put('/acceptorder/:id',(req,res)=>{
    const updstatus = { action : 'accepted', timestamp : Date.now() };
    const accorder = Order.findOneAndUpdate( { _id : req.params.id }, { $push : { status : updstatus } } )
    accorder
    .then((order)=>{
      console.log(order);
      res.json({ msg : 'Order Accepted'})
    })
    .catch((err)=>{
      console.log(err);
      res.json({ msg : 'Order not accepted' , error : err.message })
    })
  })

  route.put('/dispatchorder/:id',(req,res)=>{
    const updstatus = { action : 'dispatched', timestamp : Date.now() };
    const dispatchorder = Order.findOneAndUpdate( { _id : req.params.id }, { $push : { status : updstatus } })
    dispatchorder
    .then((order)=>{
      console.log(order);
      res.json({ msg : 'Order Dispatched'})
    })
    .catch((err)=>{
      console.log(err);
      res.json({ msg : 'Order not dispatched', error : err.message })
    })
  })

  route.put('/deliverorder/:id',(req,res)=>{
    const updstatus = { action : 'delivered', timestamp : Date.now() };
    const deliverorder = Order.findOneAndUpdate( { _id : req.params.id }, { $push : { status : updstatus } })
    deliverorder
    .then((order)=>{
      console.log(order);
      res.json({ msg : 'Order Delivered'})
    })
    .catch((err)=>{
      console.log(err);
      res.json({ msg : 'Order not delivered', error : err.message })
    })
  })
  
  route.get('/orderbyusername',(req,res)=>{
    const { username } = req.query;
    Order.find({username})
    .then((data)=>{
      console.log(data);
      res.json(data);
    })
    .catch((err)=>{
      console.log(err);
      res.json({ msg : 'Error fetching orders by username', error : err.message })
    })
  })
  module.exports = route;
