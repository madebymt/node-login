const express = require("express")
const app = express()
const mustache = require("mustache-express")
const bodyParser = require("body-parser")
// const url = require("url")
const users = require("./data")
const session = require("express-session")
app.engine("mustache", mustache())
app.set("view engine", "mustache")
app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: false }))

//the magic express-session turn password to special key
let key = {
    secret:"rubysecretkey",
    cookie:{},
    saveUninitialized: true,
    resave:true
}
app.use(session(key))

//if they haven't sign in, send they to login
app.get("/", function (req, res,next){
//if it's login keep them in home page, if not send to login
    if (req.session.authorized === true){
        res.redirect("/index")
    } else {
    req.session.authorized === false
    res.render("login")
    }
})

//log in page show
app.get("/login", function (req , res) {
    res.render("login")
})

// make the form submit action happen here
app.post("/authorization", function(req, res){
 const username = req.body.username
 const password = req.body.password

// check the users array see the login info match
let user
 for (let i = 0 ; i < users.length; i++) {
// check the login info is correct or not
     if (users[i].username === username && users[i].password === password) {
// if the the username and password is match, add to the user array
       user = users[i]
     }
 }
 // if it match to our user member, give the authorized
 // to the success page
 if (user) {
     req.session.user = user
     req.session.authorized = true
     res.redirect("/index")
 } else {
// if  it's not member, send them to login page to try again
     res.render("login" ,{
         message: "Hey go log in"
     })
 }
})

app.use (function (req, res, next) {
//request user = res.session.user
    req.user = req.session.user
    next()
})

app.get("/index", function(req, res) {
// set a viable to storage the req.user info, and show the user info
    const user = req.user
    res.render("index",{
        user:user
    })
})


//node.js pattern (must have)
app.listen(3000, function() {
  console.log("Hello node.js")
})
