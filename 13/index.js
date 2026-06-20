class HashMap {
  #storage
  #maxLength
  #length = 0

  constructor(lengthHashMap) {
    this.#storage = new Array(lengthHashMap).fill(null);
    this.#maxLength = lengthHashMap;
  }

  checkForCompleteness () {
    if ((this.#length / this.#maxLength).toFixed(2) >= 0.65) {
      console.log('Надо сделать перехеширование')
      return false
    }
    console.log('Все нормально, данные можно записывать')
    return true
  }
  
  checkHasKeyInHashMap (key) {
    for (let i = 0; i < this.#length; i++) {
      if (this.#storage[i].checkIsHasKey(key)) {
        const element = this.#storage[i];
        return {
          get: element.getValueInKey(key),
          has: element.checkIsHasKey(key),
          element: element,
          index: i
        }
      }
    }
    return undefined
  }

  set (key, value) {
    if (!this.checkForCompleteness()) {
      return
    }
    
    const element = this.checkHasKeyInHashMap(key)?.element
    
    if (!element) {
      this.#storage[this.#length] = new HashElement(key, value)
      this.#length++
    } else {
      element.set(value)
    }
  }


  get (key) {
    return this.checkHasKeyInHashMap(key)?.get
  }

  has (key) {
    return !!this.checkHasKeyInHashMap(key)
  }
  
  delete (key) {
    const element = this.checkHasKeyInHashMap(key)
    
    const valueElement = element.get
    
    if (element.has) {
      this.#storage[element.index] = null
      this.#storage = this.#storage.filter(item => !!item)
      this.#length--
      for (let i = this.#length; i < 120; i++) {
        this.#storage[i] = null
      }
      return valueElement
    }
    return undefined
  }

  // TODO ключами могут быть приметивы. так и объекты
  // Можно взять любой алгоритм хэш функции
  // Коллизии можно решать через метод цепочек
  // Хэш-таблица должна поддерживать расширение внутреннего буфера.
}

class HashElement {
  #key
  #value

  constructor(key, value) {
    this.#key = key
    this.#value = value
  }

  getValueInKey (key) {
    if (this.#key !== key) return false

    return this.#value
  }
  
  set (value) {
    this.#value = value
  }

  checkIsHasKey (key) {
    return this.#key === key
  }
}


const map = new HashMap(120)
map.set("foo", 1)
map.set("foo", 99)                  // обновление
map.set("zero", 0)
console.log(map.get("foo"))         // 99
console.log(map.get("zero"))        // 0  ← главный тест
console.log(map.delete("foo"))      // 99
console.log(map.has("foo"))         // false
// console.log(map.delete(document)); // 10
// console.log(map.has(document));    // false
