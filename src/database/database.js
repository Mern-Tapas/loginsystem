const mongoose = require("mongoose");

mongoose.connect(process.env.DB).then(()=>{console.log("connected with database")}).catch(()=>{"not connected"})