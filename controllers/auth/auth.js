const {User} = require('../../models/user')
const renderLoginForm=async(req,res)=>{
    try{
        res.render('login')
    }catch(err){
        console.log(err)
    }
}

const loginUser = async (req,res)=>{
    try{
        console.log(req.body)
        const foundUser=await User.findOne({email: req.body.email})
        if((!foundUser)||!(foundUser.authenticate(req.body.password))){
            console.log('Invalid password or user doesn\'t.')
        }else{
            console.log('You are logged in')
        }
        res.redirect('/')
    }catch(err){
        console.log(err)
        res.redirect('/error')
    }
}
module.exports={renderLoginForm,loginUser}