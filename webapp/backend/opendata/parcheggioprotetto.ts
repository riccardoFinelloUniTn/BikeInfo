

const https = require("https"); // or 'https' for https:// URLs
const fs = require("fs");
const geojson = require("geojson");
const decompress = require("decompress");
import { Response } from "express";
import mongoose from "mongoose";
import entityModel from "../model/entity.model";

const file = fs.createWriteStream("dist/opendata/parcheggioprotetto.zip");


async function getParcheggioProtetto() {
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
    



export const adaptJsonToProtectedParking = async (jsonData: string): Promise<void> => {
  try {
    const data = JSON.parse(jsonData);

    if (!data.features || !Array.isArray(data.features)) {
      throw new Error("Invalid JSON format: 'features' array missing.");
    }

    const entities = data.features.map((feature: any) => {
      const { id, zona, tipologia } = feature.properties;
      const { coordinates } = feature.geometry;

      if (!id || !zona || !tipologia || !coordinates) {
        throw new Error("Invalid JSON structure: Missing required fields.");
      }

      return {
        eid: id.toString(),
        name: zona,
        description: tipologia,
        geolocation: JSON.stringify(coordinates), // Store as stringified JSON
        type: "parcheggioProtetto",
        rating: 0, // Default rating
        reviews: [], // Default empty array
        feedbacks: [], // Default empty array
      };
    });

    // Insert all entities into the database
    await entityModel.insertMany(entities);
    console.log("Protected Parking entities successfully inserted.");
  } catch (error) {
    console.error("Error adapting JSON to Entity schema:", error);
  }
};

export default getParcheggioProtetto();