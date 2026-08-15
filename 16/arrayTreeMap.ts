// Ассоциативный массив на основе бинарного дерева поиска
// Реализуйте класс ArrayTreeMap для создания
// ассоциативного массива на основе плоского массива, используя формулы для хранения узлов:


class ArrayTreeMap {
  #array
  #root: [key: number, val: string] | undefined

  constructor(size: number) {
    this.#array = new Array(size);

  }

  set(key: number, val: string) {
    if (!this.#root) {
      this.#root = [key, val]
      return
    }
  }

  get(key: number) {
    if (!this.#root) {
      return undefined
    }

    if (this.#root[0] === key) {
      return this.#root[1]
    }
  }
}

const map = new ArrayTreeMap(16);

map.set(10, "A");
// map.set(5, "B");
// map.set(15, "C");
// map.set(3, "D");
// map.set(7, "E");

console.log(map.get(10));           // "A"
// console.log(map.keys());           // [3, 5, 7, 10, 15]
// console.log(map.getIndex(10));     // 0
// console.log(map.getIndex(7));      // 4