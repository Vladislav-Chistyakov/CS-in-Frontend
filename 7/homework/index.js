
// TODO мой процессор работает через big-endian

// надо релизовать метод хранения данных
// вид наверное сделаем через
// [countStrings - количество строк]
// [num - длина строки в байтах]
// [хранение самой строки в Uint8Array]
// [num - длина строки в байтах]
// [хранение самой строки в Uint8Array]

class MeByteCoder {
    COUNT
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

    constructor (strings) {
        // создаем область памяти, через ArrayBuffer - количество 256 байта
        this.BUFFER = new ArrayBuffer(1024)
        let offset = 0
        
        // Создание count количество строк
        this.COUNT = new Uint32Array(1)
        this.COUNT[0] = strings.length
        
        console.log('THIS COUNT', this.COUNT, this.COUNT[0])
        // Наше представление области памяти
        // с помощью DataView мы можем менять наши данные и смотреть их
        this.VIEW = new DataView(this.BUFFER)
        // пример записи данных в область памяти
        this.VIEW.setUint32(offset, this.COUNT[0], true)
        // порибавляем 4 к offset потому что записали count
        offset += 4
        console.log('VIEW ', this.VIEW)
        
        
        
        // пример вызова данных из области памяти
        // const checkNumber = this.VIEW.getUint32(0, true)

        const encoder = new TextEncoder();
        
        for (let i = 0; i < this.COUNT[0]; i++) {
            const bytes = encoder.encode(strings[i]);
            console.log('TDO bytes', bytes.length, bytes)
            // const countBytesForString = bytes.length
            if (bytes.length === 0) {
                offset += 8
                continue
            }
            const countBytesForString = new Uint32Array(1)
            countBytesForString[0] = bytes.length
            console.log('THIS TEST', countBytesForString, countBytesForString[0])
            this.VIEW.setUint32(offset, countBytesForString[0], true)
            offset += 4
            console.log('BYTEST ', bytes, bytes.length)
            for (let simb of bytes) {
                this.VIEW.setUint8(offset, simb)
                offset += 1
            }

            offset = this.addOffset(offset)
        }
        this.BUFFER = this.BUFFER.slice(0, offset)
        this.VIEW = new DataView(this.BUFFER)
        
        console.log('buff ', this.BUFFER)

        // const bytes = encoder.encode(str);
        // console.log('TDO bytes', bytes.length, bytes)
        // this.VIEW.setUint32(0, bytes, true)
        
        // console.log('bytes', bytes);
        // const checkString = decoder.decode(bytes);
        // console.log('checkString ', checkString)
    }

    at (number) {
        const BYTE_IN_32 = 4
        const decoder = new TextDecoder();
        
        const countStrings = this.VIEW.getUint32(this.BUFFER[0], true)
        const schet = number < 0 ? countStrings + number  : number
        console.log('countStrings and schet', countStrings, schet)

        const buffer = this.BUFFER.slice(BYTE_IN_32)
        const view = new DataView(buffer)
        
        let count = 0
        
        for (let step = 0; step < countStrings; step++) {
            const firstCount = view.getUint32(count, true)
            count += BYTE_IN_32
            if (step === schet) {
                const resultString = buffer.slice(count, count + firstCount)
                return decoder.decode(resultString);
            } else if (firstCount === 0) {
                count += BYTE_IN_32
            } else {
                count += firstCount
            }
            count = this.addOffset(count)
        }
        return undefined
    }
}

const strings = ['hello', 'kill', '', 'world', 'lol']
const buffer = new MeByteCoder(strings)
const myString = buffer.at(-3)
console.log("RESULT ", myString, myString === '')