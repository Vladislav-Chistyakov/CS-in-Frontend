





type RGBA = [red: number, green: number, blue: number, alpha: number];

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
  data: number[]
  constructor(width: number, height: number) {
    this.width = width
    this.height = height
    this.data = []
    const dataLength = width * height * 4
    for (let i = 1; i <= dataLength; i++) {
      if (i % 4 === 0) {
        this.data.push(getRandomInt(0, 1, false))
      } else {
        this.data.push(getRandomInt(0, 255))
      }
    }
    console.log('data ', this.data)
  }

  getPixel(x: number, y: number): RGBA {
    const index = (y * this.width + x) * 4
    return [this.data[index], this.data[index + 1], this.data[index + 2], this.data[index + 3]]
  }

  setPixel(x: number, y: number, rgba: RGBA): RGBA {
    const index = (y * this.width + x) * 4
    this.data[index] = rgba[0]
    this.data[index + 1] = rgba[1]
    this.data[index + 2] = rgba[2]
    this.data[index + 3] = rgba[3]
    return rgba
  }

  forEach(mode: TraverseMode, callback: (rgba: RGBA, x: number, y: number) => void) {
    if (mode === 0) {
      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          const rgbaGet = this.getPixel(x, y)
          callback(rgbaGet, x, y)
        }
      }

    } else if (mode === 1) {
      for (let x = 0; x < this.width; x++) {
        for (let y = 0; y < this.height; y++) {
          const rgbaGet = this.getPixel(x, y)
          callback(rgbaGet, x, y)
        }
      }
    }
  }
}

const newClass = new FlatPixelStream(2, 2)
console.log('TEST ', newClass.getPixel(1, 0))
// console.log('TEST ', newClass.setPixel(1, 0, [255, 255, 50, 1]))
// console.log('TEST ', newClass.getPixel(1, 0))
newClass.forEach(TraverseMode.RowMajor, (rgba, x, y) => {
  console.log('RowMajor rgba x y', rgba, x, y)
})

newClass.forEach(TraverseMode.ColMajor, (rgba, x, y) => {
  console.log('ColMajor rgba x y', rgba, x, y)
})


function getRandomInt(min: number, max: number, isInt: boolean = true): number {
  return isInt ? Math.floor(Math.random() * (max - min)) + min : Number((Math.random() * (max - min)).toFixed(1))
}

// function createArrayRGBA (width: number, height: number) {
//   const myArray = []

//   const stolbs = []
//   for (let indexHeight = 0; indexHeight < height; indexHeight++) {
//     const stroke = []
//     for (let indexWidth = 0; indexWidth < width; indexWidth++) {
//       const arrRGBA: RGBA = []
//       arrRGBA.push(getRandomInt(0, 255))
//       arrRGBA.push(getRandomInt(0, 255))
//       arrRGBA.push(getRandomInt(0, 255))
//       arrRGBA.push(getRandomInt(0, 1, false))
//       stroke.push(arrRGBA)
//     }
//     stolbs.push(stroke)
//   }

//   myArray.push(stolbs)

//   return myArray
// }

// Пример: число от 1 до 10
// console.log(getRandomInt(0, 255));

// const arr = createArrayRGBA(10, 10)