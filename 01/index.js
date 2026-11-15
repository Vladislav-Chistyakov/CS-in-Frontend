const coder = {
' ': 0b000000,
'\n': 0b000001,
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
'SHIFT': 0b111010,
}

const toStr = (b) => b.toString(2)

const MyEncoding = {
  str: '',
  createSizeArray (arrayCharacters) {
    return Math.ceil(arrayCharacters.length * 6 / 8)
  },
  sizeArray: 0,
  arr: new Uint8Array(this.sizeArray),
  arrayOfParsedCharacters: [],
  afterBuffer: 0,
  sizeBitsInOneSymb: 6,
  sizeBitsInOneByte: 8,
  parseString (string) {
    this.arrayOfParsedCharacters = []
    let beforeUseShiftSimbol = false
    let useShiftNow = false

    function doesThisSymbolInTable (simb) {
      if (beforeUseShiftSimbol) {
        return true
      } else if (coder[simb] !== undefined) {
        return true
      } else if (isShift(simb)) {
        beforeUseShiftSimbol = true
        return true
      }
      console.error('Error, такой симбол отстутсвует', simb)
      return false
    }

    function isShift (simb) {
      try {
        const loverTextSimb = simb.toLowerCase()
        if (coder[loverTextSimb] !== undefined) {
          useShiftNow = true
          return true
        }
        return false
      } catch (e) {
        console.error('E', e)
        return false
      }
    }

    for (let index = 0; index < string.length; index++) {
      if (doesThisSymbolInTable(string[index])) {
        if (useShiftNow) {
          this.arrayOfParsedCharacters.push('SHIFT')
          this.arrayOfParsedCharacters.push(string[index].toLowerCase())
          beforeUseShiftSimbol = false
          useShiftNow = false
        } else {
          this.arrayOfParsedCharacters.push(string[index])
        }
      }
    }
    return this.arrayOfParsedCharacters
  },
  encode(string) {
    // Получаем распасренную строку в виде массива символво
    const arrayToWork = this.parseString(string)
    console.log('arrayToWork - ', arrayToWork)

    // узнали сколько элементов будет у нас в массиве
    this.sizeArray = this.createSizeArray(arrayToWork)
    // создали массив Uint8Array
    this.arr = new Uint8Array(this.sizeArray)

    // тут я буду считать количество битов
    // которое мне надо будет дописать в следующий байт
    // то есть сохранить оставшиеся биты

    // Основная функция
    let buffer = this.sizeBitsInOneByte
    for (let indexSimb = 0, indexByte = 0; indexSimb < arrayToWork.length; indexSimb++) {
      // Записываем символ
      let simb = arrayToWork[indexSimb]
      const codeSimb = coder[simb]

      if (buffer >= this.sizeBitsInOneSymb) {
        buffer = buffer - this.sizeBitsInOneSymb
        if (buffer >= 2) {
          this.arr[indexByte] = codeSimb << buffer
        } else {
          this.arr[indexByte] = this.arr[indexByte] | codeSimb
          indexByte++
          buffer = this.sizeBitsInOneByte
        }
      } else  {
        // то сколько у нас останется места в следующем байте
        const remainingBits = this.sizeBitsInOneSymb - buffer
        const freeBitsInNextByte = this.sizeBitsInOneByte - remainingBits
        // а значит нам оставшиеся символы не нужны, мы их заберем
        // и добавим в байт который у нас не дозаполнен
        const draft = codeSimb >>> remainingBits

        this.arr[indexByte] = this.arr[indexByte] | draft
        indexByte++
        
        // следующее срезанное число
        const toDraft = ((codeSimb << buffer) >>> 0) >>> buffer
        this.arr[indexByte] = toDraft << freeBitsInNextByte
        buffer = freeBitsInNextByte
      }
    }
    this.afterBuffer = buffer
    return this.arr
  },
  searchCharacter (codeCharacter) {
    for (const [character, code] of Object.entries(coder)) {
      if (code === codeCharacter) {
        return character
      }
    }
  },
  parseUintArray(array) {
    const parsArr = []

    let buffer = 0
    let bitCount = 0

    for (let i = 0; i < array.length; i++) {
      const byte = array[i]

      buffer = (buffer << 8) | byte
      bitCount += 8

      while (bitCount >= 6 && parsArr.length < this.arrayOfParsedCharacters.length) {
        const shift = bitCount - 6
        const code = (buffer >>> shift) & 0b111111

        const simb = this.searchCharacter(code)
        
        parsArr.push(simb)

        bitCount -= 6
        buffer = buffer & ((1 << bitCount) - 1)
      }
    }
    return parsArr
  },
  decode() {
    const arrayCharacters = this.parseUintArray(this.arr)
    const decodeString = []
    let useCaps = false
    for (let i = 0; i < arrayCharacters.length; i++) {
      if (arrayCharacters[i] === 'SHIFT') {
        useCaps = true
      } else if (useCaps) {
        decodeString.push(arrayCharacters[i].toUpperCase())
        useCaps = false
      } else {
        decodeString.push(arrayCharacters[i])
      }
    }
    return decodeString.join('')
  }
}

const bytes = MyEncoding.encode("абВгжв"); 
console.log(bytes)
console.log(MyEncoding.decode())
