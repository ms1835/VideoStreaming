import { User } from '../../models/user.js';

export const renderLoginForm = async(req,res) => {
    try {
        res.render('login');
    }
    catch(err) {
        console.log(err);
    }
}

export const loginUser = async (req,res) => {
    try {
        const foundUser=await User.findOne({email: req.body.email})
        if((!foundUser) || !(foundUser.authenticate(req.body.password))){
            console.log('Invalid password or user doesn\'t exist.');
            // res.redirect('/error');
            res.json({
                success: false,
                message: "Invalid password or user doesn\'t exist."
            })
        }
        else{
            console.log('You are logged in');
            // Establish a session
            req.session.isLoggedIn = true;
            req.session.user = foundUser;
            req.flash("success","You are logged in");
            // res.redirect('/');
            res.json({
                success: true,
                message: "Logged In Successfully",
                data: foundUser 
            })
            
        }
    }
    catch(err){
        console.log(err);
        // res.redirect('/error');
    }
}

export const logout = async(req,res) => {
    if(req.session){
        req.session = null;
        res.redirect('/');
        // req.session.destroy((err)=>{
        //     if(err){
        //         console.log(err)
        //         res.redirect('/error')
        //     }else{
        //         req.session = null
        //         res.redirect('/')
        //     }
        // })
    }
    else{
        res.redirect('/error');
    }
}

export const renderSignUpPage = async(req,res) => {
    try{
        res.render('signup');
    }catch(err){
        console.log(err);
    }
}
