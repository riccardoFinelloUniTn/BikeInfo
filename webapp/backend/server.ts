import dotenv from "dotenv";
import express, { Express, NextFunction, Request, Response } from "express";

import { authenticateUser } from "./auth/authController";
import { signInWithGoogle } from "./auth/googleAuth";
import { registerUser } from "./auth/register";
import { tokenChecker } from "./auth/tokenChecker";
import { isLoggedIn } from "./auth/isLogged";

import { getFeedbacksByEntityId } from "./dataControllers/feedbacks/getFeedbacks";
import { postFeedback } from "./dataControllers/feedbacks/postFeedback";
import { deleteFeedback } from "./dataControllers/feedbacks/deleteFeedback";
import { patchFeedback } from "./dataControllers/feedbacks/patchFeedback";
import { patchFeedbackAnswer } from "./dataControllers/feedbacks/patchFeedbackAnswer";

import { getReviewsByEntityId } from "./dataControllers/reviews/getReviews";
import { postReview } from "./dataControllers/reviews/postReview";
import { patchReview } from "./dataControllers/reviews/patchReview";
import { deleteReview } from "./dataControllers/reviews/deleteReview";

import getOpenDataCentroInBici from "./opendata/centroInBici";
import getOpenDataParcheggioProtetto from "./opendata/parcheggioprotetto";
import getOpenDataPisteCiclabili from "./opendata/pisteciclabili";
import getOpenDataRastrelliere from "./opendata/rastrelliere";

import { fetchAndRefreshRastrelliere } from "./opendata/rastrelliere";
import { fetchAndRefreshParcheggioProtetto } from "./opendata/parcheggioprotetto";
import { fetchAndRefreshCentroInBici } from "./opendata/centroInBici";
import { fetchAndRefreshPisteCiclabili } from "./opendata/pisteciclabili";

import  getRastrelliere from "./dataControllers/data/getRastrelliere";
import getCentroInBici from "./dataControllers/data/getCentroInBici";
import getPisteCiclabili from "./dataControllers/data/getPisteCiclabili";
import getParcheggiProtetti from "./dataControllers/data/getParcheggiProtetti";

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
require("dotenv").config();

let centro_in_bici: any;
let parcheggio_protetto: any;
let bike_sharing: any;
let rastrelliere: any;
let itinerari: any;
let piste_ciclabili: any;
let ready: boolean = false;

const UPDATEFLAG:boolean = false; // SET TO TRUE BEFORE RECOMPILING TO UPDATE ALL DATABASE RECORDS

// Run the main function
async function main() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect("mongodb+srv://riccardofinello:0PgsKP2ACrYJsVSz@infobikecluster.dilv1.mongodb.net/InfoBikeDB");
    console.log("Connected to MongoDB.");

    
    if(UPDATEFLAG){
      console.log("Fetching data from external sources...");
      try {
        centro_in_bici = await getOpenDataCentroInBici;
        parcheggio_protetto = await getOpenDataParcheggioProtetto;
        rastrelliere = await getOpenDataRastrelliere;
        piste_ciclabili = await getOpenDataPisteCiclabili;
      } catch (err) {
        console.log("Error fetching data from external sources", err);
      }
      
      
        
      try {
        const data = await fs.readFile('dist/opendata/centro_in_bici.geojson', { encoding: 'utf8' });
        centro_in_bici = JSON.parse(data);
        
        await fetchAndRefreshCentroInBici(data);
        console.log("Centro in Bici data loaded from file.");
      } catch (err) {
        console.log("Error loading centro_in_bici from file:", err);
      }
    

    
      try {
        const data = await fs.readFile('dist/opendata/parcheggio_protetto_bike.geojson', { encoding: 'utf8' });
        parcheggio_protetto = JSON.parse(data);
        await fetchAndRefreshParcheggioProtetto(data);
        console.log("Parcheggio Protetto data loaded from file.");
      } catch (err) {
        console.log("Error loading parcheggio_protetto from file:", err);
      }
    

    
      try {
        const data = await fs.readFile('dist/opendata/rastrelliere.geojson', { encoding: 'utf8' });
        rastrelliere = JSON.parse(data);
        await fetchAndRefreshRastrelliere(data);
        console.log("Rastrelliere data loaded from file.");
      } catch (err) {
        console.log("Error loading rastrelliere from file:", err);
      }
    

    
      try {
        const data = await fs.readFile('dist/opendata/piste_ciclabili.geojson', { encoding: 'utf8' });
        piste_ciclabili = JSON.parse(data);
        await fetchAndRefreshPisteCiclabili(data);
        console.log("Piste Ciclabili data loaded from file.");
      } catch (err) {
        console.log("Error loading piste_ciclabili from file:", err);
      }
      

      console.log("Data fetching and processing complete.");
    }
    

    // Start the server after all initialization is complete
    ready = true;
  } catch (err) {
    console.error("Error during initialization:", err);
    process.exit(1); // Exit with error code if something goes wrong
  }
}

main()
  .then(() => {
    console.log("Starting the Express server...");
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Error during initialization:", err);
    process.exit(1); // Exit with error code if there's an issue
  });

// Express route definitions
app.post("/auth", authenticateUser);
app.post("/auth/google", signInWithGoogle);
app.post("/register/google", signInWithGoogle);
app.post("/register", registerUser);
app.get("/islogged", isLoggedIn);

app.get("/feedbacks/:eid", tokenChecker, getFeedbacksByEntityId);
app.post("/feedbacks/:eid", tokenChecker, postFeedback);
app.delete("/feedbacks/", tokenChecker, deleteFeedback);
app.patch("/feedbacks/:fid", tokenChecker, patchFeedback);

app.patch("/feedbacks/:fid/answer", tokenChecker, patchFeedbackAnswer);       //admin adding (or updating) their answer

app.get("/reviews/:eid", getReviewsByEntityId);
app.post("/reviews/:eid", tokenChecker, postReview);
app.patch("/reviews/:eid", tokenChecker, patchReview);
app.delete("/reviews/:eid", tokenChecker, deleteReview);

app.get("/rastrelliere", getRastrelliere);
app.get("/pisteCiclabili", getPisteCiclabili);
app.get("/centroInBici", getCentroInBici);
app.get("/parcheggiProtetti",getParcheggiProtetti);


