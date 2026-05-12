import * as fs from "fs";
import * as readline from "readline";
import { unpack, UnpackrStream } from "msgpackr";
import * as zlib from "zlib";

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

function parseCSV(
  file: string,
  separator: string,
): Promise<void> {
  return new Promise((resolve, reject) => {

    let isHeader = true;

    let keysObjectWithArray: string[] = [];

    const rl = readline.createInterface({
      input: fs.createReadStream(file),
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
        firstRowTime = performance.now() - startCSV;

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

        row[key] = parseStringOnKey(item, key);
      });

      void row;
    });

    rl.once("close", () => {
      const totalTimeCSV = performance.now() - startCSV;

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

function checkTimeParseJson(path: string) {
  const start = performance.now();

  let peakMemory = process.memoryUsage().heapUsed;

  function updatePeakMemory() {
    peakMemory = Math.max(
      peakMemory,
      process.memoryUsage().heapUsed
    );
  }

  // Чтение файла
  const jsonString = fs.readFileSync(path, "utf-8");

  updatePeakMemory();

  // Парсинг JSON
  JSON.parse(jsonString);

  updatePeakMemory();

  const totalTime = performance.now() - start;

  console.log("JSON total:", totalTime.toFixed(2), "ms");

  console.log("JSON first row:", totalTime.toFixed(2), "ms");

  console.log(
    "JSON peak memory:",
    (peakMemory / 1024 / 1024).toFixed(2),
    "MB"
  );
}


function checkMessagePack(path: string): Promise<void> {
  return new Promise((resolve, reject) => {

    const start = performance.now();

    const stream = fs
      .createReadStream(path)
      .pipe(zlib.createBrotliDecompress())
      .pipe(new UnpackrStream());
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

  const raschirenie = [''] // , '.br', '.gz', '.zip'

  for (const ras of raschirenie) {
    // console.log("\n--- JSON ---" + ras);

    // checkTimeParseJson(`data/data-300_000.json${ras}`);

    global.gc?.();

    console.log("\n--- CSV ---");

    await parseCSV(
      `./data/data-300_000.csv.br`,
      ","
    );

    console.log("\n--- MSGPACK ---");

    await checkMessagePack(
      `./data/data-300_000.msgpack.br`
    );
  }
}

(async () => await main())()

