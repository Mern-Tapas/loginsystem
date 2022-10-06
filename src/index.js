require('dotenv').config()
const express = require("express");
require("./database/database");
const port = process.env.PORT;
const app = express();
const hbs = require("hbs");
const path = require("path");
const model = require("./model/model");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser")
const auth = require('./auth/auth')

// create path
const partials = path.join(__dirname, "../template/partials")
const tamplate = path.join(__dirname, "../template")
// create path

//set hbs view engin
app.set("view engine", "hbs");
app.set("views", tamplate);
hbs.registerPartials(partials);
//set hbs view engin

//express use
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//express use

//getting pages
app.get("/", (req, res) => { res.render("home") })
app.get("/register", (req, res) => { res.render("register", { title: "Register" }) })
app.get("/login", (req, res) => { res.render("login", { title: "Login" }) })




app.get("/update", auth, async (req, res) => {
    res.render("edit")
})

app.get("/logout", auth, async (req, res) => {
    try {

        req.senduser.tokens = req.senduser.tokens.filter((element) => {
            return element.token !== req.sendtoken
        })
        // res.clearCookie("jwt");
        res.send("successfull logout")
        req.senduser.save()
    } catch (error) {
        console.log(error)
    }
})

app.get("/logoutall", auth, async (req, res) => {
    try {
        req.senduser.tokens = []
        // res.clearCookie("jwt")
        req.senduser.save()
        res.send("all logut")
    } catch (error) {

    }
})

app.get("/accountinfo", auth, async (req, res) => {
    res.send(req.senduser)
})
app.get("/*", (req, res) => { res.render("404") })
//getting pages


// user registeration data

app.post("/register", async (req, res) => {
    if (req.body.password == req.body.Cpassword) {
        try {
            const data = new model({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: req.body.password,
                Cpassword: req.body.Cpassword,
            })
            const saveResponse = await data.save();
            const token = await data.generateTokens();
            console.log(token)
            res.cookie("jwt", token)
            res.render("dashboard")

        } catch (error) {
            console.log(`data not save into database ${error}`)
            res.render("register", { err: "Email is already registered" })
        }

    } else {
        console.log(`password don't match`)
    }
})

// user registeration data

//login response

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body


        const data = await model.findOne({ email })
        if (email == data.email) {
            //compare the password
            const passwordIsValid = await bcrypt.compare(password, data.password)
            if (passwordIsValid) {
                console.log(passwordIsValid)
                console.log(password)
                const token = await data.generateTokens()
                res.cookie("jwt", token)
                res.render("dashboard",{data:data,link:"/"+data._id})
            } else {
                res.send("password not match")
            }
        } else {
            res.render("email not match with database")
        }

        
        
    } catch (error) {
        console.log(`not login properli / or email not found ${error}`)
        res.render("login", { error: "email not registerd" })
    }
    
})
//login response


app.get("/:id",auth,(req,res)=>{

    console.log(req.params.id)
})


app.listen(port, () => { console.log(`connected to the port ${port}`) })