import { Response } from "express";
import entityModel from "../model/entity.model";
import { IEntity } from "../model/entity.model";
import crypto from "crypto";

const shapefile = require("shapefile");
const https = require("https"); 
const fs = require("fs");
const decompress = require("decompress");

const file = fs.createWriteStream("dist/opendata/pisteciclabili.zip");

async function getOpenDataPisteCiclabili() {
  return new Promise((resolve: Function, reject: Function) => {
    https.get(
      "https://gis.comune.trento.it/dbexport?db=base&sc=mobilita&ly=piste_ciclabili&fr=geojson",
      function (response: Response) {
        response.pipe(file);
        file.on("finish", () => {
          file.close();
          console.log("Download Completed");
          console.log("Starting decompression");
          decompress(
            "dist/opendata/pisteciclabili.zip",
            "dist/opendata"
          )
            .then(async (files: any[]) => {
              console.log("Decompression completed");
              let data: string = files[0].data.toString();
              let centro_in_bici =JSON.parse(data);
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
    descrizione: string;
    tipologia: string;
  };
  geometry: {
    coordinates: any; // Specify a more accurate type if available
  };
}

export const fetchAndRefreshPisteCiclabili = async (jsonData: string): Promise<void> => {
  try {
    const data = JSON.parse(jsonData);

    if (!data.features || !Array.isArray(data.features)) {
      throw new Error("Invalid JSON format: 'features' array missing.");
    }

    const operations = data.features
      .map((feature: GeoJSONFeature) => {
        const { descrizione, tipologia } = feature.properties;
        const { coordinates } = feature.geometry;

        if (!descrizione || !tipologia || !coordinates) {
          console.log("desc:" + descrizione);
          console.log("type:" + tipologia);
          console.log("coord:" + coordinates);
          return null;
        }

        const eid = crypto.createHash("md5").update(JSON.stringify(coordinates)).digest("hex");

        return {
          updateOne: {
            filter: { eid }, // Match existing documents by unique `eid`
            update: {
              eid,
              name: descrizione,
              description: tipologia,
              geolocation: coordinates,
              type: "pistaCiclabile",
              rating: 0,
              //reviews: 0,
              //feedbacks: [],
            },
            upsert: true, // Insert if no document matches the `filter`
          },
        };
      })
      .filter((op:any): op is Exclude<typeof op, null> => op !== null); // Explicit type refinement

    if (operations.length > 0) {
      await entityModel.bulkWrite(operations); // Use bulkWrite for batch operations
      console.log("Piste Ciclabili data successfully inserted/updated.");
    } else {
      console.log("No valid features to insert or update.");
    }
  } catch (error) {
    console.error("Error in fetchAndRefreshPisteCiclabili:", error);
  }
};

export default getOpenDataPisteCiclabili();
