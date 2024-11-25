import dotenv from "dotenv";
import express, { Express, NextFunction, Request, Response } from "express";
import { authenticateUser } from "./auth/authController";
import { signInWithGoogle } from "./auth/googleAuth";
import { registerUser } from "./auth/register";
import { tokenChecker } from "./auth/tokenChecker";
import { getFeedbacksByEntityId } from "./dataControllers/getFeedbacks";
import { getReviewsByEntityId } from "./dataControllers/getReviews";
import { postFeedback } from "./dataControllers/postFeedback";
//import getBikeSharing from "./opendata/bikeSharing"; //non va la parte di weelo 
import getCentroInBici from "./opendata/centroInBici";
import getParcheggioProtetto from "./opendata/parcheggioprotetto";
import getPisteCiclabili from "./opendata/pisteciclabili";
import getRastrelliere from "./opendata/rastrelliere";
const fs = require('node:fs/promises');

dotenv.config();



const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "*");
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
   try{
    centro_in_bici = await getCentroInBici;
    parcheggio_protetto = await getParcheggioProtetto;
   // bike_sharing = await getBikeSharing;// TODO il server non risponde
    rastrelliere = await getRastrelliere;
    piste_ciclabili = await getPisteCiclabili;// TODO controllare perche non vi è nessun file
  } catch (err) {
    
    try {
      const data = await fs.readFile('dist/opendata/piste_ciclabili.geojson', { encoding: 'utf8' });
      piste_ciclabili = JSON.parse(data);
      console.log(data);
    } catch (err) {
      console.log(err);
    }
    try {
      const data = await fs.readFile('dist/opendata/parcheggio_protetto_bike.geojson', { encoding: 'utf8' });
      parcheggio_protetto = JSON.parse(data);
      console.log(data);
    } catch (err) {
      console.log(err);
    }
    try {
      const data = await fs.readFile('dist/opendata/rastrelliere.geojson', { encoding: 'utf8' });
      rastrelliere = JSON.parse(data);
      console.log(data);
    } catch (err) {
      console.log(err);
    }
    try {
      const data = await fs.readFile('dist/opendata/centro_in_bici.geojson', { encoding: 'utf8' });
      centro_in_bici = JSON.parse(data);
      console.log(data);
    } catch (err) {
      console.log(err);
    }
    console.log(err);
    // try {
    //   const data = await fs.readFile('dist/opendata/bikeSharing.geojson', { encoding: 'utf8' });
    //   bike_sharing = JSON.parse(data);
    //   console.log(data);
    // } catch (err) {
    //   console.log(err);
    // }
  }
 
  // console.log(centro_in_bici);
  // console.log(parcheggio_protetto);
  // console.log(bike_sharing);
  // console.log(rastrelliere);
  // console.log(itinerari);
  // console.log(piste_ciclabili);
  ready = true;
}


app.get("/google/callback", tokenChecker , (req: Request, res: Response) => {

  res.send("Hello google login");
});

app.get("/", (req: Request, res: Response) => {
  res.sendFile("testpage.html", { root: __dirname });
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


app.get("/pisteciclabili", async function (req: Request, res: Response) {
  if (ready) {
    res.json(JSON.stringify(piste_ciclabili));
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

app.post("/auth/google", signInWithGoogle);

app.post("/register/google", signInWithGoogle);

app.post("/register", registerUser);

app.get("/feedbacks/:eid", tokenChecker, getFeedbacksByEntityId);

app.post("/feedbacks/:eid", tokenChecker, postFeedback);