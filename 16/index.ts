// Ассоциативный массив на основе бинарного дерева поиска
// Реализуйте класс TreeMap для создания ассоциативного массива (ключ → значение)
// на основе обычного бинарного дерева поиска (без балансировки).

class TreeMap {
  #root: TreeNode | null = null;

  // get на root
  root () {
    return this.#root;
  }

  // функция set для изменения node
  set (key: string, value: number) {
    if (!this.#root) {
      this.#root = new TreeNode(key, value);
      return
    }

    // Если root уже создан, то создаем ветку в дереве от корня
    this.createNodeInBranch(this.#root, key, value)
  }

  get (key: string): number | null {
    if (!this.#root) {
      return null
    }

    if (this.#root.getKey() === key) {
      return this.#root.getValue()
    }

    const node = this.getNodeInThree(this.#root, key)

    if (node && node.node && node.node.getKey() === key) {
      return node.node.getValue()
    }
    return null
  }


  has (key: string): boolean {
    if (!this.#root) {
      return false
    }

    if (this.#root.getKey() === key) {
      return this.#root.hasKey()
    }

    const node = this.getNodeInThree(this.#root, key)

    if (node && node.node && node.node.getKey() === key) {
      return node.node.hasKey()
    }

    return false
  }

  // Проход по дереву
  getNodeInThree (lastNode: TreeNode, key: string): { node: TreeNode, lastNode: TreeNode } | { node: null, lastNode: TreeNode } {
    // Если ключ родителя больше чем новый ключ
    // То идем влево, иначе вправо
    const node = lastNode.getKey() > key
      ? lastNode.getLeft()
      : lastNode.getRight()

    if (node && node.getKey() === key) {
      return { node, lastNode };
    } else if (node && node.getKey() !== key) {
      return this.getNodeInThree(node, key);
    }

    return { node: null, lastNode };
  }

  createNodeInBranch (lastNode: TreeNode, key: string, value: number) {
    if (lastNode.getKey() === key) {
      lastNode.setValue(value)
      return;
    }

    const nodes = this.getNodeInThree(lastNode, key)

    // Если node null, то создаем node
    if (!nodes.node && nodes.lastNode) {
      nodes.lastNode.createNode(key, value)
      return;
    } else if (nodes.node) {
      if (nodes.node.getKey() === key) {
        nodes.node.setValue(value)
      }
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

  getLeft () {
    return this.#left
  }

  getRight () {
    return this.#right
  }

  getKey () {
    return this.#key
  }

  setValue (value: number) {
    this.#value = value
  }

  getValue () {
    return this.#value
  }

  hasKey () {
    return !!this.#key
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

console.log(map.get("apple"));     // 7
console.log(map.has("banana"));    // true
// console.log(map.keys());           // ["apple", "banana", "cherry", "date"]

// map.delete("cherry");
// console.log(map.entries());
// [["apple", 2], ["banana", 3], ["date", 1]]