const express = require("express") ;
const mongoose = require("mongoose") ;
const PORT = 3000 ;
const userRoutes = require("./route/user"); 
const recordRoutes = require("./route/record");
const summaryRoutes = require("./route/summary");

const app = express() ;

app.use(express.json()); 

app.use("/api/users", userRoutes);
app.use("/api/records", recordRoutes);
app.use("/api", summaryRoutes);

app.get("/", (req,res)=> {
    res.send("Hi, I am root ") ;
});

app.use((err, req, res, next) => {
    console.error("Global Error:", err.message);
    res.status(err.status || 500).json({
        error: err.message || "Internal Server Error"
    });
});


app.listen(PORT, ()=> {
    console.log(`app is listening on ${PORT}`) ;
})