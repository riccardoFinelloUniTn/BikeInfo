
import crypto from "crypto";
const https = require("https"); // or 'https' for https:// URLs
const fs = require("fs");
const geojson = require("geojson");
const decompress = require("decompress");
import { Response } from "express";
import mongoose from "mongoose";
import entityModel from "../model/entity.model";
import reviewModel from "../model/review.model";

const file = fs.createWriteStream("dist/opendata/parcheggioprotetto.zip");


async function getOpenDataParcheggioProtetto() {
  return new Promise((resolve :Function, reject : Function) => {
    https.get(
      "https://gis.comune.trento.it/dbexport?db=base&sc=mobilita&ly=parcheggio_protetto_bike&fr=geojson",
      function (response: Response) {
        response.pipe(file);
        file.on("finish", () => {
          file.close();
          console.log("Download Completed");
          console.log("Starting decompression");
          decompress(
            "dist/opendata/parcheggioprotetto.zip",
            "dist/opendata"
          )
            .then((files: any[]) => {
              console.log("Decompression completed");
              let data: string = files[0].data.toString();
              let centro_in_bici = JSON.parse(data);
              resolve(centro_in_bici);
            })
            .catch((error: Error) => {
              console.log(error);
              reject(error);
            });
        });
      }
    );
  });
}
    

interface GeoJSONFeature {
  properties: {
    zona: string;
    tipologia: string;
  };
  geometry: {
    coordinates: any; // Specify a more accurate type if known
  };
}

export const fetchAndRefreshParcheggioProtetto = async (jsonData: string): Promise<void> => {
  try {
    const data = JSON.parse(jsonData);

    if (!data.features || !Array.isArray(data.features)) {
      throw new Error("Invalid JSON format: 'features' array missing.");
    }

    const operations = await Promise.all(
      data.features.map(async (feature: any) => {
        const { fumetto, park, posti } = feature.properties;
        const { coordinates } = feature.geometry;
    
        console.log(fumetto + " /// " + park + " /// " + posti)
        if (!fumetto || !park || !posti || !coordinates) {
          
          console.log("Invalid parcheggio protetto feature:", feature);
          return null;
        }
    
        const eid = crypto.createHash("md5").update(JSON.stringify(coordinates)).digest("hex");
    
        const reviewsData = await reviewModel.find({ entityId: eid });
        const totalReviews = reviewsData.length;
        const averageRating = totalReviews > 0 
          ? reviewsData.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
          : 0;
    
        return {
          updateOne: {
            filter: { eid }, // Match by hashed `eid`
            update: {
              eid,
              name: park,
              description: `Cicloposteggi: ${posti}`,
              geolocation: coordinates,
              type: "parcheggioProtetto",
              rating: averageRating,
              reviews: totalReviews
            },
            upsert: true, // Insert if not found
          },
        };
      })
    );
    
    // Filter out any null values from failed operations
    const filteredOperations = operations.filter((op): op is Exclude<typeof op, null> => op !== null);
    
    if (filteredOperations.length > 0) {
      await entityModel.bulkWrite(filteredOperations);
      console.log("Centro in Bici data successfully inserted/updated.");
    } else {
      console.log("No valid Centro in Bici features to process.");
    }
  } catch (error) {
    console.error("Error refreshing Parcheggio Protetto:", error);
  }
};

export default getOpenDataParcheggioProtetto();