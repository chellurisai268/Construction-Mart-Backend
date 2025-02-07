const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(cors());

const router = require('./routes/auth.routes');
app.use('/users',router);

const routers = require('./routes/product.routes');
app.use('/products',routers);

const route = require('./routes/order.routes');
app.use('/orders',route);

app.listen(4700,()=>{
    console.log("Server is Running on 4700");
})