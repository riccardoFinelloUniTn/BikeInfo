import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import userModel from "./model/user.model";
import getCentroInBici from "./opendata/centroInBici";
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const jwt = require("jsonwebtoken");
require("dotenv").config();

const mongoose = require("mongoose");
main().catch((err) => console.log(err));

require("dotenv").config();

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/test");
  let centro_in_bici = await getCentroInBici;
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const kittySchema = new mongoose.Schema({
  name: String,
});

const Kitten = mongoose.model("Kitten", kittySchema);

const silence = new Kitten({ name: "Silence 5" });
console.log(silence.name); // 'Silence'

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});

app.get("/auth", async function (req: Request, res: Response) {
  //TODO password criptate con hash e salt con pbkdf2

  console.log(req.body);
  if (req.body == null) {
    res.status(400).json({
      success: false,
      message: "Authentication failed. Body not found.",
    });
    return;
  }
  if (req.body.email == null || req.body.password == null) {
    res.status(400).json({
      success: false,
      message: "Authentication failed. Password or email not found.",
    });
    res.sendStatus(400);
    return;
  }
  console.log("after check");
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
  if (user.password != req.body.password) {
    res.json({
      success: false,
      message: "Authentication failed. Wrong password.",
    });
    return;
  }

  // if user is found and password is right create a token
  var token = jwt.sign({ email: user.email }, process.env.SUPER_SECRET, {
    expiresIn: 86400,
  });

  res.status(200).json({
    success: true,
    message: "Enjoy your token!",
    token: token,
  });
});






