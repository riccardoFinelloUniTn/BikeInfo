const https = require("https"); // or 'https' for https:// URLs
const fs = require("fs");
const geojson = require("geojson");
const decompress = require("decompress");
import { Response } from "express";

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

export default getRastrelliere();
