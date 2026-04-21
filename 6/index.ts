const numbersCheckArray = [10, 100, 1_000, 10_000, 100_000]

function progrev(size: number, fn: () => void) {
  for (let i = 0; i < size; i++) {
    fn()
  }
}

enum Methods {
  "POP",
  "PUSH",
  "SHIFT",
  "UNSHIFT",
}

function rabota(arr: any[], size: number, method: Methods, which: "С дырками" | "Без дырок") {
  const myArray = [...arr]
  const chooseMethod = (method: Methods) => {
    switch (method) {
      case Methods.POP: {
        return () => myArray.pop();
      }
      case Methods.PUSH: {
        return () => myArray.push(0);
      }
      case Methods.SHIFT: {
        return () => myArray.shift();
      }
      case Methods.UNSHIFT: {
        return () => myArray.unshift();
      }
    }
  }
  const callBack = chooseMethod(method)
  // console.log('TEST CALLBACK', callBack())
  // return

  progrev(size, callBack)

  const randReadStart = performance.now();

  for (let i = 0; i < size; i++) {
    callBack()
  }
  const randReadTime = performance.now() - randReadStart;
  console.log(`Время затраченное на отработку функции ${Methods[method]}`, randReadTime.toFixed(2), `размер `, size, ` тип - ${which}`);
}


function check(method: Methods) {
  for (const size of numbersCheckArray) {
    // Массив с дырками
    rabota(new Array(size), size, method, "С дырками")
  }

  for (const size of numbersCheckArray) {
    // Массив без дырок
    rabota(new Array(size).fill(0), size, method, "Без дырок")
  }
}

check(Methods.POP)
