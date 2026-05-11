import * as fs from "fs";
import * as readline from "readline";

parseCSV("./data/data-100.csv", ",", (err, data) => {
  if (err != null) {
    console.error(err);
    return;
  }

  // console.log(data);
});

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
    return Number(str)
  } else {
    return str
  }
}

function parseStringOnKey(str: string, key: string) {
  switch (key) {
    case "id":
      return makeNumber(str);
    case "active":
      return switchBoolean(str);
    case "score":
      return makeNumber(str);
    case "verified":
      return switchBoolean(str);
    case "registered_ms":
      return makeNumber(str);
    case "last_seen_ms":
      return makeNumber(str);
    default:
      return str;
  }
}

function parseCSV(
  file: string,
  separator: string,
  cb: (err: Error | null, data: string[]) => void)
{
  const result: any[] = []
  let isOneLine = true;
  let keysObjectWithArray: string[] = []
  const objectFromFile: any = {}

  const rl = readline.createInterface({
    input: fs.createReadStream(file),
    crlfDelay: Infinity
  });

  function parseLineCSV(line: string[]) {
    const clearObject = {...objectFromFile}

    line.forEach((item, index) => {
      const objectKey: string = keysObjectWithArray[index]
      clearObject[objectKey] = parseStringOnKey(item, objectKey)
    })

    return clearObject
  }

  const startCSV = performance.now();
  let firstRowTime = 0;

  rl.on('line', (line) => {
    if (isOneLine) {
      // разделил ключи объекта
      keysObjectWithArray = [...line.split(separator)]
      keysObjectWithArray.forEach(item => objectFromFile[item] = '')
      // Записали ключи объекта
      isOneLine = false;
      return
    }

    if (firstRowTime === 0) {
      firstRowTime = performance.now() - startCSV;
      console.log("CSV first row ", firstRowTime)
    }

    result.push(parseLineCSV(line.split(separator)))
  });


  rl.once('close', () => {
    const totalTimeCSV = performance.now() - startCSV;

    console.log('CSV ', totalTimeCSV)

    cb(null, result as any)
  });
}

function checkTimeParseJson (string: string) {
  const start = performance.now();

  function parseJSON(path: string) {
    return fs.readFileSync(path, "utf-8");
  }

  const jsonString = parseJSON(string);

  JSON.parse(jsonString)
  const totalTime = performance.now() - start;
  console.log("JSON total ", totalTime)
  console.log("JSON first row ", totalTime)
}

checkTimeParseJson('data/data-100.json');


