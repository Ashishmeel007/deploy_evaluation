const express = require('express');
const {connection} = require('./db');
const { userRouter } = require('./routes/user.routes');
const { postRouter } = require('./routes/post.routes');
require("dotenv").config();

const app = express();
app.use(express.json());

app.use("/users",userRouter);
app.use("/posts",postRouter);


app.listen(process.env.port,async()=>{
    try{
        await connection
        console.log("connected to the DB");
        console.log(`Running at port no ${process.env.port}`)
    } catch(err){
        console.log(err)
       console.log("Something went wrong!!")
    };
    
})