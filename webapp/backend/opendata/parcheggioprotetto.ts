

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
    



export const fetchAndRefreshParcheggioProtetto = async (jsonData: string): Promise<void> => {
  try {
    const data = JSON.parse(jsonData);

    if (!data.features || !Array.isArray(data.features)) {
      throw new Error("Invalid JSON format: 'features' array missing.");
    }

    // Extract and transform data
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
        type: "parcheggioProtetto",
        rating: 0,
        reviews: [],
        feedbacks: [],
      };
    });

    // Refresh database
    const existingEntities = await entityModel.find({ type: "parcheggioProtetto" }).exec();

    // Find entities to delete
    const incomingIds = entities.map((entity:any) => entity.eid);
    const toDelete = existingEntities.filter(
      (existing) => !incomingIds.includes(existing.eid)
    );

    // Delete outdated entities
    await Promise.all(toDelete.map((entity) => entityModel.deleteOne({ eid: entity.eid })));

    // Upsert new/updated entities
    await Promise.all(
      entities.map((entity:any) =>
        entityModel.updateOne(
          { eid: entity.eid },
          { $set: entity },
          { upsert: true } // Insert if not exists
        )
      )
    );

    console.log("Parcheggio Protetto entities refreshed successfully.");
  } catch (error) {
    console.error("Error refreshing parcheggio protetto:", error);
  }
};

export default getParcheggioProtetto();