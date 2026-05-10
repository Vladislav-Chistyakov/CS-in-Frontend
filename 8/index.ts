import * as fs from "fs";
import * as readline from "readline";

parseCSV("./very-big-csv", ",", (err, data) => {
  if (err != null) {
    console.error(err);
    return;
  }

  console.log(data);
});

function parseCSV(file: string, separator: string, cb: (err: Error | null, data: string[]) => void) {
  const rl = readline.createInterface({
    input: fs.createReadStream(file),
    crlfDelay: Infinity
  });

  rl.on('line', (line) => {
    // ...
  });

  rl.once('close', () => {
    // ...
  });
}