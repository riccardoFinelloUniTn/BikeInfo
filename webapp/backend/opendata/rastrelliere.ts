const https = require("https"); // or 'https' for https:// URLs
const fs = require("fs");
const geojson = require("geojson");
const decompress = require("decompress");
import { Response } from "express";
import entityModel from "../model/entity.model";
import mongoose from "mongoose";

const file = fs.createWriteStream("dist/opendata/rastrelliere.zip");

async function getRastrelliere() {
  return new Promise((resolve: Function, reject: Function) => {
    https.get(
      "https://gis.comune.trento.it/dbexport?db=base&sc=mobilita&ly=rastrelliere&fr=geojson",
      function (response: Response) {
        if (response.statusCode === 200) {
          response.pipe(file);
          file.on("finish", () => {
            file.close();
            console.log("Download Completed");
            console.log("Starting decompression");
            decompress("dist/opendata/rastrelliere.zip", "dist/opendata")
              .then((files: any[]) => {
                console.log("Decompression completed");
                let data: string = files[0].data.toString();
                let rastrelliere = JSON.parse(data);
                resolve(rastrelliere);
              })
              .catch((error: Error) => {
                console.log(error);
                reject(error);
              });
          });
        } else {
          console.log(`Request failed with status code: ${response.statusCode}`);
          console.log("Using old files");
          let rastrelliere = JSON.parse(fs.readFileSync("dist/opendata/rastrelliere.geojson"));
          resolve(rastrelliere);
        }
      });
  });
}


export const fetchAndRefreshRastrelliere = async (jsonData: string): Promise<void> => {
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
        geolocation: JSON.stringify(coordinates),
        type: "rastrelliera",
        rating: 0,
        reviews: [],
        feedbacks: [],
      };
    });

    await entityModel.insertMany(entities);
    console.log("Rastrelliere data successfully inserted.");
  } catch (error) {
    console.error("Error in fetchAndRefreshRastrelliere:", error);
  }
};


export default getRastrelliere();
