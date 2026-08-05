// Ассоциативный массив на основе бинарного дерева поиска
// Реализуйте класс TreeMap для создания ассоциативного массива (ключ → значение)
// на основе обычного бинарного дерева поиска (без балансировки).

class TreeMap {
  #root: TreeNode | null = null;

  root () {
    return this.#root;
  }

  set (key: string, value: number) {
    if (!this.#root) {
      this.#root = new TreeNode(key, value);
      return
    }

    // Если root уже создан, то создаем ветку в дереве от корня
    this.createNodeInBranch(key, value)
  }

  createNodeInBranch (key: string, value: number) {
    if (!this.#root) {
      return
    }
    this.#root.createNode(key, value)
  }

  iWantToKnowWhatWithThree () {
    if (this.#root) {
      console.log('getThreeNode', this.#root.getThreeNode())
    }
  }
}

class TreeNode {
  #key: string = ''
  #value: number | null = null
  #left: TreeNode | null = null
  #right: TreeNode | null = null

  constructor(key: string, value: number) {
    this.#key = key
    this.#value = value
  }

  createNode (key: string, value: number) {
    if (this.#key > key) {
      this.#left = new TreeNode(key, value)
    } else {
      this.#right = new TreeNode(key, value)
    }
  }

  getThreeNode () {
    return [this.#key, this.#value]
  }

  hasKey () {
    return this.#key
  }

  hasLeft () {
    return this.#left
  }

  hasRight () {
    return this.#right
  }
}

const map = new TreeMap();

map.set("banana", 6);
map.set("apple", 7);
map.set("cherry", 8);
map.set("date", 9);
map.set("grape", 10);
map.set("orange", 11);
map.set("strawberry", 4);
map.set("juice", 5);

console.log(map.iWantToKnowWhatWithThree());   // [["banana", 3], ["apple", 2], ["cherry", 5], ["date", 1]]

// console.log(map.get("apple"));     // 2
// console.log(map.has("banana"));    // true
// console.log(map.keys());           // ["apple", "banana", "cherry", "date"]

// map.delete("cherry");
// console.log(map.entries());
// [["apple", 2], ["banana", 3], ["date", 1]]