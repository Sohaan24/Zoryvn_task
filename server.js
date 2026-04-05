const express = require("express") ;
const mongoose = require("mongoose") ;
const PORT = 3000 ;
const userRoutes = require("./route/userRoutes"); 
const recordRoutes = require("./route/recordRoutes");

const app = express() ;

app.use(express.json()); 

app.use("/api/users", userRoutes);
app.use("/api/records", recordRoutes);

app.get("/", (req,res)=> {
    res.send("Hi, I am root ") ;
})


app.listen(PORT, ()=> {
    console.log(`app is listening on ${PORT}`) ;
})