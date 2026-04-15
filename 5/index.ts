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


// ------------ FlatPixelStream --------------- //
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
  }

  checkError(x: number, y: number) {
    if (x >= this.width || y >= this.height || x < 0 || y < 0) {
      throw new Error(`Значение больше допустимого width = ${this.width} против ${x} || height = ${this.height} против ${y}`)
    }
    return true
  }

  getPixel(x: number, y: number): RGBA {
    if (!this.checkError(x, y)) return [0,0,0,0];
    const index = (y * this.width + x) * 4
    return [this.data[index], this.data[index + 1], this.data[index + 2], this.data[index + 3]]
  }

  setPixel(x: number, y: number, rgba: RGBA): RGBA {
    if (!this.checkError(x, y)) return [0,0,0,0];
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

function getRandomInt(min: number, max: number, isInt: boolean = true): number {
  return isInt ? Math.floor(Math.random() * (max - min)) + min : Number((Math.random() * (max - min)).toFixed(1))
}

// ------------ FlatPixelStream --------------- //

// ------------ ArrayOfArraysPixelStream --------------- //

class ArrayOfArraysPixelStream implements PixelStream {
  width: number
  height: number
  data: Array<Array<RGBA>>

  constructor(width: number, height: number) {
    this.width = width
    this.height = height
    this.data = this.createArrayOfArraysRGBA(width, height)
    console.log('data ', this.data)
  }

  createArrayOfArraysRGBA (width: number, height: number): Array<Array<RGBA>> {
    const arr: Array<Array<RGBA>> = []
    for (let indexHeight = 0; indexHeight < height; indexHeight++) {
      const stroke: Array<RGBA> = []
      for (let indexWidth = 0; indexWidth < width; indexWidth++) {
        stroke.push(
          [
            getRandomInt(0, 255),
            getRandomInt(0, 255),
            getRandomInt(0, 255),
            getRandomInt(0, 1, false)
          ])
      }
      arr.push(stroke)
    }
    return arr
  }

  checkError(x: number, y: number) {
    if (x >= this.width || y >= this.height || x < 0 || y < 0) {
      throw new Error(`Значение больше допустимого width = ${this.width} против ${x} || height = ${this.height} против ${y}`)
    }
    return true
  }

  getPixel(x: number, y: number): RGBA {
    if (!this.checkError(x, y)) return [0,0,0,0];
    return this.data[y][x]
  }

  setPixel(x: number, y: number, rgba: RGBA): RGBA {
    if (!this.checkError(x, y)) return [0,0,0,0];
    this.data[y][x] = rgba
    return rgba
  }

  forEach(mode: TraverseMode, callback: (rgba: RGBA, x: number, y: number) => void) {
    if (mode === 0) {
      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          const RGBA = this.getPixel(x, y)
          callback(RGBA, x, y)
        }
      }

    } else if (mode === 1) {
      for (let x = 0; x < this.width; x++) {
        for (let y = 0; y < this.height; y++) {
          const RGBA = this.getPixel(x, y)
          callback(RGBA, x, y)
        }
      }
    }
  }
}

// const arrayOfArrays = new ArrayOfArraysPixelStream(2, 2)
// console.log('get ', arrayOfArrays.getPixel(1, 1))

// console.log('set ', arrayOfArrays.setPixel(1, 1, [30, 30, 30, 1]))

// arrayOfArrays.forEach(TraverseMode.RowMajor, (rgba, x, y) => {
//     console.log('forEach row ', x, y, rgba)
// })

// arrayOfArrays.forEach(TraverseMode.ColMajor, (rgba ,x, y) => {
//   console.log('forEach col ', x, y, rgba)
// })

// ------------ ArrayOfArraysPixelStream --------------- //

// ------------ ArrayOfObjectPixelStream --------------- //

class ArrayOfObjectPixelStream implements PixelStream {
  width: number
  height: number
  data: Array<{r: number, g: number, b: number, a: number}>

  constructor(width: number, height: number) {
    this.width = width
    this.height = height
    this.data = this.createArrayOfObjectRGBA(width, height)
    console.log('data ', this.data,)
  }

  createArrayOfObjectRGBA (width: number, height: number): Array<{r: number, g: number, b: number, a: number}> {
    const arr: Array<{r: number, g: number, b: number, a: number}> = []
    const dataLength = width * height
    for (let i = 1; i <= dataLength; i++) {
      arr.push({r: getRandomInt(0, 255), g: getRandomInt(0, 255), b: getRandomInt(0, 255), a: getRandomInt(0, 1, false)})
    }
    return arr
  }

  checkError(x: number, y: number) {
    if (x >= this.width || y >= this.height || x < 0 || y < 0) {
      throw new Error(`Значение больше допустимого width = ${this.width} против ${x} || height = ${this.height} против ${y}`)
    }
    return true
  }

  getPixel(x: number, y: number): RGBA {
    if (!this.checkError(x, y)) return [0,0,0,0];
    const index = (y * this.width + x)
    return [this.data[index].r, this.data[index].g, this.data[index].b, this.data[index].a]
  }

  setPixel(x: number, y: number, rgba: RGBA): RGBA {
    if (!this.checkError(x, y)) return [0,0,0,0];
    const index = (y * this.width + x)
    this.data[index].r = rgba[0]
    this.data[index].g = rgba[1]
    this.data[index].b = rgba[2]
    this.data[index].a = rgba[3]
    return rgba
  }

  forEach(mode: TraverseMode, callback: (rgba: RGBA, x: number, y: number) => void) {
    if (mode === 0) {
      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          const RGBA = this.getPixel(x, y)
          callback(RGBA, x, y)
        }
      }

    } else if (mode === 1) {
      for (let x = 0; x < this.width; x++) {
        for (let y = 0; y < this.height; y++) {
          const RGBA = this.getPixel(x, y)
          callback(RGBA, x, y)
        }
      }
    }
  }
}

// ------------ ArrayOfObjectPixelStream --------------- //

// const arrayOfObject = new ArrayOfObjectPixelStream(2, 2)
// console.log('get ', arrayOfObject.getPixel(1, 1))

// console.log('set ', arrayOfObject.setPixel(1, 1, [30, 30, 30, 1]))

// arrayOfObject.forEach(TraverseMode.RowMajor, (rgba, x, y) => {
//     console.log('forEach row ', x, y, rgba)
// })

// arrayOfObject.forEach(TraverseMode.ColMajor, (rgba ,x, y) => {
//   console.log('forEach col ', x, y, rgba)
// })

// ------------ TypedArray --------------- //
class typedArray implements PixelStream {
  width: number
  height: number
  data: Uint8Array

  constructor(width: number, height: number) {
    this.width = width
    this.height = height
    const dataLength = width * height * 4
    this.data = new Uint8Array(dataLength)
    for (let i = 1; i <= dataLength; i++) {
      if (i % 4 === 0) {
        this.data[i - 1] = getRandomInt(0, 1)
      } else {
        this.data[i - 1] = getRandomInt(0, 255)
      }
    }
  }

  checkError(x: number, y: number) {
    if (x >= this.width || y >= this.height || x < 0 || y < 0) {
      throw new Error(`Значение больше допустимого width = ${this.width} против ${x} || height = ${this.height} против ${y}`)
    }
    return true
  }

  getPixel(x: number, y: number): RGBA {
    if (!this.checkError(x, y)) return [0,0,0,0];
    const index = (y * this.width + x) * 4
    return [this.data[index], this.data[index + 1], this.data[index + 2], this.data[index + 3]]
  }

  setPixel(x: number, y: number, rgba: RGBA): RGBA {
    if (!this.checkError(x, y)) return [0,0,0,0];
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

const newTypedArray = new typedArray(2, 2)
console.log('get ', newTypedArray.getPixel(1, 1))

console.log('set ', newTypedArray.setPixel(1, 1, [30, 30, 30, 1]))

newTypedArray.forEach(TraverseMode.RowMajor, (rgba, x, y) => {
    console.log('forEach row ', x, y, rgba)
})

newTypedArray.forEach(TraverseMode.ColMajor, (rgba ,x, y) => {
  console.log('forEach col ', x, y, rgba)
})

// ------------ TypedArray --------------- //
