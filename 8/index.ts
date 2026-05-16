import * as fs from "fs";
import * as readline from "readline";
import { unpack, UnpackrStream } from "msgpackr";
import * as zlib from "zlib";
// @ts-ignore
import AdmZip from "adm-zip";
import {Readable} from "node:stream";

function switchBoolean(str: string): boolean {
  switch (str) {
    case "TRUE":
      return true;
    case "FALSE":
      return false;
    default:
      return false;
  }
}

function makeNumber(str: string): number | string {
  if (!Number.isNaN(Number(str))) {
    return Number(str);
  }

  return str;
}

function parseStringOnKey(str: string, key: string) {
  switch (key) {
    case "id":
    case "score":
    case "registered_ms":
    case "last_seen_ms":
      return makeNumber(str);

    case "active":
    case "verified":
      return switchBoolean(str);

    default:
      return str;
  }
}

// TODO PARSE CSV
function parseCSV(
  file: string,
  separator: string,
): Promise<void> {

  return new Promise((resolve, reject) => {

    let inputStream;

    // ZIP
    if (file.endsWith(".zip")) {

      const zip = new AdmZip(file);

      const entries = zip.getEntries();

      const csvFile = entries[0];

      const csvString =
        csvFile.getData().toString("utf-8");

      inputStream = Readable.from(csvString.split("\n"));

    } else {

      inputStream = fs.createReadStream(file);

    }

    let isHeader = true;

    let keysObjectWithArray: string[] = [];

    const rl = readline.createInterface({
      input: inputStream,
      crlfDelay: Infinity
    });

    const startCSV = performance.now();

    let firstRowTime = 0;

    rl.on("line", (line) => {

      if (isHeader) {

        keysObjectWithArray = line.split(separator);

        isHeader = false;

        return;
      }

      if (firstRowTime === 0) {

        firstRowTime =
          performance.now() - startCSV;

        console.log(
          "CSV first row:",
          firstRowTime.toFixed(2),
          "ms"
        );
      }

      const values = line.split(separator);

      const row: Record<string, any> = {};

      values.forEach((item, index) => {

        const key = keysObjectWithArray[index];

        row[key] =
          parseStringOnKey(item, key);

      });

      void row;
    });

    rl.once("close", () => {

      const totalTimeCSV =
        performance.now() - startCSV;

      console.log(
        "CSV total:",
        totalTimeCSV.toFixed(2),
        "ms"
      );

      resolve();
    });

    rl.once("error", reject);
  });
}


// TODO PARSE JSON
function checkTimeParseJson(path: string) {
  const start = performance.now();
  console.log('PATH ', path)

  const zip = new AdmZip(path);

  const entries = zip.getEntries();

  const file = entries[0];

  const jsonString =
    file.getData().toString("utf-8");

  JSON.parse(jsonString);

  const totalTime = performance.now() - start;

  console.log(
    "JSON ZIP total:",
    totalTime.toFixed(2),
    "ms"
  );
}


// TODO PARSE MSGPACK
function checkMSGPACK(path: string): Promise<void> {
  return new Promise((resolve, reject) => {

    const start = performance.now();

    const stream = fs
      .createReadStream(path)
      .pipe(zlib.createGunzip())
      .pipe(new UnpackrStream())

      // .pipe(zlib.createBrotliDecompress()) // br
      // .pipe(zlib.createGunzip()) // gz


    let firstRowTime = 0;

    stream.on("data", () => {

      if (firstRowTime === 0) {
        firstRowTime = performance.now() - start;

        console.log(
          "MSGPACK first row:",
          firstRowTime.toFixed(2),
          "ms"
        );
      }
    });

    stream.on("end", () => {
      const total = performance.now() - start;

      console.log(
        "MSGPACK total:",
        total.toFixed(2),
        "ms"
      );

      resolve();
    });

    stream.on("error", reject);
  });
}

/*
|--------------------------------------------------------------------------
| START
|--------------------------------------------------------------------------
*/

async function main() {

  const raschirenie = ['.zip'] // , '.br', '.gz', '.zip'

  for (const ras of raschirenie) {
    console.log("\n--- JSON ---" + ras);

    checkTimeParseJson(`data/data-300_000.json${ras}`);

    global.gc?.();

    console.log("\n--- CSV ---");

    await parseCSV(
      `./data/data-300_000.csv${ras}`,
      ","
    );

    console.log("\n--- MSGPACK ---");

//    await checkMSGPACK(
  //    `./data/data-300_000.msgpack${ras}`
    //);
  }
}

(async () => await main())()

