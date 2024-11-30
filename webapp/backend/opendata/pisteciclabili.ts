import { Response } from "express";
import entityModel from "../model/entity.model";
import { IEntity } from "../model/entity.model";

const shapefile = require("shapefile");
const https = require("https"); 
const fs = require("fs");
const decompress = require("decompress");

const file = fs.createWriteStream("dist/opendata/pisteciclabili.zip");

async function getPisteCiclabili() {
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

export const fetchAndRefreshPisteCiclabili = async (jsonData: string): Promise<void> => {
  try {
    const data = JSON.parse(jsonData);

    if (!data.features || !Array.isArray(data.features)) {
      throw new Error("Invalid JSON format: 'features' array missing.");
    }

    const entities = data.features.map((feature: any) => {
      const { descrizione, tipologia, anno } = feature.properties;
      const { coordinates } = feature.geometry;

      if (!descrizione || !tipologia || !anno || !coordinates) {
        throw new Error("Invalid JSON structure: Missing required fields.");
      }

      return {
        eid: `${descrizione}-${tipologia}-${anno}`, // Construct a unique ID
        name: descrizione,
        description: tipologia,
        geolocation: JSON.stringify(coordinates),
        type: "pistaCiclabile",
        rating: 0,
        reviews: [],
        feedbacks: [],
      };
    });

    await entityModel.insertMany(entities);
    console.log("Piste Ciclabili data successfully inserted.");
  } catch (error) {
    console.error("Error in fetchAndRefreshPisteCiclabili:", error);
  }
};

export default getPisteCiclabili();
