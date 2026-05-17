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

  red() {
    return this.array[this.offset];
  }

  green() {
    return this.array[this.offset + 1];
  }


  blue() {
    return this.array[this.offset + 2];
  }


  alpha() {
    return this.array[this.offset + 3];
  }

  viewRGBA() {
    return [this.red(), this.green(), this.blue(), this.alpha()]
  }
}



// Создание тестового canvas
const canvas = document.getElementById('canvas')
canvas.width = 8
canvas.height = 8

// Заполняем canvas
const ctx = canvas.getContext('2d')
ctx.fillStyle = "#4CAF50"
ctx.fillRect(0, 0, 16, 16)

// buffer canvas
const buffer = ctx.getImageData(0, 0, canvas.width, canvas.height)

// Выбираем первый пиксель
const arr = new RGBAView(buffer.data, 0)

// Изменяем цвет нашего пикселя
arr.set('#ADFF6956')

// Обновляем canvas
ctx.putImageData(buffer, 0, 0)


class Matrix2D {
  constructor(width, height, RGBA, data) {
  }
}
