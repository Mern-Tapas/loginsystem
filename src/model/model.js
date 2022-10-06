const mongoose = require("mongoose");
// const unique = require("mongoose-unique-validator")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const dataset = new mongoose.Schema({
        firstName: { type: 'string', required: true },
        lastName: "string",
        email: { type: "string", index: true, index: true, unique: true, },
        password: "string",
        Cpassword: "string",
        tokens: [{
                token: { type: String, required: true }
        }]

});

dataset.pre("save", async function (next) {
        if (this.isModified('password')) {
                this.password = await bcrypt.hash(this.password, 10)
                next()
                console.log(this.password)
        } else {
                console.log('password is not modified')
        }
});

dataset.methods.generateTokens = async function () {
        try {
                const token = jwt.sign({_id:this._id.toString()},process.env.KEY)
                this.tokens = this.tokens.concat({token})
                // this.save()
                return token

        } catch (error) {
                console.log(`token not generate this is the ${error}`)
        }
}



const model = new mongoose.model("userdata", dataset);


module.exports = model