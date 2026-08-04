// Ассоциативный массив на основе бинарного дерева поиска
// Реализуйте класс TreeMap для создания ассоциативного массива (ключ → значение)
// на основе обычного бинарного дерева поиска (без балансировки).

class TreeMap {
  #arrayThree: [string, number][] = []

  constructor () {
  }

  set (key: string, value: number) {
    const length = this.#arrayThree.length
    this.#arrayThree[length] = [key, value]
  }

  getLastChild () {
    return this.#arrayThree[this.#arrayThree.length - 1]
  }

  entries () {
    return this.#arrayThree
  }

  keys() {
    return this.#arrayThree.map(item => item[0])
  }
}

const map = new TreeMap();

map.set("banana", 6);
map.set("apple", 7);
map.set("cherry", 8);
map.set("date", 9);
map.set("grape", 10);
map.set("orange", 11);
map.set("cherry", 4);
map.set("juice", 5);

console.log(map.entries());   // [["banana", 3], ["apple", 2], ["cherry", 5], ["date", 1]]

// console.log(map.get("apple"));     // 2
// console.log(map.has("banana"));    // true
console.log(map.keys());           // ["apple", "banana", "cherry", "date"]

// map.delete("cherry");
// console.log(map.entries());
// [["apple", 2], ["banana", 3], ["date", 1]]