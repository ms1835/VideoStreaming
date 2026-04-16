// user controller
import bcrypt from "bcryptjs";
import { User } from '../../models/User.js';
import { Subscription } from '../../models/Subscription.js';

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

        if(!subscriber || !channelId){
            return res.status(400).json({
                success: false,
                message: "Missing subscriber or channel ID"
            });
        }
        if(subscriber === channelId){
            return res.status(400).json({
                success: false,
                message: "You cannot subscribe to your own channel"
            });
        }

        const channelDetails = await User.findById(channelId);
        const userDetails = await User.findById(subscriber);

        if(!channelDetails || !userDetails){
            return res.status(404).json({
                success: false,
                message: "Channel or subscriber not found"
            })
        }

        const existingSubscription = await Subscription.findOne({
            subscriber,
            subscribedTo: channelId
        });

        let isSubscribed;
        if(existingSubscription){
            await existingSubscription.deleteOne();
            isSubscribed = false;
        } else {
            await Subscription.create({
                subscriber,
                subscribedTo: channelId
            });
            isSubscribed = true;
        }

        const subscribersCount = await Subscription.countDocuments({ subscribedTo: channelId });
        const subscribedToCount = await Subscription.countDocuments({ subscriber });

        channelDetails.subscribersCount = subscribersCount;
        userDetails.subscribedToCount = subscribedToCount;

        await channelDetails.save();
        await userDetails.save();

        res.json({
            success: true,
            message: isSubscribed ? "Subscribed Successfully" : "Unsubscribed Successfully",
            isSubscribed,
            subscribersCount,
            subscribedToCount
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

export const subscriptionStatus = async(req,res) => {
    try {
        const subscriber = req.query.userID;
        const channelId = req.query.channelID;

        if(!subscriber || !channelId){
            return res.status(400).json({
                success: false,
                message: "Missing userID or channelID"
            });
        }

        const existingSubscription = await Subscription.exists({
            subscriber,
            subscribedTo: channelId
        });

        res.json({
            success: true,
            isSubscribed: Boolean(existingSubscription)
        });
    } catch(err) {
        console.log(err);
        res.json({
            success: false,
            message: err?.message
        });
    }
}