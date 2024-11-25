const https = require("https"); // or 'https' for https:// URLs
const fs = require("fs");
const geojson = require("geojson");
const decompress = require("decompress");
import { Response } from "express";
import mongoose from "mongoose";
import entityModel from "../model/entity.model";

const file = fs.createWriteStream("dist/opendata/centroinbici.zip");


async function getCentroInBici() {
  return new Promise((resolve :Function, reject : Function) => {
    https.get(
      "https://gis.comune.trento.it/dbexport?db=base&sc=mobilita&ly=centro_in_bici&fr=geojson",
      function (response: Response) {
        response.pipe(file);
        file.on("finish", () => {
          file.close();
          console.log("Download Completed");
          console.log("Starting decompression");
          decompress(
            "dist/opendata/centroinbici.zip",
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

export const adaptJsonToCentroInBici = async (jsonData: string): Promise<void> => {
  try {
    const data = JSON.parse(jsonData);

    if (!data.features || !Array.isArray(data.features)) {
      throw new Error("Invalid JSON format: 'features' array missing.");
    }

    const entities = data.features.map((feature: any) => {
      const { fumetto, desc, cicloposteggi } = feature.properties;
      const { coordinates } = feature.geometry;

      if (!fumetto || !desc || !cicloposteggi || !coordinates) {
        throw new Error("Invalid JSON structure: Missing required fields.");
      }

      return {
        eid: new mongoose.Types.ObjectId().toString(), // Generate a unique ID
        name: fumetto,
        description: `${desc} - ${cicloposteggi} posteggi`, // Combine description and posteggi info
        geolocation: JSON.stringify(coordinates), // Store as stringified JSON
        type: "centroInBici",
        rating: 0, // Default rating
        reviews: [], // Default empty array
        feedbacks: [], // Default empty array
      };
    });

    // Insert all entities into the database
    await entityModel.insertMany(entities);
    console.log("C'entro in Bici entities successfully inserted.");
  } catch (error) {
    console.error("Error adapting JSON to Entity schema:", error);
  }
};
    
export default getCentroInBici();


