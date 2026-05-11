import * as fs from "fs";
import * as readline from "readline";

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

function parseCSV(
  file: string,
  separator: string,
  cb: (err: Error | null, data?: any[]) => void
) {
  const result: any[] = [];

  let isHeader = true;

  let keysObjectWithArray: string[] = [];

  const rl = readline.createInterface({
    input: fs.createReadStream(file),
    crlfDelay: Infinity
  });

  const startCSV = performance.now();

  let firstRowTime = 0;

  let peakMemory = process.memoryUsage().heapUsed;

  function updatePeakMemory() {
    peakMemory = Math.max(
      peakMemory,
      process.memoryUsage().heapUsed
    );
  }

  updatePeakMemory()

  rl.on("line", (line) => {

    // HEADER
    if (isHeader) {
      keysObjectWithArray = line.split(separator);

      isHeader = false;

      return;
    }

    // FIRST DATA ROW
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

    // имитируем обработку строки
    void row;
  });

  rl.once("close", () => {
    const totalTimeCSV = performance.now() - startCSV;

    console.log("CSV total:", totalTimeCSV.toFixed(2), "ms");


    console.log(
      "CSV peak memory:",
      (peakMemory / 1024 / 1024).toFixed(2),
      "MB"
    );

    // createJSONFile(result, 'data-300_000.json')
    cb(null, result);
  });

  rl.once("error", (err) => {
    cb(err);
  });
}

/*
|--------------------------------------------------------------------------
| START
|--------------------------------------------------------------------------
*/

console.log("\n--- JSON ---");

checkTimeParseJson("data/data-300_000.json");

global.gc?.();

console.log("\n--- CSV ---");

parseCSV("./data/data-300_000.csv", ",", (err) => {
  if (err) {
    console.error(err);
  }
});

function createJSONFile(res: any, fileName: string) {
  fs.writeFileSync(
    fileName,
    JSON.stringify(res, null, 2)
  );
}

