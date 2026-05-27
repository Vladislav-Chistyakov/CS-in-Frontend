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
    if (this.length === 0) {
      console.error('Error, this deque is empty')
      return
    }
    
    const result = this.#startNode.shift()
    
    // Если start index стал последним
    // то переключаем на следующую node
    if (this.#startNode.length === 0 && this.#startNode.next) {
      this.#startNode = this.#startNode.next
      this.#startNode.prev = undefined
    }

    this.#length --
    return result
  }

  unshift(value) {
    if (this.#startNode.isStart) {
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
    if (this.length === 0) {
      console.error('Error, this deque is empty')
      return 
    }
    
    if (this.#endNode.length === 0 && this.#endNode.prev) {
      const result = this.#endNode.pop()
      this.#endNode = this.#endNode.prev
      this.#endNode.next = undefined
      this.#length --
      return result
    } else {
      this.#length --
      return this.#endNode.pop()
    }
  }

  push(value) {
    if (this.#endNode.isEnd) {
      const newNode = this.createNode()
      newNode.push(value)
      this.#endNode.next = newNode
      newNode.prev = this.#endNode
      this.#endNode = newNode
    } else {
      this.#endNode.push(value)
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
  startIndex = null
  endIndex = null

  get isEnd () {
    return this.endIndex === this.capacity - 1
  }

  get isStart () {
    return this.startIndex === 0
  }

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
    const result = this.ARRAY[this.endIndex]
    this.ARRAY[this.endIndex] = 0
    this.endIndex -= 1

    this.#length -= 1
    
    if (this.#length === 0) {
      this.startIndex = null
      this.endIndex = null
    }
    
    return result
  }

  shift() {
    const result  = this.ARRAY[this.startIndex]
    this.ARRAY[this.startIndex] = 0
    this.startIndex += 1

    this.#length -= 1

    if (this.#length === 0) {
      this.startIndex = null
      this.endIndex = null
    }
  
    return result
  }
  
  push(value) {
    if (this.endIndex === null && this.startIndex === null) {
      this.endIndex = 0
      this.startIndex = 0
      this.ARRAY[this.endIndex] = value
    } else {
      if (!this.isEnd) {
        this.ARRAY[this.endIndex + 1] = value
        this.endIndex += 1
      }
    }
    
    this.#length += 1
  }

  unshift(value) {
    if (this.endIndex === null && this.startIndex === null) {
      this.endIndex = this.capacity - 1
      this.startIndex = this.capacity - 1
      this.ARRAY[this.startIndex] = value
    } else {
      if (this.startIndex !== 0) {
        this.startIndex -= 1
        this.ARRAY[this.startIndex] = value
      } else {
        this.ARRAY[this.startIndex] = value
      }
    }
    
    this.#length += 1
  }
}

const deque = new Deque(Uint32Array, 3);
deque.unshift(222)
deque.unshift(221)
deque.unshift(220)
deque.unshift(219)
deque.push(223)
deque.push(224)
deque.push(225)
deque.push(226)
deque.shift()

console.log('Length', deque.startNode, deque.endNode)
console.log('shift ', deque.shift())
console.log('shift ', deque.shift())
console.log('shift ', deque.shift())
console.log(' pop', deque.pop())
console.log(' pop', deque.pop())
console.log(' pop', deque.pop())
deque.unshift(222)
console.log('Length', deque.startNode, deque.endNode)

// сделать push самое начало, а unshift конец
// push(1)
// [1, 0, 0]
// unshift(1)
// [0, 0, 1]  [1, 0, 0]
// push (2)
// [0, 0, 1]  [1, 2, 0]
// shift() // 1
// [1, 2, 0]
// push(3)
// [1, 2, 3]
// shift() // 1
// [0, 2, 3]
// push(4)
// [0, 2, 3] [4, 0, 0]
// unshift(1)
// [1, 2, 3] [4, 0, 0]
// unshift(9)
// [0, 0, 9] [1, 2, 3] [4, 0, 0]
// pop() // 4
// [0, 0, 9] [1, 2, 3]















