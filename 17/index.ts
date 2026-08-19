interface Comparator<T> {
  (a: T, b: T): number;
}

class BinaryHeap<T> {
  readonly buffer: (T | undefined)[];
  readonly comparator: Comparator<T>;

  #lastIndex: number = -1

  get head(): T | undefined {
    return this.size === 0 ? undefined : this.buffer[0];
  }

  get bufferArray(): (T | undefined)[] {
    return this.buffer;
  }

  get size () {
    return this.#lastIndex + 1;
  }

  constructor(capacity: number, comparator: Comparator<T>) {
    this.comparator = comparator
    this.buffer = new Array(capacity)
  }

  push(value: T): number {
    this.#lastIndex++
    this.buffer[this.#lastIndex] = value

    if (this.size > 1) {
      this.#fromBottom();
    }

    return this.size
  }

  #fromBottom() {
    const i = this.#lastIndex;
    const value = this.buffer[this.#lastIndex];

    let cursor = i

    while (cursor > 0) {
      const parentIndex = this.#getParentIndex(cursor);
      const parent = this.buffer[parentIndex]

      if (this.comparator(value, parent) >= 0) {
        break
      }

      this.buffer[cursor] = parent;
      cursor = parentIndex;
    }

    this.buffer[cursor] = value
  }

  pop(): T | undefined {
    if (this.size === 0) {
      return undefined
    }

    const head = this.head

    if (this.#lastIndex === 0) {
      this.buffer[0] = undefined
      this.#lastIndex = -1
    } else {
      this.buffer[0] = this.buffer[this.#lastIndex]
      this.buffer[this.#lastIndex] = undefined
      this.#lastIndex--
      this.#toBottom()
    }

    return head
  }

  #toBottom() {
    const i = 0
    const value = this.buffer[i]

    let cursor = i

    while (cursor < this.#lastIndex) {
      const leftIndex = this.#getLeftIndex(cursor)

      if (leftIndex > this.#lastIndex) {
        break
      }

      const rightIndex = this.#getRightIndex(cursor)

      let childIndex = leftIndex

      if (
        rightIndex <= this.#lastIndex &&
        this.comparator(this.buffer[leftIndex] as T, this.buffer[rightIndex]as T) > 0
      ) {
        childIndex = rightIndex
      }

      const child = this.buffer[childIndex] as T

      if (this.comparator(value, child) <= 0) {
        break
      }

      this.buffer[cursor] = child
      cursor = childIndex
    }

    this.buffer[cursor] = value
  }

  #getLeftIndex(current: number): number {
    return current * 2 + 1;
  }

  #getRightIndex(current: number): number {
    return current * 2 + 2;
  }

  #getParentIndex(current: number): number {
    return Math.floor((current - 1) / 2);
  }
}

const heap = new BinaryHeap<number>(10, (a, b) => a - b);

// push and size

heap.push(5)
heap.push(3)
heap.push(8)
heap.push(1)

console.assert(heap.size === 4, 'size = 5')
console.assert(heap.head === 1, 'head = 1 (минимальный)')

console.assert(heap.pop() === 1, 'pop() = 1')
console.assert(heap.pop() === 3, 'pop() = 3')
console.assert(heap.pop() === 5, 'pop() = 5')
console.assert(heap.pop() === 8, 'pop() = 8')
console.assert(heap.pop() === undefined, 'pop из пустой = undefined')

const maxHeap = new BinaryHeap<number>(10, (a, b) => b - a);
maxHeap.push(1)
maxHeap.push(5)
maxHeap.push(3)
maxHeap.push(8)
maxHeap.push(2)


console.log('bufferArray ', maxHeap.bufferArray)
console.assert(maxHeap.pop() === 8, 'pop() = 8')
console.assert(maxHeap.pop() === 5, 'pop() = 5')
console.assert(maxHeap.pop() === 3, 'pop() = 3')
console.assert(maxHeap.pop() === 2, 'pop() = 2')
console.assert(maxHeap.pop() === 1, 'pop() = 1')
console.assert(maxHeap.pop() === undefined, 'pop из пустой = undefined')