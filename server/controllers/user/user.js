// user controller
import bcrypt from "bcryptjs";
import { User } from '../../models/user.js';

// Signup User Route
export const signupUser = async(req,res) => {
    try{
        // TODO Confirm Password
        const newUser={
            email: req.body.email,
            password: req.body.password,
            name: req.body.name,
            confirmPassword: req.body.confirmPassword
        }
        if(newUser.password === newUser.confirmPassword){
            console.log("Password confirmed. Proceeding.....");
        }
        else{
            console.log("Password not confirmed.");
            // res.redirect('/error');
            return;
        }
        const salt = bcrypt.genSaltSync(10);
        newUser.password = bcrypt.hashSync(newUser.password,salt);
        const user = new User(newUser);
        await user.save();
        // req.session.user = user;
        // req.session.isLoggedIn = true;
        // res.redirect('/');
        res.json({
            success: true,
            message: "Channel created successfully",
            data: user
        })
    }
    catch(err) {
        console.log(err);
        if(err.code===11000){
            console.log('User Already Exists');
        }
        // res.redirect('/error');
        res.json({
            success: false,
            message: `User already exists`
        })
    }
}

export const subscribe = async(req,res) => {
    try {
        const subscriber = req?.body?.user;
        const channelId = req?.body?.channelID;
        const channelDetails = await User.findById(channelId);
        const userDetails = await User.findById(subscriber);

        console.log("subscriber: ", subscriber);
        console.log("channelID: ", channelId);
        console.log("channelDetails", channelDetails);
        console.log("userDetails", userDetails);
        if(!channelDetails || !userDetails){
            return res.status(404).json({
                success: false,
                message: "Channel or subscriber not found"
            })
        }

        let isSubscribed = false;
        if(channelDetails?.subscribers){
            for(const user of channelDetails?.subscribers) {
                if(user.id === subscriber)
                    isSubscribed = true;
            }
        }
        isSubscribed ? 
        (
            channelDetails.subscribers = channelDetails?.subscribers?.filter(user => user.id !== subscriber),
            userDetails.subscribedTo = userDetails?.subscribedTo?.filter(user => user.id !== channelId)

        ) : 
        (
            channelDetails?.subscribers.push({id: subscriber}),
            userDetails?.subscribedTo.push({id: channelId})
        )
        await channelDetails.save();
        await userDetails.save();
        res.json({
            success: true,
            message: isSubscribed ? "Unsubscribed Successfully" : "Subscribed Successfully"
        })
    }
    catch(err) {
        console.log(err);
        res.json({
            success: false,
            message: err?.message
        })
    }
}