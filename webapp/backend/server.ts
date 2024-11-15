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

// const kittySchema = new mongoose.Schema({
//   name: String,
// });

// const Kitten = mongoose.model("Kitten", kittySchema);

// const silence = new Kitten({ name: "Silence 5" });
// console.log(silence.name); // 'Silence'

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World! Correct File");
});

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});


app.get(
  "/reviews/:eid",
  (async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { eid } = req.params;

      // Check if the entity ID is provided
      if (!eid) {
        return res.status(400).json({
          success: false,
          message: "Entity ID is required.",
        });
      }

      // Fetch all reviews related to the given entity ID
      const reviews = await reviewModel.find({ entityId: eid }).exec();

      // If no reviews found, respond accordingly
      if (reviews.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No reviews found for the given entity.",
        });
      }

      // Respond with the found reviews
      return res.status(200).json({
        success: true,
        reviews: reviews,
      });
    } catch (error) {
      console.error("Error fetching reviews:", error);
      next(error); // Passing the error to Express’s error handler
    }
  }) as express.RequestHandler
);

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