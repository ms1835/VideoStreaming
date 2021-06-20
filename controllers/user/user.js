// user controller
const bcrypt = require("bcrypt")
const {User} = require('../../models/user')

// Signup User Route
exports.signupUser = async(req,res)=>{
    try{
        // TODO Confirm Password
        const newUser={
            email: req.body.email,
            password: req.body.password,
            name: req.body.name,
            confirmPassword: req.body.confirmPassword
        }
        if(newUser.password === newUser.confirmPassword){
            console.log("Password confirmed. Proceeding.....")
        }else{
            console.log("Password not confirmed.")
            res.redirect('/error')
            return
        }
        const salt = bcrypt.genSaltSync(10)
        newUser.password = bcrypt.hashSync(newUser.password,salt)
        const user = new User(newUser)
        await user.save()
        res.redirect('/')
    }catch(err){
        console.log(err)
        if(err.code===11000){
            console.log('User Already Exists')
        }
        res.redirect('/error')
    }
}