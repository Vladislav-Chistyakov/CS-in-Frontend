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

  pop () {
    return this.STACK.pop()
  }

  get bufferStack () {
    return this.STACK.bufferStack
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
    const bytePerElement = arrayBuffer.BYTES_PER_ELEMENT
    const oldBuffer = new Uint8Array(this.#buffer, this.#pointer)
    const newBuffer = new Uint8Array(arrayBuffer.buffer)
    
    // TODO вернуть указатель на первый байт
    oldBuffer.set(newBuffer)
    
    // сохранить его
    const startPointer = this.#pointer
    
    // Перезаписали указатель, он ссылка на пустое место в нашем буффере для следующей записи
    this.#pointer = this.#pointer + newBuffer.byteLength

    const arrayLength = newBuffer.length / bytePerElement 
    
    // Отдали указатель на начало
    return new PointerStack(this.#buffer, startPointer, newBuffer.length, arrayBuffer.constructor, arrayLength)
  }
  
  pop() {
    console.log('Pointer ', this.pointer)
  }
  
  get bufferStack () {
    return this.#buffer
  }
}

class PointerStack {
  #buffer
  #pointerStart
  #bufferLength
  #TypeArray
  #length
  
  constructor(buffer, pointerStart, bufferLength, TypeArray, length) {
    this.#buffer = buffer
    this.#pointerStart = pointerStart
    this.#bufferLength = bufferLength
    this.#TypeArray = TypeArray
    this.#length = length
  }
  
  change(buffer) {
    const newArray = new this.#TypeArray(buffer.buffer)
    const source = new this.#TypeArray(this.#buffer, this.#pointerStart, this.#length)
    for (let i = 0; i < this.#length; i++) {
      source[i] = !!newArray[i] ? newArray[i] : 0
    }
  }
  
  deref() {
    return new this.#TypeArray(this.#buffer.slice(this.#pointerStart, this.#pointerStart + this.#bufferLength)) 
  }
}

const arrayBuffer1 = new Uint32Array([1234567]);
const arrayBuffer2 = new Uint8Array([10,20,30,40]);
const arrayBuffer3 = new Uint16Array([555, 444]);
const arrayBuffer4 = new Uint8Array([1,2]);
const arrayBuffer5 = new Uint16Array([441]);

const memory = new Memory(10 * 1024, { stack: 1024 });

const p1 = memory.push(new Uint32Array([1234567]));
const p2 = memory.push(arrayBuffer3);
console.log(p1.deref());
console.log(p2.deref());
console.log(memory.pop())
// console.log(p2.change(arrayBuffer5));
// console.log(p2.deref());



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