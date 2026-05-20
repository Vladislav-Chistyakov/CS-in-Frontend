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
  static BYTES_PER_ELEMENT = 4

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
    const color = new this.#RGBA(this.#data, this.getIndex(row, col) * 4)
    return color.viewRGBA()
  }
  
  set(row, col, code) {
    const color = new this.#RGBA(this.#data, this.getIndex(row, col) * 4)
    return color.set(code)
  }
  
  view(row, col) {
    return new this.#RGBA(this.#data, this.getIndex(row, col) * 4)
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

// Обычный вектор, но в качестве элемента кортеж RGBA, 
// а третий опциональный параметр позволяет задать используемый буфер (вместо создания нового)

const color = '#4b4141'

class Vector {
  #length
  #capacity
  #RGBA
  buffer
  #view
  
  constructor(capacity, RGBA) {
    // capacity общая вместимость + 4 (количество байт занимаемое capacity) + 4 (length - количество занятого месте)
    this.buffer = new ArrayBuffer(capacity * RGBA.BYTES_PER_ELEMENT + Uint32Array.BYTES_PER_ELEMENT * 2)
    
    // Задаем значение #capacity
    this.#capacity = new Uint32Array(this.buffer,0, 1)
    this.#capacity[0] = typeof capacity === 'number' ? capacity : 0

    // Задаем значение #length
    this.#length = new Uint32Array(this.buffer,4, 1)
    this.#length[0] = 0
    
    this.#RGBA = RGBA
    
    this.#view = new Uint8Array(this.buffer)
  }
  
  offsetForSearchColor (indexElement) {
    return Uint32Array.BYTES_PER_ELEMENT * 2 + this.#RGBA.BYTES_PER_ELEMENT * indexElement
  }

  get capacity () {
    return this.#capacity[0]
  }

  get length () {
    return this.#length[0]
  }
  
  push (color) {
    if (this.length < this.capacity) {
      this.set(this.length, color)
      const RGBA = new this.#RGBA(this.#view, this.offsetForSearchColor(this.length))
      RGBA.set(color)
      this.#length[0] = this.length + 1
    }
  }
  
  get (index) {
    if (index + 1 > this.length) {
      console.error('Этого элемента не существует', index, index + 1, this.length)
      return undefined
    }
    const RGBA = new this.#RGBA(this.#view, this.offsetForSearchColor(index))
    
    return RGBA.viewRGBA()
  }

  set (index, color) {
    if (index + 1 > this.length && index + 1 > this.capacity) {
      console.error('Нет вохможности изменить элемент', index, index + 1, this.length)
      return undefined
    }
    const RGBA = new this.#RGBA(this.#view, this.offsetForSearchColor(index))
    RGBA.set(color)
  }

  fill(code) {
    for (let i = 0; i < this.capacity; i++) {
      const RGBA = new this.#RGBA(this.#view, this.offsetForSearchColor(i))
      RGBA.set(code)
    }
    this.#length[0] = this.capacity
    console.log('THIS B', this.buffer)
  }
}

const pixels = new Vector(3, RGBAView);

// Readonly значение емкости вектора
console.log(pixels.capacity);

// Readonly значение длины вектора
console.log(pixels.length);

// pixels.fill('#cc1616')
// pixels.fill('#b416cc')
// pixels.fill([173, 22, 204, 255])
// ctx.putImageData(buffer, 0, 0)
// console.log('get', pixels.get(0));
pixels.set(0, [255,255,255,255])
pixels.set(2, [123,123,255,255])
// console.log('get2', pixels.get(0));
console.log('get3', pixels.get(0));

// Заполняем все цвета одним цветом:
// вектор не должен знать про нюансы преобразования значений - он должен полагаться на view
// pixels.fill("#FFF");

// Чтение 0-го элемента вектора: сколько байт прочитать и как вернуть результат определяет view
// console.log(pixels.get(0)); // [255, 255, 255, 255]

// Запись 10-го элемента
// pixels.set(10, [255, 0, 0, 255]); // Явное задание цвета
// pixels.set(10, "#EFEFEF");      // Задание через HEX

// Добавление в конец с возможным расширением
// pixels.push([255, 0, 0, 255]);
// pixels.push("#EFEFEF");

// Pop реаллокацию не делает
// pixels.pop(); // [239, 239, 239, 255]

// pixels.shrinkToFit(); // Ужимает внутренний буфер до фактической длины вектора
// pixels.reserve(10);   // Гарантирует место в буфере для хранения как минимум ещё 10 элементов (если места не хватает, происходит реаллокация)

// Метод view позволяет перейти к покомпонентному доступу к структуре или кортежу с возможностью редактирования
// console.log(pixels.view(10).red) // 239
// pixels.view(1).red = 255;








