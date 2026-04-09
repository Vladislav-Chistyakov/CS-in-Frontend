const coder = {
'а': 0b000010,
'б': 0b000011,
'в': 0b000100,
'г': 0b000101,
'д': 0b000110,
'е': 0b000111,
'ё': 0b001000,
'ж': 0b001001,
'з': 0b001010,
'и': 0b001011,
'й': 0b001100,
'к': 0b001101,
'л': 0b001110,
'м': 0b001111,
'н': 0b010000,
'о': 0b010001,
'п': 0b010010,
'р': 0b010011,
'с': 0b010100,
'т': 0b010101,
'у': 0b010110,
'ф': 0b010111,
'х': 0b011000,
'ц': 0b011001,
'ч': 0b011010,
'ш': 0b011011,
'щ': 0b011100,
'ъ': 0b011101,
'ы': 0b011110,
'ь': 0b011111,
'э': 0b100000,
'ю': 0b100001,
'я': 0b100010,
'0': 0b100011,
'1': 0b100100,
'2': 0b100101,
'3': 0b100110,
'4': 0b100111,
'5': 0b101000,
'6': 0b101001,
'7': 0b101010,
'8': 0b101011,
'9': 0b101100,
'.': 0b101101,
',': 0b101110,
';': 0b101111,
':': 0b110000,
'{': 0b110001,
'}': 0b110010,
'-': 0b110011,
'?': 0b110100,
'!': 0b110101,
'(': 0b110110,
')': 0b110111,
'"': 0b111000,
'\t': 0b111001,
'CAPS': 0b111010,
}

const toStr = (b) => b.toString(2)

const MyEncoding = {
  str: '',
  createSizeArray () {
    return Math.ceil(this.str.length * 6 / 8)
  },
  sizeArray: 0,
  arr: new Uint8Array(this.sizeArray),
  encode(string) {
    // записали строку
    this.str = string
    console.log(this.str)

    // узнали сколько элементов будет у нас в массиве
    this.sizeArray = this.createSizeArray()
    // создали массив Uint8Array
    this.arr = new Uint8Array(this.sizeArray)

    // тут я буду считать количество битов
    // которое мне надо будет дописать в следующий байт
    // то есть сохранить оставшиеся биты
    let buffer = 0
    for (let indexSimb = 0, indexByte = 0; indexSimb < this.str.length; indexSimb++) {
      const simb = this.str[indexSimb]
      const codeSimb = coder[simb]
      console.log('\nbuffer', buffer)
      console.log('indexSimb', indexSimb, simb)
      console.log('indexByte', indexByte)
      if (buffer === 0) {
        this.arr[indexByte] = codeSimb << 2
        buffer = 2
        continue
      }
      if (buffer === 2) {
        // получаем второй символ
        // то сколько у нас останется места в следующем байте
        const smeshenieSimbNaDlinuOstatka = 6 - buffer
        // а значит нам оставшиеся символы не нужны, мы их заберем
        // и добавим в байт который у нас не дозаполнен
        const draft = codeSimb >>> smeshenieSimbNaDlinuOstatka

        this.arr[indexByte] = this.arr[indexByte] | draft
        indexByte++
        // 000011 << срезаем 2  = 001100 -> потом приводим в Uint 001100  -> потом срезаем новое на 2 0011
        // следующее срезанное число
        const toDraft = ((codeSimb << 2) >>> 0) >>> 2
        this.arr[indexByte] = toDraft
        continue
      }
    }
    return this.arr
  },
  decode() {}
}

const bytes = MyEncoding.encode("аб"); // Uint8Array
console.log('bytes ', bytes)
console.log('test ', toStr(coder['б'] >>> 0) )
// console.log(MyEncoding.decode(bytes)); // "Какая-то строка!"
// TЗ - надо придумать как в одной итерации записать символ и считать буффер