// Тип массива и его емкость

class Deque {
  #BYTES_PER_ELEMENT = 0
  #view
  #buffer
  #arr
  #size
  #byteLength
  ARRAY

  get view () {
    return this.#view
  }

  get buffer () {
    return this.#buffer
  }

  get arr () {
    return this.#arr
  }

  get size () {
    return this.#size
  }
  
  get byteLength () {
    return this.#byteLength
  }

  constructor(ArrayClass, size) {
    this.ARRAY = ArrayClass
    if (ArrayClass.BYTES_PER_ELEMENT) this.#BYTES_PER_ELEMENT = ArrayClass.BYTES_PER_ELEMENT
    this.#byteLength = !!this.#BYTES_PER_ELEMENT
      ? this.#BYTES_PER_ELEMENT * size
      : size

    this.#size = size
    this.#buffer = new ArrayBuffer(this.#byteLength)
    this.#view = new DataView(this.buffer, 0)
    this.#view.setInt8(0, 13)
    this.#arr = new ArrayClass(this.buffer)
  }
  
  createNewArray() {
    const countElements = (this.buffer.byteLength + this.byteLength) / this.byteLength 
    this.#buffer = this.buffer.transfer(countElements * this.byteLength)
    this.#view = new DataView(this.buffer)
    
    console.log('countElements ', countElements)
    console.log('view ', this.view)
  }
}

class Node {
  ARRAY_CLASS
  ARRAY
  NEXT
  PREV
  
  #size
  #buffer
  #length = 0
  #capacity = 0
  
  get next () {
    return this.NEXT ? this.NEXT : undefined
  }
  
  constructor(ArrayClass, size) {
    this.ARRAY_CLASS = ArrayClass
    const byteLength = !!ArrayClass.BYTES_PER_ELEMENT
      ? ArrayClass.BYTES_PER_ELEMENT * size
      : size

    this.#size = size
    this.#buffer = new ArrayBuffer(byteLength)

    this.ARRAY = new ArrayClass(this.#buffer)
    this.#length = this.ARRAY.length
    this.#size = size
  }
  
  push(value) {
    if (this.#capacity !== this.#length) {
      this.ARRAY[this.#capacity] = value
      this.#capacity += 1
    } else {
      this.NEXT = new Node(this.ARRAY_CLASS, this.#size)
      this.NEXT.push(value)
    }
  }
  
}

const node = new Node(Uint8Array, 2);
node.push(12)
node.push(16)
node.push(44)

const next = node.next
console.log('node.next', next.ARRAY)
// node.createNewArray()
// node.createNewArray()

// dequeue.unshift(1); // Возвращает длину - 1
// dequeue.unshift(2); // 2
// dequeue.unshift(3); // 3
//
// console.log(dequeue.length); // 3
// dequeue.shift();  // Удаляет с начала, возвращает удаленный элемент - 3
//
// dequeue.push(4);
// dequeue.push(5);
// dequeue.push(6);
//
// dequeue.pop();    // Удаляет с конца, возвращает удаленный элемент - 6