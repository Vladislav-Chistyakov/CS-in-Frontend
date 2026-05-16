class RGBAClass {
  view
  array
  
  constructor(code) {
    // Декодировщик HEX
    const buffer = new ArrayBuffer(4)
    this.array = new Uint8Array(buffer).fill(0)
    this.view = new DataView(buffer);
    
    // Отдаем данные в декодировщик
    this.decode(code)
  }
  
  set (code) {
    this.decode(code)
  }
  
  decode(code) {
    if (typeof (code) === "string" && code.charAt(0) === "#") {
      const hexArray = code.slice(1).match(/.{1,2}/g)
      for (let i = 0; i < this.array.length; i++) {
        if (i === 3) {
          this.array[i] = hexArray[i] === undefined ? 255 : parseInt(hexArray[i], 16)
        } else {
          this.array[i] = parseInt(hexArray[i], 16)
        }
      }
      // Декодировщик массива цветов
    } else if (Array.isArray(code)) {
      for (let i = 0; i < this.array.length; i++) {
        this.array[i] = code[i]
      }
    }
  }
  
  toHex(color) {
    if (typeof color === "number")
      return color.toString(16).padStart(2, '0').toUpperCase()
  }
  
  red() {
    return this.view.getUint8(0);
  }

  blue() {
    return this.view.getUint8(1)
  }


  green() {
    return this.view.getUint8(2)
  }


  alpha() {
    return this.view.getUint8(3)
  }
  
  viewRGBA() {
    return [this.red(), this.blue(), this.green(), this.alpha()]
  }
}

const RGBAArray = [255, 255, 255, 255]
const RGBAHex = '#FFFFFF'

const arr = new RGBAClass(RGBAArray)
const hex = new RGBAClass(RGBAHex)
console.log(hex.viewRGBA())
hex.set('#E323230A')
console.log(hex.viewRGBA())
