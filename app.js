const express = require("express");
const fs = require('fs');
const app = express();

const courses = __dirname + '\\database\\courses.json';
const users = __dirname + '\\database\\users.json';


app.use(express.json());
app.use(express.static('./public'));

app.get("/courses", (req, res) => {
    let num, upper;
    if(req.query.num < 10){
         num = req.query.num * 1000;
         upper = num + 1000;
    } else {
         num = req.query.num;
    }
    fs.readFile(courses, (error, content)=>{
        if(error) return;
        content = JSON.parse(content.toString());
        if(num) {
            if(upper){
                content = content.filter(course => course.num >= num && course.num < upper);
            } else {
                content = content.filter(course => course.num == num);
            }
        }
        if(req.query.code) content = content.filter(course => course.code == req.query.code.toUpperCase());          
        res.json(content);
    })
})

app.get("/account/:id", (req, res) => {
    const id = req.params.id.split(':')[0];
    const error = {"error": "User ID " + id + " does not exist."};
    fs.readFile(users, (err, content) => {
        if(err) return err;
        content = JSON.parse(content.toString());
        content = {user: content.filter(u => u.id == id)[0]};
        if(!content.user) {
            res.statusCode = 404;
            res.json(error);
        } else {
            delete content.user.password;
            res.json(content);
        }
    })
})

app.post("/users/login", (req, res) =>{
    un = req.body.username;
    pw = req.body.password;
    let error = {"error": "Username " + un + " does not exist."};
    fs.readFile(users, (err, content) => {
        if(err) return err;
        content = JSON.parse(content.toString());
        content = {user: content.filter(u => u.username == un)[0]};
        if(!content.user) {
            res.statusCode = 404;
            res.json(error);
        } else {
            if(content.user.password == pw){
                res.statusCode = 200;
                content = {userId: content.user.id}
                res.json(content);
            } else {
                error = {"error": "Password is incorrect."};
                res.statusCode = 401;
                res.json(error);
            }
        }
    })
})














//Do not remove this line. This allows the test suite to start
//multiple instances of your server on different ports
module.exports = app;
