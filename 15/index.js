// Пример использования
class Matrix {
  #typeArray
  #width
  #height
  #buffer
  #arrayMatrix

  constructor(typeArray, width, height) {
    this.#typeArray = typeArray
    this.#width = width
    this.#height = height

    this.createMatrix()
  }

  createMatrix () {
    this.#buffer = new ArrayBuffer(this.#width * this.#height * this.#typeArray.BYTES_PER_ELEMENT)
    this.#arrayMatrix = new this.#typeArray(this.#buffer)
  }
  
  getIndex (row, col) {
    return (row * this.#width + col) 
  }
  
  get (row, col) {
    return this.#arrayMatrix[this.getIndex(row, col)]
  }
  
  set (row, col, weight) {
    this.#arrayMatrix[this.getIndex(row, col)] = weight
  }
  
  checkArray() {
    console.log('ARR ', this.#arrayMatrix)
  }
  
  get width () {
    return this.#width
  }
}

const matrix = new Matrix(Uint8Array, 10, 10);  // 10×10, значения 0-255

class Graph {
  #matrix
  #boundariesPassed = []
  
  constructor(matrix) {
    this.#matrix = matrix
  }

  addEdge(row, col, weight) {
    this.#matrix.set(row, col, weight)
    this.#matrix.set(col, row, weight)
  }

  addArc(row, col, weight) {
    this.#matrix.set(row, col, weight)
  }

  removeEdge(row, col) {
    this.#matrix.set(row, col, 0)
    this.#matrix.set(col, row, 0)
  }

  removeArc(row, col) {
    this.#matrix.set(row, col, 0)
  }

  hasEdge(row, col) {
    return !!this.#matrix.get(row, col) && !!this.#matrix.get(col, row)
  }

  hasArc(row, col) {
    return !!this.#matrix.get(row, col)
  }
  
  checkMatrix () {
    this.#matrix.checkArray()
  }

  traverse (row, callback) {
    this.bypassingConnections(row, callback, 1)
    this.#boundariesPassed = []
  }

  bypassingConnections (row, callback, countDepth) {
    // Цикл заканчивается когда мы прошлись по всему элементу, связи закончились

    // TODO Переписать на set
    for (let i = 0; i < this.#matrix.width; i++) {
      // Если элемент вершины имеет связь с i то заходим
      if (this.hasArc(row, i) && !this.checkItemBoundariesPassed(row)) {
        console.log('ROW ', row, ' Col ', i)
        this.#boundariesPassed.push(row)

        callback({ id: i, weight: this.#matrix.get(row, i)}, countDepth)

        this.bypassingConnections(i, callback, countDepth + 1)
      }
    }

    // console.log('this.#boundariesPassed ', this.#boundariesPassed)
  }

  // Это функция для проверки элемента в BoundariesPassed
  // Если элемент есть, то выводим правду, иначе лож
  checkItemBoundariesPassed (row) {
    return this.#boundariesPassed.some((item) => item === row)
  }
}

// Заполняем матрицу смежности
const graph = new Graph(matrix);

// Добавляем ребро между двумя узлами (с опциональным весом)
graph.addEdge(7, 2, 72);
graph.addEdge(1, 2, 12);
graph.addEdge(1, 3, 13);
// graph.addEdge(2, 3, 23);
graph.addEdge(2, 4, 24);
graph.addEdge(2, 6, 26);
graph.addEdge(3, 5, 35);
graph.addEdge(3, 7, 37);

// Проверяем смежность двух узлов (с учётом направленности)
console.log('edge ', graph.hasEdge(7, 2));      // Для неориентированного графа
console.log('arc ', graph.hasArc(7, 2));       // Для ориентированного графа (направление важно)
console.log('arc ', graph.hasArc(2, 7));       // Для ориентированного графа (направление важно)
graph.checkMatrix()

graph.traverse(1, (node, depth) => {
  console.log(`Узел: ${node.id}, глубина: ${depth}, вес ребра: ${node.weight}`);
});


// Удаляем ребро между двумя узлами
// graph.removeEdge(7, 2);

// Добавляем дугу (для ориентированного графа)
// graph.addArc(7, 2, weight);

// Удаляем дугу
// graph.removeArc(7, 2);