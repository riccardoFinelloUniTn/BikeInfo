import { Response } from "express";

const shapefile = require("shapefile");
const https = require("https"); 
const fs = require("fs");
const geojson = require("geojson");
const decompress = require("decompress");

const file = fs.createWriteStream("webapp/backend/dist/opendata/bikesharing.zip");

async function getPisteCiclabili() {
  return new Promise((resolve: Function, reject: Function) => {
    https.get(
      "https://webapps.comune.trento.it/cartografia/gis/dbexport?db=base&sc=mobilita&ly=piste_ciclabili&fr=shp",
      function (response: Response) {
        response.pipe(file);
        file.on("finish", () => {
          file.close();
          console.log("Download Completed");
          console.log("Starting decompression");
          decompress(
            "webapp/backend/dist/opendata/bikesharing.zip",
            "webapp/backend/dist/opendata"
          )
            .then(async (files: any[]) => {
              console.log("Decompression completed");
              let data: string = files[0].data.toString();
              let centro_in_bici = await shapefile(data);
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

export default getPisteCiclabili();
