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
      this.HEAP = new Heap(this.#arrayBuffer, options.stack, this.size)
    }
  }

  push(buffer) {
    return this.STACK.push(buffer)
  }

  pop() {
    return this.STACK.pop()
  }

  get bufferStack() {
    return this.STACK.bufferStack
  }
}

class Stack {
  #pointer = 0
  #buffer
  #dataView
  #endMemory
  #arrayPointers = []

  get view() {
    return this.#dataView
  }

  get pointer() {
    return this.#pointer
  }

  constructor(arrayBuffer, endMemory) {
    // Збесь на первом этапе мы записываем всю память что нам позволяют взять
    this.#buffer = arrayBuffer
    this.#dataView = new DataView(arrayBuffer, 0, endMemory)
    // endMemory последний байт памяти
    this.#endMemory = endMemory
  }

  push(arrayBuffer) {
    const bytePerElement = arrayBuffer.BYTES_PER_ELEMENT
    const oldBuffer = new Uint8Array(this.#buffer, this.#pointer)
    const newBuffer = new Uint8Array(arrayBuffer.buffer)
    
    oldBuffer.set(newBuffer)

    // сохранить его
    const startPointer = this.#pointer

    // Перезаписали указатель, он ссылка на пустое место в нашем буффере для следующей записи
    this.#pointer = this.#pointer + newBuffer.byteLength

    // Дает понять сколько элементов в массиве
    const arrayLength = newBuffer.length / bytePerElement

    // Создали элемент стэка
    const ptr = new PointerStack(this.#buffer,
      startPointer,
      newBuffer.length,
      arrayBuffer.constructor,
      arrayLength,
      (start, size) => this.pop()
    )
    // Записали в массив элементов стэка
    this.#arrayPointers.push(ptr)

    // Вернули последний элемент
    return ptr
  }

  pop() {
    const lastPointer = this.#arrayPointers.pop()
    this.#pointer = this.#pointer - lastPointer.bufferLength
    lastPointer.pop()
  }

  get bufferStack() {
    return this.#buffer
  }
}

class PointerStack {
  #buffer
  #pointerStart
  #bufferLength
  #TypeArray
  #length
  #released = false

  get bufferLength() {
    if (this.#released) {
      throw new Error('this element removed')
    }
    return this.#bufferLength
  }
  
  get buffer () {
    return this.#buffer
  }

  get pointerStart () {
    return this.#pointerStart
  }

  get length () {
    return this.#length
  }

  get typedArray () {
    return this.#TypeArray
  }

  constructor(buffer, pointerStart, bufferLength, TypeArray, length, popFunction) {
    this.#buffer = buffer
    this.#pointerStart = pointerStart
    this.#bufferLength = bufferLength
    this.#TypeArray = TypeArray
    this.#length = length
  }

  change(buffer) {
    if (this.#released) {
      throw new Error('this element removed')
    }

    const newArray = new this.#TypeArray(buffer.buffer)
    const source = new this.#TypeArray(this.#buffer, this.#pointerStart, this.#length)
    for (let i = 0; i < this.#length; i++) {
      source[i] = !!newArray[i] ? newArray[i] : 0
    }
  }

  deref() {
    if (this.#released) {
      throw new Error('this element removed')
    }
    return new this.#TypeArray(this.#buffer.slice(this.#pointerStart, this.#pointerStart + this.#bufferLength))
  }

  pop() {
    this.#released = true
    const BYTES_PER_ELEMENT = this.#TypeArray.BYTES_PER_ELEMENT
    new Uint8Array(this.#buffer, this.#pointerStart, this.#length * BYTES_PER_ELEMENT).fill(0)
  }
}

class Heap {
  #buffer
  #startPointer
  #endMemory
  #dataView
  #freeBlocks = []
  
  get freeBlocks () {
    return this.#freeBlocks
  }

  constructor(buffer, startPointer, endMemory) {
    this.#buffer = buffer
    this.#startPointer = startPointer
    this.#endMemory = endMemory

    // Збесь на первом этапе мы записываем всю память что нам позволяют взять
    this.#dataView = new DataView(buffer, startPointer, endMemory - startPointer)
    const firstFreeBlock = new HeapFreeBlock(startPointer, endMemory - startPointer)
    this.#freeBlocks.push(firstFreeBlock)
  }

  alloc(size) {
    let myMemory = null
    let freeBlockIndex = 0

    const firstFreeBlock = this.#freeBlocks.find((item, index) => {
      if (item.size >= size) {
        freeBlockIndex = index
        myMemory = new HeapPoint(this.#buffer, item.startPointer, size, (start, size) => this.free(start, size))
        return true
      }
      return false
    })

    if (!!firstFreeBlock) {
      if (firstFreeBlock.size - size === 0) {
        this.#freeBlocks.splice(freeBlockIndex, 1)
      } else {
        this.#freeBlocks[freeBlockIndex] = new HeapFreeBlock(firstFreeBlock.startPointer + size, firstFreeBlock.size - size)
      }
    }

    if (myMemory === null) {
      throw new Error('Memory not found')
    }

    return myMemory
  }

  mergeFreeBlocks(freeBlocksArray) {
    const mergedFreeBlocks = []

    // Проверяем что есть возможность соединить блоки
    if (freeBlocksArray.length <= 1) {
      return freeBlocksArray
    }

    // Запускаем цикл объединения
    for (let i = 0; i < freeBlocksArray.length; i++) {
      if (!!freeBlocksArray[i + 1] && freeBlocksArray[i].startPointer + freeBlocksArray[i].size === freeBlocksArray[i + 1].startPointer) {
        mergedFreeBlocks.push(new HeapFreeBlock(freeBlocksArray[i].startPointer, freeBlocksArray[i].size + freeBlocksArray[i + 1].size))
        i++
      } else {
        mergedFreeBlocks.push(freeBlocksArray[i])
      }
    }

    // Проверяем, если прошлый массив и новый одинаковый, просто врзвращаем старый массив
    if (mergedFreeBlocks.length === freeBlocksArray.length) {
      return freeBlocksArray
    } else {
      // Иначе запускаем рекурсию с целью получить объедененный массив
      return this.mergeFreeBlocks(mergedFreeBlocks)
    }
  }

  free(startPointer, memorySize) {
    // после сортировки сделать merge данных и соединить
    const newFreeBlock = new HeapFreeBlock(startPointer, memorySize)
    this.#freeBlocks.push(newFreeBlock)

    // Сортируем массива для мержка блоков, сортировка по началу указателя
    this.#freeBlocks.sort((a, b) => a.startPointer - b.startPointer)

    // Получаем лбъедененные блоки если была возможность их объединить
    this.#freeBlocks = this.mergeFreeBlocks(this.#freeBlocks)
  }
}

class HeapPoint {
  #buffer
  #startPointer
  #memorySize
  #TypeArray
  #released = false
  #freeFunction
  #maxLength = 0
  #length = 0

  constructor(buffer, startPointer, memorySize, freeFunction) {
    this.#buffer = buffer
    this.#startPointer = startPointer
    this.#memorySize = memorySize
    this.#freeFunction = freeFunction
  }
  
  get released () {
    return this.#released
  }
  
  change (buffer) {
    if (this.#released) {
      throw new Error('this element is free')
    }

    this.#TypeArray = buffer.constructor
    const BYTE_PER_ELEMENT = buffer.BYTES_PER_ELEMENT
    this.#maxLength = this.#memorySize / BYTE_PER_ELEMENT
    this.#length = buffer.byteLength / buffer.BYTES_PER_ELEMENT

    const newArray = new this.#TypeArray(buffer.buffer)
    const source = new this.#TypeArray(this.#buffer, this.#startPointer, this.#maxLength)

    for (let i = 0; i < this.#maxLength; i++) {
      source[i] = !!newArray[i] ? newArray[i] : 0
    }
  }

  deref() {
    if (!this.#TypeArray) {
      throw Error('deref element is empty')
    }
    if (this.#released) {
      throw Error('deref element is free')
    }
    return new this.#TypeArray(this.#buffer, this.#startPointer, this.#length)
  }

  free () {
    if (this.#released) {
      throw new Error('double free detected')
    }
    this.#released = true

    this.#freeFunction(this.#startPointer, this.#memorySize)
  }

  [Symbol.dispose](){
    if (!this.released) {
      this.free()
    }
  }
}

class HeapFreeBlock {
  #startPointer
  #size

  get startPointer() {
    return this.#startPointer
  }

  get size() {
    return this.#size
  }

  constructor(startPointer, size) {
    this.#startPointer = startPointer
    this.#size = size
  }

  get freeBlock() {
    return {
      startPointer: this.#startPointer,
      size: this.#size
    }
  }
}

const memory = new Memory(10 * 1024, {stack: 1024});

using p1 = memory.HEAP.alloc(100);
const p2 = memory.push(new Uint8Array([1, 2, 3]));
const p3 = memory.push(new Uint8Array([4, 5, 6]));
const p4 = memory.push(new Uint32Array([32193, 44444124, 12391489]));

console.log('clear pf ', memory.STACK.pop())

console.log('TEST p4 ', p4)
