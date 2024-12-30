const https = require("https"); // or 'https' for https:// URLs
const fs = require("fs");
const geojson = require("geojson");
const decompress = require("decompress");
import { Response } from "express";
import entityModel from "../model/entity.model";
import mongoose from "mongoose";
import crypto from "crypto";
import reviewModel from "../model/review.model";

const file = fs.createWriteStream("dist/opendata/rastrelliere.zip");

async function getOpenDataRastrelliere() {
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

    const operations = await Promise.all(
      data.features.map(async (feature: any) => {
        const { zona, tipologia } = feature.properties;
        const { coordinates } = feature.geometry;
    
        if (!zona || !tipologia || !coordinates) {
          console.log("Invalid feature:", feature);
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
            filter: { eid }, // Match existing documents by unique `eid`
            update: {
              eid,
              name: zona,
              description: tipologia,
              geolocation: coordinates,
              type: "rastrelliera",
              rating: averageRating,
              reviews: totalReviews,
            },
            upsert: true, // Insert if not found
          },
        };
      })
    );
    
    const filteredOperations = operations.filter((op): op is Exclude<typeof op, null> => op !== null);

    if (operations.length > 0) {
      await entityModel.bulkWrite(operations);
      console.log("Rastrelliere data successfully inserted/updated.");
    } else {
      console.log("No valid Rastrelliere features to process.");
    }
  } catch (error) {
    console.error("Error in fetchAndRefreshRastrelliere:", error);
  }
};


export default getOpenDataRastrelliere();
