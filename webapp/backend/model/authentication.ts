import express, {Express} from "express";
import userModel from "./user.model";

//TODO password criptate con hash e salt con pbkdf2
const app :Express = express();
const jwt  = require("jsonwebtoken");

app.post('/api/v1/authentications', async function(req, res) {
	
	// find the user
	let user = await userModel.findOne({ email: req.body.email }).exec();
	
	// user not found
	if (!user){
        res.json({ success: false, message: 'Authentication failed. User not found.' });
        return;
    }
       
	
	// check if password matches
	if (user.password != req.body.password)
		res.json({ success: false, message: 'Authentication failed. Wrong password.' });
	
	// if user is found and password is right create a token
	var token = jwt.sign({ email: user.email }, process.env.SUPER_SECRET, { expiresIn: 86400 });

	res.json({
		success: true,
		message: 'Enjoy your token!',
		token: token
	});

});
 