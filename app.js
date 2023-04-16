const express = require('express');
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
    const id = req.params.id;
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
                res.json({userId: content.user.id});
            } else {
                error = {"error": "Password is incorrect."};
                res.statusCode = 401;
                res.json(error);
            }
        }
    })
})

app.post("/users/signup", (req, res)=>{
    un = req.body.username;
    pw = req.body.password;
    fs.readFile(users, (err, content) => {
        if(err) return err;
        content = JSON.parse(content.toString());
        check = {user: content.filter(u => u.username == un)[0]};
        if(check.user) {
            let error = {error: "Username " + un + " already exist."};
            res.statusCode = 409;
            res.json(error);
        } else {
            let newUser = {
                username: un, 
                   password: pw,
                   id: null,
                   courses: []
                };
                
                nId = content.length + 1;
                newUser.id = nId;
                content[nId - 1] = newUser;
                fs.writeFile(users, JSON.stringify(content,null,4), (err) =>{
                    if(err) return err;
                });
        res.statusCode = 201;
        res.json({userId: newUser.id});
    }
})

})

app.patch("/account/:id/courses/add", (req,res)=>{
    const co = req.body;
    const id = req.params.id;
    fs.readFile(courses, (err1, cList)=>{
        if(err1) return err1;
        cList = JSON.parse(cList.toString());
        check = cList.filter(c => c.code == co.code
            && c.num == co.num
            && c.name == co.name
            && c.credits == co.credits
            && c.description == co.description)
            if(check.length <= 0){
                res.statusCode = 400;
                res.json({"error":"course not found."});
                return;
            }
        fs.readFile(users, (err2, content) => {
            if(err2) return err2;
            content = JSON.parse(content.toString());
            user = content.filter(u => u.id == id)[0];
            if(!user) {
                res.statusCode = 401;
                res.json({"error":"Invalid user id."});
                return;
            } else if(user.courses.filter(c => c.code == co.code && c.num == co.num).length != 0) {
                res.statusCode = 409;
                res.json({"error":"Course already exists."});
                return;
            } else {
                user.courses[user.courses.length] = co;
                content[id - 1] = user;
                fs.writeFile(users, JSON.stringify(content,null,4), (err) =>{
                    if(err) return err;
                    res.statusCode = 201;
                    res.json(user);
                    return;
                });            
            }
        })
    })
})

app.patch("/account/:id/courses/remove", (req,res)=>{
    const co = req.body;
    const id = req.params.id;
    fs.readFile(courses, (err1, cList)=>{
        if(err1) return err1;
        cList = JSON.parse(cList.toString());
        check = cList.filter(c => c.code == co.code
            && c.num == co.num
            && c.name == co.name
            && c.credits == co.credits
            && c.description == co.description)
            if(check.length <= 0){
                res.statusCode = 400;
                res.json({"error":"course not found."});
                return;
            }
        fs.readFile(users, (err2, content) => {
            if(err2) return err2;
            content = JSON.parse(content.toString());
            user = content.filter(u => u.id == id)[0];
            if(!user) {
                res.statusCode = 401;
                res.json({"error":"Invalid user id."});
                return;
            } else if(user.courses.filter(c => c.code == co.code && c.num == co.num).length == 0) {
                res.statusCode = 409;
                res.json({"error":"Course doesn't exist."});
                return;
            } else {
                let index = user.courses.findIndex(c => c.code == co.code && c.num == co.num);
                console.log(index);
                console.log(user.courses);
                
                user.courses.splice(index, 1);
                
                console.log(user.courses);
                content[id - 1] = user;
                
                fs.writeFile(users, JSON.stringify(content,null,4), (err) =>{
                    if(err) return err;
                    res.statusCode = 200;
                    res.json(user);
                    return;
                });
            }
        })
    })
})

//Do not remove this line. This allows the test suite to start
//multiple instances of your server on different ports
module.exports = app;
