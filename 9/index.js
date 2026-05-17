// 
//
//
//
//
//
//
class RGBAView {
  array
  offset

  constructor(array, offset) {
    // Декодировщик HEX
    this.array = array;
    this.offset = offset
  }

  set (code) {
    this.decode(code)
  }

  decode(code) {
    if (typeof (code) === "string" && code.charAt(0) === "#") {
      const hexArray = code.slice(1).match(/.{1,2}/g)
      for (let i = 0; i < 4; i++) {
        if (i === 3) {
          this.array[this.offset + i] = hexArray[i] === undefined ? 255 : parseInt(hexArray[i], 16)
        } else {
          this.array[this.offset + i] = parseInt(hexArray[i], 16)
        }
      }
      // Декодировщик массива цветов
    } else if (Array.isArray(code)) {
      for (let i = 0; i < 4; i++) {
        this.array[this.offset + i] = code[i]
      }
    }
  }

  toHex(color) {
    if (typeof color === "number")
      return color.toString(16).padStart(2, '0').toUpperCase()
  }

  get red() {
    return this.array[this.offset];
  }

  set red(value) {
    this.array[this.offset] = value
  }

  get green() {
    return this.array[this.offset + 1];
  }

  set green(value) {
    this.array[this.offset + 1] = value
  }

  get blue() {
    return this.array[this.offset + 2];
  }

  set blue(value) {
    this.array[this.offset + 2] = value
  }

  get alpha() {
    return this.array[this.offset + 3];
  }

  set alpha(value) {
    this.array[this.offset + 3] = value
  }

  viewRGBA() {
    return [this.red, this.green, this.blue, this.alpha]
  }
}



// Создание тестового canvas
const canvas = document.getElementById('canvas')
canvas.width = 3
canvas.height = 2

// Заполняем canvas
const ctx = canvas.getContext('2d')
ctx.fillStyle = "#4CAF50"
ctx.fillRect(0, 0, 3, 2)

// buffer canvas
const buffer = ctx.getImageData(0, 0, canvas.width, canvas.height)

// Выбираем первый пиксель
// const arr = new RGBAView(buffer.data, 0)

// Изменяем цвет нашего пикселя
// arr.set('#ADFF6956')

// Обновляем canvas
// ctx.putImageData(buffer, 0, 0)


class Matrix2D {
  #width
  #height
  #RGBA
  #data
  length
  constructor(width, height, RGBA, data) {
    this.length = width * height
    this.#width = width
    this.#height = height
    this.#data = data
    this.#RGBA = RGBA
  }
  
  getIndex(row, col) {
    return row * this.#width + col
  }
  
  fill(code) {
    for (let i = 0; i < this.length * 4; i += 4) {
      const RGBA = new this.#RGBA(this.#data, i)
      RGBA.set(code)
    }
  }

  get(row, col) {
    const color = new RGBAView(this.#data, this.getIndex(row, col) * 4)
    return color.viewRGBA()
  }
  
  set(row, col, code) {
    const color = new RGBAView(this.#data, this.getIndex(row, col) * 4)
    return color.set(code)
  }
  
  view(row, col) {
    return new RGBAView(this.#data, this.getIndex(row, col) * 4)
  }
}

const test = new Matrix2D(canvas.width, canvas.height, RGBAView, buffer.data)
test.fill('#A9171780')

ctx.putImageData(buffer, 0, 0)
console.log('Buffer data ', buffer.data)
console.log(test.get(1, 1))
test.set(1, 1, '#000000')
console.log(test.get(1, 1))
ctx.putImageData(buffer, 0, 0)

console.log(test.view(1, 1).red)
test.view(1, 1).red = 255
console.log(test.get(1, 1))
ctx.putImageData(buffer, 0, 0)







