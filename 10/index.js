// Тип массива и его емкость

class Deque {
  ARRAY_CLASS
  #size
  #startNode
  #endNode
  #length = 0

  get size () {
    return this.#size
  }

  get startNode () {
    return this.#startNode
  }

  get endNode () {
    return this.#endNode
  }

  get length () {
    return this.#length
  }

  constructor(ArrayClass, size) {
    this.ARRAY_CLASS = ArrayClass
    this.#size = size

    this.#endNode = this.createNode()
    this.#startNode = this.#endNode
  }
  
  createNode() {
    return new Node(this.ARRAY_CLASS, this.size)
  }
  
  shift () {
    const result = this.#startNode.shift()
    if (this.#startNode.length === 0) {
      this.#startNode = this.#startNode.next
      this.#startNode.prev = undefined
    }
    this.#length --
    return result
  }

  unshift(value) {
    if (this.#startNode.length === this.#startNode.capacity) {
      const newNode = this.createNode()
      newNode.next = this.#startNode
      this.#startNode.prev = newNode
      this.#startNode = newNode
      this.#startNode.unshift(value)
    } else {
      this.#startNode.unshift(value)
    }
    this.#length++
  }

  pop() {
    if (this.#endNode.length === 0) {
      this.#endNode = this.#endNode.prev
      this.#endNode.next = undefined
      this.#length --
      return this.#endNode.pop()
    } else {
      this.#length --
      return this.#endNode.pop()
    }
  }

  push(value) {
    if (this.#endNode.length !== this.#endNode.capacity) {
      this.#endNode.push(value)
    } else {
      const newNode = this.createNode()
      newNode.push(value)
      this.#endNode.next = newNode
      newNode.prev = this.#endNode
      this.#endNode = newNode
    }
    this.#length ++
  }
}

class Node {
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

  set next (value) {
    this.NEXT = value
  }

  get prev () {
    return this.PREV ? this.PREV : undefined
  }

  set prev (value) {
    this.PREV = value
  }

  get capacity () {
    return this.#capacity
  }

  get length () {
    return this.#length
  }
  
  constructor(ArrayClass, size) {
    const byteLength = !!ArrayClass.BYTES_PER_ELEMENT
      ? ArrayClass.BYTES_PER_ELEMENT * size
      : size

    this.#buffer = new ArrayBuffer(byteLength)

    this.ARRAY = new ArrayClass(this.#buffer).fill(0)
    this.#capacity = size
    this.#size = size
  }

  pop() {
    this.#length -= 1
    const result = this.ARRAY[this.#length]
    this.ARRAY[this.#length] = 0
    return result
  }
  
  push(value) {
    this.ARRAY[this.#length] = value
    this.#length += 1
  }

  unshift(value) {
    this.ARRAY[(this.#capacity - this.#length) - 1] = value
    this.#length ++
  }

  shift() {
    const result  = this.ARRAY[this.#capacity - this.#length]
    this.ARRAY[this.#capacity - this.#length] = 0
    this.#length --
    return result
  }
}

const deque = new Deque(Uint8Array, 2);
deque.push(12)
deque.push(13)
deque.push(14)
console.log('Deque', deque.startNode)
deque.unshift(11)
deque.unshift(10)
deque.unshift(9)
deque.shift()
console.log('Deque', deque.startNode)

