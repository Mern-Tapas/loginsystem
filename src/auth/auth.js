const model = require('../model/model');
const jwt = require("jsonwebtoken");

const auth = async (req,res, next)=>{
    try {
        const token = req.cookies.jwt
        const verify = jwt.verify(token, process.env.KEY)
        
        console.log(verify)
        const user = await model.findOne({_id:verify._id})
        
     
        
        req.senduser = user
        req.sendtoken = token
        next()
    } catch (error) {
        console.log(error)
        res.send(error)
    }

}

module.exports = auth