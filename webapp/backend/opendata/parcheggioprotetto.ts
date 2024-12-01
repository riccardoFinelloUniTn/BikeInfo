
import crypto from "crypto";
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

    const operations = data.features
      .map((feature: GeoJSONFeature) => {
        const { zona, tipologia } = feature.properties;
        const { coordinates } = feature.geometry;

        if (!zona || !tipologia || !coordinates) {
          console.log("Missing fields in feature:", feature);
          return null;
        }

        const eid = crypto.createHash("sha256").update(JSON.stringify(coordinates)).digest("hex");

        return {
          updateOne: {
            filter: { eid }, // Match by hashed `eid`
            update: {
              eid,
              name: zona,
              description: tipologia,
              geolocation: JSON.stringify(coordinates),
              type: "parcheggioProtetto",
              rating: 0,
              //reviews: 0,
              feedbacks: [],
            },
            upsert: true, // Insert if not found
          },
        };
      })
      .filter((op:any): op is Exclude<typeof op, null> => op !== null); // Filter out null values

    if (operations.length > 0) {
      await entityModel.bulkWrite(operations); // Perform bulk insert/update operations
      console.log("Parcheggio Protetto data successfully inserted/updated.");
    } else {
      console.log("No valid features to insert or update.");
    }
  } catch (error) {
    console.error("Error refreshing Parcheggio Protetto:", error);
  }
};

export default getParcheggioProtetto();