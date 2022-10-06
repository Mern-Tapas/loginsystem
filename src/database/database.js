const mongoose = require("mongoose");

const db = "mongodb+srv://tapas_0:yamahavb5850@cluster0.adudr.mongodb.net/?retryWrites=true&w=majority"

mongoose.connect("mongodb://localhost:27017/rdata").then(()=>{console.log("connected with database")}).catch(()=>{"not connected"})
// mongoose.connect(db).then(()=>{console.log("connected")}).catch(()=>{"not connected"})