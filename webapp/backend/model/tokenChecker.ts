import express, { Express, NextFunction, Request, Response } from "express";

//TODO password criptate con hash e salt con pbkdf2
const app :Express = express();
const jwt  = require("jsonwebtoken");
require('dotenv').config();


const tokenChecker = function(req : Request, res :Response, next : NextFunction) {
	if(!req ){
        return;
    }
   
	// check header or url parameters or post parameters for token
	var token =  req.headers["authorization"];

	// if there is no token
	if (!token) {
		return res.status(401).send({ 
			success: false,
			message: 'No token provided.'
		});
	}

	// decode token, verifies secret and checks exp
	jwt.verify(token, process.env.SUPER_SECRET, function(err : Error, decoded : string) {			
		if (err) {
			return res.status(403).send({
				success: false,
				message: 'Failed to authenticate token.'
			});		
		} else {
			// if everything is good, save to request for use in other routes
			req.headers["loggedUser"] = decoded;
			next();
		}
	});
	
};

module.exports = tokenChecker