type RGBA = [red?: number, green?: number, blue?: number, alpha?: number];

enum TraverseMode {
   RowMajor,
   ColMajor
}

interface PixelStream {
    getPixel(x: number, y: number): RGBA;
    setPixel(x: number, y: number, rgba: RGBA): RGBA;
    forEach(mode: TraverseMode, callback: (rgba: RGBA, x: number, y: number) => void): void;
}

class FlatPixelStream implements PixelStream {
  width: number
  height: number
  constructor(width: number, height: number) {
    this.width = width
    this.height = height
  }
}


function getRandomInt(min: number, max: number, isInt: boolean = true): number {
  return isInt ? Math.floor(Math.random() * (max - min)) + min : Number((Math.random() * (max - min)).toFixed(1))
}

function createArrayRGBA (width: number, height: number) {
  const myArray = []

  const stolbs = []
  for (let indexHeight = 0; indexHeight < height; indexHeight++) {
    const stroke = []
    for (let indexWidth = 0; indexWidth < width; indexWidth++) {
      const arrRGBA: RGBA = []
      arrRGBA.push(getRandomInt(0, 255))
      arrRGBA.push(getRandomInt(0, 255))
      arrRGBA.push(getRandomInt(0, 255))
      arrRGBA.push(getRandomInt(0, 1, false))
      stroke.push(arrRGBA)
    }
    stolbs.push(stroke)
  }

  myArray.push(stolbs)

  return myArray
}

// Пример: число от 1 до 10
console.log(getRandomInt(0, 255));

const arr = createArrayRGBA(10, 10)
console.log('Arr', arr)

function rowMajor(array: Array<RGBA>, x: number, y: number) {
  let sum = 0;
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < x; j++) {
    }
  }
  return sum;
}

function columnMajor(array: Array<RGBA>, x: number, y: number) {
  let sum = 0;
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < x; j++) {
    }
  }
  return sum;
}