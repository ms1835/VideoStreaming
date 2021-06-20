const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema=new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type:String,
        required:true
    },
    isAdmin:{
        type:Boolean,
        default: false
    },
    name: {
        type:String
    }
}, {timestamps: true})

userSchema.methods={
    authenticate: function (plainpassword){
        const isValidPass = bcrypt.compareSync(plainpassword,this.password)
        console.log(isValidPass)
        if(isValidPass){
            return true;
        }else{
            return false;
        }
    }
}

const User=mongoose.model('User',userSchema)
module.exports={User}