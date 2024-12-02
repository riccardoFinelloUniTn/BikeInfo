const https = require("https"); // or 'https' for https:// URLs
const fs = require("fs");
const geojson = require("geojson");
const decompress = require("decompress");
import { Response } from "express";
import mongoose from "mongoose";
import entityModel from "../model/entity.model";
import crypto from "crypto";

const file = fs.createWriteStream("dist/opendata/centroinbici.zip");


async function getOpenDataCentroInBici() {
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

export const fetchAndRefreshCentroInBici = async (jsonData: string): Promise<void> => {
  try {
    const data = JSON.parse(jsonData);

    if (!data.features || !Array.isArray(data.features)) {
      throw new Error("Invalid JSON format: 'features' array missing.");
    }

    const operations = data.features
      .map((feature: any) => {
        const { fumetto, desc, cicloposteggi } = feature.properties;
        const { coordinates } = feature.geometry;

        if (!fumetto || !desc || !cicloposteggi || !coordinates) {
          console.log("Invalid feature:", feature);
          return null;
        }

        const eid = crypto.createHash("sha256").update(JSON.stringify(coordinates)).digest("hex");

        return {
          updateOne: {
            filter: { eid }, // Match by hashed `eid`
            update: {
              eid,
              name: desc,
              description: `Cicloposteggi: ${cicloposteggi}`,
              geolocation: JSON.stringify(coordinates),
              type: "centroInBici",
              rating: 0,
              reviews: 0,
              feedbacks: [],
            },
            upsert: true, // Insert if not found
          },
        };
      })
      .filter((op:any): op is Exclude<typeof op, null> => op !== null); // Filter out null operations

    if (operations.length > 0) {
      await entityModel.bulkWrite(operations);
      console.log("Centro in Bici data successfully inserted/updated.");
    } else {
      console.log("No valid Centro in Bici features to process.");
    }
  } catch (error) {
    console.error("Error in fetchAndRefreshCentroInBici:", error);
  }
};

export default getOpenDataCentroInBici();