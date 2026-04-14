import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'; // library to hash passwords.

const userSchema=new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    isAdmin:{
        type: Boolean,
        default: false
    },
    name: {
        type: String
    },
    subscribersCount: {
        type: Number,
        default: 0
    },
    subscribedToCount: {
        type: Number,
        default: 0
    }

}, {timestamps: true});

userSchema.methods={
    authenticate: function (plainpassword){
        const isValidPass = bcrypt.compareSync(plainpassword,this.password);
        console.log("Password matched: ", isValidPass);
        if(isValidPass){
            return true;
        }
        else{
            return false;
        }
    }
}

export const User = mongoose.model('User',userSchema);
