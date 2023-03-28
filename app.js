const express = require("express");

const app = express();
//All your code goes here
app.use(express.json());
const fs = require('fs');


app.get("/courses", (req, res) => {
    res.json(fs.readFile('./database/courses.json', (error, content)=>{
        if(error) return error;
        return content;
    }));
})














//Do not remove this line. This allows the test suite to start
//multiple instances of your server on different ports
module.exports = app;
