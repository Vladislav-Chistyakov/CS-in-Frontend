// Общий размер памяти — 100 КБ
// Из них 10 КБ резервируется под стек, остальное — под кучу



class Memory {
  #arrayBuffer
  size = 0
  dataView
  STACK
  HEAP

  constructor(memory, options) {
    this.#arrayBuffer = new ArrayBuffer(memory);
    this.size = memory;
    
    this.dataView = new DataView(this.#arrayBuffer)

    this.dataView.setUint8(0, 3)

    if (options && options.stack && typeof options.stack === 'number') {
      this.STACK = new Stack(this.#arrayBuffer, options.stack)
    }
  }

  push (buffer) {
    return this.STACK.push(buffer)
  }

  get bufferStack () {
    return this.STACK.bufferStack
  }
}

class TypedArray {
  array = undefined
  
  constructor(name) {
    console.log('name ', typeof name)
    switch (name) {
      case 'Uint8Array':
        this.array =  Uint8Array
        break
      case 'Uint16Array':
        this.array =  Uint16Array
        break
      case 'Uint32Array':
        this.array =  Uint32Array
        break
      case 'Int8Array':
        this.array =  Int8Array
        break
      case 'Int16Array':
        this.array =  Int16Array
        break
      case 'Int32Array':
        this.array =  Int32Array
        break
      case 'Float32Array':
        this.array =  Float32Array
        break
      case 'Float64Array':
        this.array =  Float64Array
        break
      case 'BigUint64Array':
        this.array = BigUint64Array
        break
      case 'BigInt64Array':
        this.array = BigInt64Array
        break
      default:
        console.error('Error, this array type not recognized' , name)
        break
    }
  }

  getNeedType () {
    return this.array
  }
}

class Stack {
  #pointer = 0
  #buffer
  #dataView
  #endMemory

  get view () {
    return this.#dataView
  }

  get pointer () {
    return this.#pointer
  }

  constructor(arrayBuffer, endMemory) {
    // Збесь на первом этапе мы записываем всю память что нам позволяют взять
    this.#buffer = arrayBuffer
    this.#dataView = new DataView(arrayBuffer, 0, endMemory)
    // endMemory последний байт памяти
    this.#endMemory = endMemory
  }

  push (arrayBuffer) {
    const oldBuffer = new Uint8Array(this.#buffer, this.#pointer)
    const newBuffer = new Uint8Array(arrayBuffer.buffer)
    
    // TODO вернуть указатель на первый байт
    oldBuffer.set(newBuffer)
    
    // сохранить его
    const startPointer = this.#pointer
    
    // Перезаписали указатель, он ссылка на пустое место в нашем буффере для следующей записи
    this.#pointer = this.#pointer + newBuffer.byteLength
    
    // Отдали указатель на начало
    return new PointerStack(this.#buffer, startPointer, newBuffer.length, arrayBuffer.constructor.name)
  }
  
  get bufferStack () {
    return this.#buffer
  }
}

class PointerStack {
  #buffer
  #pointerStart
  #bufferLength
  #bufferTypeName
  
  constructor(buffer, pointerStart, bufferLength, bufferTypeName) {
    this.#buffer = buffer
    this.#pointerStart = pointerStart
    this.#bufferLength = bufferLength
    this.#bufferTypeName = bufferTypeName
  }
  
  deref() {
    const TypeArray = new TypedArray(this.#bufferTypeName).getNeedType()
    return new TypeArray(this.#buffer.slice(this.#pointerStart, this.#pointerStart + this.#bufferLength)) 
  }
}

const arrayBuffer1 = new Uint32Array([1234567]);
const arrayBuffer2 = new Uint8Array([1, 2, 3, 4, 5]);
const arrayBuffer3 = new Uint16Array([17, 9]);
const arrayBuffer4 = new Uint8Array([8, 9, 7, 5]);

const memory = new Memory(10 * 1024, { stack: 1024 });

// console.log('T - ', arrayBuffer1.byteLength)
// console.log('T - ', memory.push(arrayBuffer1))
// console.log('T - ', memory.push(arrayBuffer2))
// console.log('T - ', memory.bufferStack)
const p1 = memory.push(new Uint32Array([1234567]));
const p2 = memory.push(new Uint8Array([1, 2, 3, 4, 5]));

console.log(p2.deref());



// ============================================
//  Работа со стеком (LIFO)
// ============================================

// Добавляем данные в стек
// Возвращает указатель на первый байт сохранённых данных
// const pointer1 = mem.push(arrayBuffer1);

// Добавляем ещё один блок в стек (ляжет поверх предыдущего)
// mem.push(arrayBuffer2);

// Извлекаем значение по указателю (без удаления из стека)
// console.log(pointer1.deref()); // arrayBuffer1

// Изменяем данные по указателю (заменяем содержимое)
// pointer1.change(arrayBuffer3);

// Удаляем последний добавленный блок из стека (LIFO)
// mem.pop(); // удаляет arrayBuffer2

// Удаляем следующий блок (теперь верхним стал arrayBuffer3)
// mem.pop(); // удаляет arrayBuffer3