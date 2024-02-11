import mongoose from 'mongoose';
import bcrypt from 'bcrypt'; // library to hash passwords.

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
}, {timestamps: true});

userSchema.methods={
    authenticate: function (plainpassword){
        const isValidPass = bcrypt.compareSync(plainpassword,this.password);
        console.log(isValidPass);
        if(isValidPass){
            return true;
        }
        else{
            return false;
        }
    }
}

export const User = mongoose.model('User',userSchema);
