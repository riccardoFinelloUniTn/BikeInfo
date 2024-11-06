import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";

dotenv.config();

const app :Express = express();
const port = process.env.PORT || 3000;

const mongoose = require("mongoose");
main().catch((err) => console.log(err));

require("dotenv").config();

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/test");

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const kittySchema = new mongoose.Schema({
  name: String,
});

const Kitten = mongoose.model("Kitten", kittySchema);

const silence = new Kitten({ name: "Silence" });
console.log(silence.name); // 'Silence'

app.get("/", ( req: Request, res: Response) => {

  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
