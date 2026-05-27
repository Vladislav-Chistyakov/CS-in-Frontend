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
}

const deque = new Deque(Uint8Array, 2);
deque.push(12)
deque.push(13)

// console.log('node.next', deque.endNode, deque.endNode.ARRAY)
deque.push(14)

// console.log('node.next', deque.endNode, deque.endNode.ARRAY)
deque.push(15)
console.log('node.next', deque.endNode, deque.endNode.ARRAY)
console.log('pop', deque.pop())
console.log('node.next', deque.length, deque.endNode)

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