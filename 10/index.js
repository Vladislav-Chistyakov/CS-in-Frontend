// Тип массива и его емкость

class Deque {
  #size
  ARRAY
  #currentNode


  get size () {
    return this.#size
  }

  get currentNode () {
    return this.#currentNode
  }


  constructor(ArrayClass, size) {
    this.ARRAY = ArrayClass
    this.#size = size

    this.#currentNode = this.createNode()
  }
  
  createNode() {
    return new Node(this.ARRAY, this.size)
  }

  pop() {
    if (this.#currentNode.length === 0) {
      this.#currentNode = this.#currentNode.prev
      this.#currentNode.next = undefined
      return this.#currentNode.pop()
    } else {
      return this.#currentNode.pop()
    }
  }

  push(value) {
    if (this.#currentNode.length !== this.#currentNode.capacity) {
      this.#currentNode.push(value)
    } else {
      const newNode = this.createNode()
      newNode.push(value)
      this.#currentNode.next = newNode
      newNode.prev = this.#currentNode
      this.#currentNode = newNode
    }
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

// console.log('node.next', deque.currentNode, deque.currentNode.ARRAY)
deque.push(14)

// console.log('node.next', deque.currentNode, deque.currentNode.ARRAY)
deque.push(15)
console.log('node.next', deque.currentNode, deque.currentNode.ARRAY)
console.log('pop', deque.pop())
console.log('pop', deque.pop())
console.log('pop', deque.pop())
console.log('node.next', deque.currentNode, deque.currentNode.ARRAY)

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