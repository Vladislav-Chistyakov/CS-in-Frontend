const numbersCheckArray = [10, 100, 1_000, 10_000, 100_000]

function warnUpJIT(fn: () => void) {
  for (let i = 0; i < 10000; i++) {
    fn()
  }
}

enum Methods {
  "POP",
  "PUSH",
  "SHIFT",
  "UNSHIFT",
}

function measure(arr: any[], size: number, method: Methods) {
  const JITArray = [...arr]
  const arrayForWork = [...arr]
  const chooseMethod = (method: Methods) => {
    switch (method) {
      case Methods.POP: {
        return (array: any[]) => array.pop();
      }
      case Methods.PUSH: {
        return (array: any[]) => array.push(0);
      }
      case Methods.SHIFT: {
        return (array: any[]) => array.shift();
      }
      case Methods.UNSHIFT: {
        return (array: any[]) => array.unshift(0);
      }
    }
  }
  const callBack = chooseMethod(method)

  warnUpJIT(() => callBack(JITArray))

  const randReadStart = performance.now();

  for (let i = 0; i < size; i++) {
    callBack(arrayForWork)
  }

  return performance.now() - randReadStart;
}

function check(method: Methods) {
  for (const size of numbersCheckArray) {
    // Массив с дырками
    let ms = 0
    for (let i = 0; i < 10; i++) {
      ms+= measure(new Array(size), size, method)
    }
    const time = (ms / 10).toFixed(2)
    console.log(`Размер массива ${size} - массив без дырок`)
    console.log(`Среднее время работы функции ${Methods[method]}`, time, '\n')
  }

  for (const size of numbersCheckArray) {
    // Массив без дырок
    let ms = 0
    for (let i = 0; i < 10; i++) {
      ms+= measure(new Array(size).fill(0), size, method)
    }
    const time = (ms / 10).toFixed(2)
    console.log(`Размер массива ${size} - массив с дырками`)
    console.log(`Среднее время работы функции ${Methods[method]}`, time, '\n')
  }
}


check(Methods.POP)

check(Methods.PUSH)

check(Methods.SHIFT)

check(Methods.UNSHIFT)
