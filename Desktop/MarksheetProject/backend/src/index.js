
const express = require('express');
const route =require("./route/route.js");
const mongoose  = require('mongoose');

const app= express();


app.use(express.json());

mongoose.set('strictQuery', true)
mongoose.connect("mongodb+srv://functionup-cohort:Vrvn1212@cluster0.jn5ja3l.mongodb.net/backend?retryWrites=true&w=majority", {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )


 app.use('/', route);

 route.all("/*", function (req, res) { 
    res.status(400).send({status: false,message: "The api you request is not available"})
})


app.listen(3000, function () {
    console.log('Express app running on port ' + (3000))
});

