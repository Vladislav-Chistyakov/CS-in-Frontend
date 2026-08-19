import * as assert from "node:assert";

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


function heapSort<T>(arr: T[], comparator: Comparator<T>): T[] {
  return arr
}

// Тесты для heapSort
console.log("=== Тесты heapSort ===\n");

// Тест 1: Сортировка чисел
const numbers = [5, 3, 8, 4, 2, 7, 1, 6];
const numberComparator: Comparator<number> = (a, b) => a - b;

const sortedNumbers = heapSort([...numbers], numberComparator);
// assert.deepStrictEqual(sortedNumbers, [1, 2, 3, 4, 5, 6, 7, 8]);
// console.log("✓ Тест 1 пройден: Сортировка чисел");
//
// // Тест 2: Сортировка чисел с отрицательными значениями
// const negativeNumbers = [-5, 3, -8, 4, 0, -2, 7, -1];
// const sortedNegative = heapSort([...negativeNumbers], numberComparator);
// assert.deepStrictEqual(sortedNegative, [-8, -5, -2, -1, 0, 3, 4, 7]);
// console.log("✓ Тест 2 пройден: Сортировка чисел с отрицательными значениями");
//
// // Тест 3: Сортировка строк
// const strings = ["banana", "apple", "cherry", "date", "fig", "elderberry"];
// const stringComparator: Comparator<string> = (a, b) => a.localeCompare(b);
//
// const sortedStrings = heapSort([...strings], stringComparator);
// assert.deepStrictEqual(sortedStrings, ["apple", "banana", "cherry", "date", "elderberry", "fig"]);
// console.log("✓ Тест 3 пройден: Сортировка строк");
//
// // Тест 4: Сортировка строк в обратном порядке
// const reverseStringComparator: Comparator<string> = (a, b) => b.localeCompare(a);
// const sortedStringsReverse = heapSort([...strings], reverseStringComparator);
// assert.deepStrictEqual(sortedStringsReverse, ["fig", "elderberry", "date", "cherry", "banana", "apple"]);
// console.log("✓ Тест 4 пройден: Сортировка строк в обратном порядке");
//
// // Тест 5: Сортировка объектов по возрасту
// interface Person {
//   name: string;
//   age: number;
// }
//
// const people: Person[] = [
//   { name: "John", age: 30 },
//   { name: "Jane", age: 25 },
//   { name: "Bob", age: 35 },
//   { name: "Alice", age: 28 },
//   { name: "Charlie", age: 22 }
// ];
//
// const ageComparator: Comparator<Person> = (a, b) => a.age - b.age;
// const sortedPeople = heapSort([...people], ageComparator);
//
// assert.deepStrictEqual(sortedPeople, [
//   { name: "Charlie", age: 22 },
//   { name: "Jane", age: 25 },
//   { name: "Alice", age: 28 },
//   { name: "John", age: 30 },
//   { name: "Bob", age: 35 }
// ]);
// console.log("✓ Тест 5 пройден: Сортировка объектов по возрасту");
//
// // Тест 6: Сортировка объектов по имени
// const nameComparator: Comparator<Person> = (a, b) => a.name.localeCompare(b.name);
// const sortedPeopleByName = heapSort([...people], nameComparator);
//
// assert.deepStrictEqual(sortedPeopleByName, [
//   { name: "Alice", age: 28 },
//   { name: "Bob", age: 35 },
//   { name: "Charlie", age: 22 },
//   { name: "Jane", age: 25 },
//   { name: "John", age: 30 }
// ]);
// console.log("✓ Тест 6 пройден: Сортировка объектов по имени");
//
// // Тест 7: Пустой массив
// const emptyArray: number[] = [];
// const sortedEmpty = heapSort([...emptyArray], numberComparator);
// assert.deepStrictEqual(sortedEmpty, []);
// console.log("✓ Тест 7 пройден: Пустой массив");
//
// // Тест 8: Массив с одним элементом
// const singleElement = [42];
// const sortedSingle = heapSort([...singleElement], numberComparator);
// assert.deepStrictEqual(sortedSingle, [42]);
// console.log("✓ Тест 8 пройден: Массив с одним элементом");
//
// // Тест 9: Уже отсортированный массив
// const sorted = [1, 2, 3, 4, 5];
// const sortedAlready = heapSort([...sorted], numberComparator);
// assert.deepStrictEqual(sortedAlready, [1, 2, 3, 4, 5]);
// console.log("✓ Тест 9 пройден: Уже отсортированный массив");
//
// // Тест 10: Массив с дубликатами
// const duplicates = [5, 2, 8, 2, 1, 8, 5, 3];
// const sortedDuplicates = heapSort([...duplicates], numberComparator);
// assert.deepStrictEqual(sortedDuplicates, [1, 2, 2, 3, 5, 5, 8, 8]);
// console.log("✓ Тест 10 пройден: Массив с дубликатами");
//
// console.log("\n✅ Все тесты пройдены успешно!");