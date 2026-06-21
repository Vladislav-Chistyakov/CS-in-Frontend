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
  
  getElementByKey (key) {
    for (let i = 0; i < this.#length; i++) {
      if (this.#storage[i].hasKey(key)) {
        return this.#storage[i];
      }
    }
    return undefined
  }

  set (key, value) {
    if (!this.checkForCompleteness()) {
      return
    }
    
    // Вызываю чтобы получить элемент
    const element = this.getElementByKey(key)
    
    if (!element) {
      this.#storage[this.#length] = new HashElement(key, value, this.#length)
      this.#length++
    } else {
      element.setValue(value)
    }
  }


  get (key) {
    const element = this.getElementByKey(key)
    return !element ? undefined : element.getValue() 
  }

  has (key) {
    const element = this.getElementByKey(key)
    return !!element
  }
  
  delete (key) {
    // Просто нужен элемент (has, get, index)
    const element = this.getElementByKey(key)
    
    if (!element) {
      return undefined
    }
    
    
    const valueElement = element.getValue(key)
    this.#storage[element.index] = null
    let flag = false
    
    for (let index = 0; index < this.#maxLength; index ++) {
      // Флаг показывает, что удаление с перезаписью произошло
      if (flag) {
        this.#storage[index] = this.#storage[index + 1]
        if (this.#storage[index]) {
          this.#storage[index].index = index
        }
        continue
      }
      
      // Удаление еще не произошло, оно происходит тут
      if (index + 1 !== this.#maxLength && this.#storage[index] === null && this.#storage[index + 1]) {
        this.#storage[index] = this.#storage[index + 1]
        this.#storage[index].index = index
        flag = true
      }
      
    }
    
    console.log('this storage ', this.#storage)
    
    this.#length--

    return valueElement
  }
  
  get storage () {
    return this.#storage
  }

  // TODO ключами могут быть приметивы. так и объекты
  // Можно взять любой алгоритм хэш функции
  // Коллизии можно решать через метод цепочек
  // Хэш-таблица должна поддерживать расширение внутреннего буфера.
}

class HashElement {
  #key
  #value
  #index = -1

  constructor(key, value, index) {
    this.#key = key
    this.#value = value
    this.#index = index
  }
  
  get index () {
    return this.#index
  }

  set index (value) {
    this.#index = value
  }

  getValue () {
    return this.#value
  }
  
  setValue (value) {
    this.#value = value
  }

  hasKey (key) {
    return this.#key === key
  }
}


const map = new HashMap(100)
map.set("foo", 1)
map.set("foo", 99)                  // обновление
map.set("zero", 0)
map.set(2, 2)
map.set('3', 3)
console.log(map.get("foo"))         // 99
console.log(map.get("zero"))        // 0  ← главный тест
console.log(map.delete("foo"))      // 99
console.log(map.has("foo"))         // false
console.log(map.storage)
console.log(map.delete(2))
console.log(map.storage)
// console.log(map.delete(document)); // 10
// console.log(map.has(document));    // false
