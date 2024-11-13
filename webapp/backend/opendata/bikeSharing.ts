const https = require("https"); // or 'https' for https:// URLs
const fs = require("fs");
const geojson = require("geojson");
const decompress = require("decompress");
import { Response } from "express";

const file = fs.createWriteStream("dist/opendata/bikesharing.zip");


async function getBikeSharingTrento() {
  return new Promise((resolve :Function, reject : Function) => {
    https.get(
      "https://os.smartcommunitylab.it/core.mobility/bikesharing/trento",
      function (response: Response) {
        response.pipe(file);
        file.on("finish", () => {
          file.close();
          console.log("Download Completed");
          console.log("Starting decompression");
          decompress(
            "dist/opendata/bikesharing.zip",
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
    
export default getBikeSharingTrento();


