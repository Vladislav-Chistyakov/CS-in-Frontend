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
}

const matrix = new Matrix(Uint8Array, 10, 10);  // 10×10, значения 0-255

class Graph {
  #matrix
  
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
}

// Заполняем матрицу смежности
const graph = new Graph(matrix);

// Добавляем ребро между двумя узлами (с опциональным весом)
graph.addArc(7, 2, 1);

// Проверяем смежность двух узлов (с учётом направленности)
console.log('edge ', graph.hasEdge(7, 2));      // Для неориентированного графа
console.log('arc ', graph.hasArc(7, 2));       // Для ориентированного графа (направление важно)
console.log('arc ', graph.hasArc(2, 7));       // Для ориентированного графа (направление важно)
graph.checkMatrix()


// Удаляем ребро между двумя узлами
// graph.removeEdge(7, 2);

// Добавляем дугу (для ориентированного графа)
// graph.addArc(7, 2, weight);

// Удаляем дугу
// graph.removeArc(7, 2);