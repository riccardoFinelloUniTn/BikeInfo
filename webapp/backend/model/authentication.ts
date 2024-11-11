import express, { Express, NextFunction, Request, Response } from "express";
import userModel from "./user.model";

//TODO password criptate con hash e salt con pbkdf2
const app: Express = express();
const jwt = require("jsonwebtoken");

app.post(
  "/api/v1/authentications",
  async function (req: Request, res: Response) {
    // find the user
    let user = await userModel.findOne({ email: req.body.email }).exec();

    // user not found
    if (!user) {
      res.json({
        success: false,
        message: "Authentication failed. User not found.",
      });
      return;
    }

    // check if password matches
    if (user.password != req.body.password) //TODO salt e hash
      res.json({
        success: false,
        message: "Authentication failed. Wrong password.",
      });

    // if user is found and password is right create a token
    var token = jwt.sign({ email: user.email }, process.env.SUPER_SECRET, {
      expiresIn: 86400,
    });

    res.status(200).json({
      success: true,
      message: "Enjoy your token!",
      token: token,
    });
  },
);

const tokenChecker = function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!req) {
    return;
  }

  // check header or url parameters or post parameters for token
  var token = req.headers["authorization"];

  // if there is no token
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token provided.",
    });
  }

  // decode token, verifies secret and checks exp
  jwt.verify(
    token,
    process.env.SUPER_SECRET,
    function (err: Error, decoded: string) {
      if (err) {
        return res.status(403).json({
          success: false,
          message: "Failed to authenticate token.",
        });
      } else {
        // if everything is good, save to request for use in other routes
        req.body.email = decoded;
        next();
      }
    },
  );
};

module.exports = tokenChecker;
