// TODO мой процессор работает через big-endian

// надо релизовать метод хранения данных
// вид наверное сделаем через
// [countStrings - количество строк]
// [num - длина строки в байтах]
// [хранение самой строки в Uint8Array]
// [num - длина строки в байтах]
// [хранение самой строки в Uint8Array]

class OneCoderString {
  NUMBER_OF_LINES
  BUFFER
  VIEW

  // выравнивание
  addOffset(offset) {
    if (offset % 4) {
      const test = 4 - (offset % 4)
      return offset + test
    }
    return offset
  }

  constructor(strings) {
    // создаем область памяти, через ArrayBuffer - количество 1024 байта
    this.BUFFER = new ArrayBuffer(1024)
    let offset = 0

    // Записываем количество строк
    this.NUMBER_OF_LINES = new Uint32Array([strings.length])

    // Наше представление области памяти
    // с помощью DataView мы можем менять наши данные и смотреть на них
    this.VIEW = new DataView(this.BUFFER)

    // пример записи данных в область памяти
    this.VIEW.setUint32(offset, this.NUMBER_OF_LINES[0], true)

    // Делаем отступ в 4 байта,
    // потому как записали первым элеметном количество строк
    offset += 4

    // Создаем encoder для кодирования строк
    const encoder = new TextEncoder();

    // Запускаем цикл по количеству строк
    for (let i = 0; i < this.NUMBER_OF_LINES[0]; i++) {
      // Кодирование строки в Uint8Array
      const stringInBites = encoder.encode(strings[i]);


      // Создаем переменную в которую мы записываем количество занимаемых бит строкой
      const countBitesForString = new Uint32Array([stringInBites.length])

      // Записываем данные countBitesForString в нашу память
      this.VIEW.setUint32(offset, countBitesForString[0], true)

      // Делаем отступ
      offset += 4

      // Проверка на пустую строку
      if (stringInBites.length === 0) {
        // Так мы показываем что строка пустая, пропускаем 8 бит
        // Пустая область в нашей памяти будет говорить нам,
        // что строка пустая
        offset += 4
        continue
      }

      // И через цикл записываем наши данные в память по 1 биту
      for (const char of stringInBites) {
        this.VIEW.setUint8(offset, char)
        // после каждой записи делаем отступ
        offset += 1
      }

      // Для того, чтобы у нас не путалось местоположение строк и других данных в памяти
      // Мы делаем выравнивание, чтобы данные были четко разбиты в своих секторах
      // Иначе будет очень сложно узнать где и что лежит в памяти
      offset = this.addOffset(offset)

    }
    // Мы обрезаем наш Buffer на количество затраченного на него памяти
    // Пустая память нам не нужна
    this.BUFFER = this.BUFFER.slice(0, offset)

    //Обновляем наш VIEW
    this.VIEW = new DataView(this.BUFFER)
  }

  // Достаем элемент по интексу
  at(number) {
    const BYTE_IN_32 = 4
    const decoder = new TextDecoder();

    // Достаем наше количество строк
    const countStrings = this.VIEW.getUint32(this.BUFFER[0], true)

    // Тут мы решаем вопрос по отрицательному индексу искать или по тому который передали
    const desiredElementIndex = number < 0 ? countStrings + number : number

    // Мы отрезаем 1 элемент из памяти, там хранилась только количество строк в массиве
    const buffer = this.BUFFER.slice(BYTE_IN_32)

    // Создаем новывй view из полученного buffer
    const view = new DataView(buffer)

    // Наш счетчик
    let offset = 0

    console.log('this.VIEW', this.VIEW)

    // Идем шагами по нашей памяти
    for (let step = 0; step < countStrings; step++) {
      // Получаем количество символов в строке
      const numberOfCharactersPerLine = view.getUint32(offset, true)
      // передвигаемся на 4 байта после этого
      offset += BYTE_IN_32

      // мы нашли нужный элемент
      if (step === desiredElementIndex) {
        // мы вырезаем его из памяти, это закодированный Uint8Array
        const resultString = buffer.slice(offset, offset + numberOfCharactersPerLine)
        // Декодируем и выводим результат
        return decoder.decode(resultString);
        // Если у нас строка состоит из 0 элементов
      } else if (numberOfCharactersPerLine === 0) {
        // То двигаемся дальше на + 4
        offset += BYTE_IN_32
      } else {
        // Если мы попали не строку которая нас не интересует
        // то добавляем к передвижению ее длину
        offset += numberOfCharactersPerLine
      }
      // Делаем выравнивание после всех операций
      offset = this.addOffset(offset)
    }
    // Если элемента по полученному индексу не существует
    // то выводим undefined
    return undefined
  }

  // Просто возвращаем нашу память
  buffer() {
    return this.BUFFER
  }

  // Декодируем буфер
  decode(decodeBuffer) {
    const BYTE_IN_32 = 4
    const decoder = new TextDecoder();


    // Создаем новый view из полученного буфера
    let view = new DataView(decodeBuffer)

    // Достаем количество строк в буффере
    const countStrings = view.getUint32(decodeBuffer[0], true)

    // Обрезаем
    const buffer = decodeBuffer.slice(BYTE_IN_32)

    // Создаем новый view из обрезанного
    view = new DataView(buffer)

    // Наш счетчик
    let offset = 0

    const arrayString = []

    // Идем шагами по памяти
    for (let step = 0; step < countStrings; step++) {
      // Получаем количество символов в строке
      const numberOfCharactersPerLine = view.getUint32(offset, true)
      // передвигаемся на 4 байта после этого
      offset += BYTE_IN_32

      // Если строка не имеет символов, это пустая строка
      if (numberOfCharactersPerLine === 0) {
        arrayString.push('')
        offset += BYTE_IN_32
      } else {
        // Декодируем и добавляем строку в массив
        const resultString = buffer.slice(offset, offset + numberOfCharactersPerLine)
        arrayString.push(decoder.decode(resultString))
        offset += numberOfCharactersPerLine
      }

      // Делаем выравнивание
      offset = this.addOffset(offset)
    }
    // Отдаем массив
    return arrayString
  }
}

// const strings = ['hello', 'kill', '', 'world', 'lol']
// const buffer = new OneCoderString(strings)
// const myString = buffer.at(1)
// console.log("RESULT ", myString, myString === '')
//
// const bufferInArray = buffer.buffer()
// console.log("decode ", buffer.decode(bufferInArray))

class TwoCoderString {
  BUFFER
  VIEW

  // выравнивание
  addOffset(offset) {
    if (offset % 4) {
      const test = 4 - (offset % 4)
      return offset + test
    }
    return offset
  }

  constructor(strings) {
    // создаем область памяти, через ArrayBuffer - количество 1024 байта
    this.BUFFER = new ArrayBuffer(1024)
    let offset = 0

    // Наше представление области памяти
    // с помощью DataView мы можем менять наши данные и смотреть на них
    this.VIEW = new DataView(this.BUFFER)

    // Создаем encoder для кодирования строк
    const encoder = new TextEncoder();

    let startingOffsetForString = strings.length * 8

    // Запускаем цикл по количеству строк
    for (let i = 0; i < strings.length; i++) {
      // Кодирование строки в Uint8Array
      const stringInBites = encoder.encode(strings[i]);

      // Создаем переменную в которую мы записываем количество занимаемых бит строкой
      const countBitesForString = new Uint32Array([stringInBites.length])

      // Записываем данные countBitesForString в нашу память
      this.VIEW.setUint32(offset, countBitesForString[0], true)

      // Делаем отступ
      offset += 4

      // записать offset для строки
      const pointerInString = new Uint32Array([startingOffsetForString])
      this.VIEW.setUint32(offset, pointerInString[0], true)
      offset += 4

      if (stringInBites.length === 0) {
        // Так мы показываем что строка пустая, пропускаем 8 бит
        // Пустая область в нашей памяти будет говорить нам,
        // что строка пустая
        startingOffsetForString += 4
        continue
      }

      for (const char of stringInBites) {
        this.VIEW.setUint8(startingOffsetForString, char)
        // после каждой записи делаем отступ
        startingOffsetForString += 1
      }
      startingOffsetForString = this.addOffset(startingOffsetForString)
    }

    // Мы обрезаем наш Buffer на количество затраченного на него памяти
    // Пустая память нам не нужна
    this.BUFFER = this.BUFFER.slice(0, startingOffsetForString)
    //Обновляем наш VIEW
    this.VIEW = new DataView(this.BUFFER)
  }

  // Просто возвращаем нашу память
  buffer() {
    return this.BUFFER
  }

  // Декодируем буфер
  decode(decodeBuffer) {
    const decoder = new TextDecoder();

    // Создаем новый view из полученного буфера
    let view = new DataView(decodeBuffer)

    let offset = 0

    let startingStrings = 0
    const stringsArray = []

    let index = 0

    do {
      // Количество символов
      const countChars = view.getUint32(offset, true)
      offset += 4

      // Указатель на интекс
      const pointer = view.getUint32(offset, true)
      if (index === 0) {
        startingStrings = view.getUint32(offset, true)
      }
      offset += 4

      stringsArray[index] = decoder.decode(decodeBuffer.slice(pointer, pointer + countChars))

      index++
    }
    while (startingStrings !== offset)

    return stringsArray
  }
}

const strings = ['hello', 'kill', '', 'world', 'lol']
const buffer = new TwoCoderString(strings)
// const myString = buffer.at(2)
console.log("RESULT ", buffer.BUFFER)

const bufferInArray = buffer.buffer()
console.log("decode ", buffer.decode(bufferInArray))

