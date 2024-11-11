
const https = require("https"); // or 'https' for https:// URLs
const fs = require("fs");
const geojson = require("geojson");
const decompress = require("decompress");
import { Response } from "express";

const file = fs.createWriteStream("webapp/backend/opendata/centroincitta.zip");

async function getCentroInBici(){
  let centro_in_bici;
  await https.get(
    "https://gis.comune.trento.it/dbexport?db=base&sc=mobilita&ly=centro_in_bici&fr=geojson",
    await function (response: Response) {
      response.pipe(file);
      // after download completed close filestream
       file.on("finish", () => {
        file.close();
        console.log("Download Completed");
        console.log("Starting decompression");
        decompress(
          "webapp/backend/opendata/centroincitta.zip",
          "webapp/backend/dist/opendata"
        )
          .then((files: any[]) =>  {
        console.log("Decompression completed");
        let data : string =  files[0].data.toString(); ;
        centro_in_bici = JSON.parse(data);
          })
          .catch((error: Error) => {
            console.log(error);
          });
      });
    }
  );
  return centro_in_bici;
}


export default getCentroInBici();