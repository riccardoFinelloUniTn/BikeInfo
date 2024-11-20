import dotenv from "dotenv";
import express, { Express, NextFunction, Request, Response } from "express";
import { registerUser } from "./auth/register";
import reviewModel from "./model/review.model";
import userModel from "./model/user.model";
import getCentroInBici from "./opendata/centroInBici";
import getItinerari from "./opendata/itinerari";
import getParcheggioProtetto from "./opendata/parcheggioprotetto";
import getRastrelliere from "./opendata/rastrelliere";
import { authenticateUser } from "./auth/authController";
import { getReviewsByEntityId } from "./dataControllers/getReviews";
import { getFeedbacksByEntityId } from "./dataControllers/getFeedbacks";
import { tokenChecker } from "./auth/tokenChecker";
import { postFeedback } from "./dataControllers/postFeedback";


dotenv.config();



const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const jwt = require("jsonwebtoken");
require("dotenv").config();

const mongoose = require("mongoose");
main().catch((err) => console.log(err));

require("dotenv").config();

let centro_in_bici: any;
let parcheggio_protetto: any;
let bike_sharing: any;
let rastrelliere: any;
let itinerari: any;
let piste_ciclabili: any;
let ready: boolean = false;

async function main() {
  await mongoose.connect("mongodb+srv://riccardofinello:0PgsKP2ACrYJsVSz@infobikecluster.dilv1.mongodb.net/InfoBikeDB");
  centro_in_bici = await getCentroInBici;
  parcheggio_protetto = await getParcheggioProtetto;
  //bike_sharing = await getBikeSharing; TODO il server non risponde
  rastrelliere = await getRastrelliere;
  itinerari = await getItinerari;
  // piste_ciclabili = await getPisteCiclabili; TODO controllare perche non vi è nessun file
  console.log(centro_in_bici);
  console.log(parcheggio_protetto);
  console.log(bike_sharing);
  console.log(rastrelliere);
  console.log(itinerari);
  console.log(piste_ciclabili);
  ready = true;
}


app.get("/", (req: Request, res: Response) => {
  res.send("Hello World! Correct File");
});

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});


app.get("/reviews/:eid", getReviewsByEntityId);

app.get("/rastrelliere", async function (req: Request, res: Response) {
  if (ready) {
    res.json(JSON.stringify(rastrelliere));
  }
  else {
    res.sendStatus(500);
  }
})


app.get("/parcheggioprotetto", async function (req: Request, res: Response) {
  if (ready) {
    res.json(JSON.stringify(parcheggio_protetto));
  }
  else {
    res.sendStatus(500);
  }
})


app.get("/itinerari", async function (req: Request, res: Response) {
  if (ready) {
    res.json(JSON.stringify(itinerari));
  }
  else {
    res.sendStatus(500);
  }
})


app.get("/centroinbici", async function (req: Request, res: Response) {
  if (ready) {
    res.json(JSON.stringify(centro_in_bici));
  }
  else {
    res.sendStatus(500);
  }
})


app.get("/bikesharing", async function (req: Request, res: Response) {
  if (ready) {
    res.json(JSON.stringify(bike_sharing));
  }
  else {
    res.sendStatus(500);
  }
})



app.post("/auth", authenticateUser);

app.post("/register", registerUser);

app.get("/feedbacks/:eid", tokenChecker, getFeedbacksByEntityId);

app.post("/feedbacks/:eid", tokenChecker, postFeedback);