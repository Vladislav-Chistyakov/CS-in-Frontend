class HashMap {
  #storage
  #maxLength
  #length = 0

  constructor(lengthHashMap) {
    this.#storage = new Array(lengthHashMap).fill(null);
    this.#maxLength = lengthHashMap;
  }
  
  hashFunction (key) {
    const typeKey = typeof key
    const maxLength = this.#maxLength
    
    function createIndexFromNumber () {
      return key % maxLength
    }

    function createIndexFromString () {
      return key.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % maxLength
    }
    
    switch (typeKey) {
      case "number":
        return createIndexFromNumber()
      case "string":
        return createIndexFromString()
      case "undefined":
      case "object":
      case "boolean":
      case "function":
      case "symbol":
      case "bigint":
        throw new Error("I can't create index for hash map.")
    }
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
    const index = this.hashFunction(key)
    if (this.#storage[index]) {
      return this.#storage[index]
    }

    return undefined
  }

  set (key, value) {
    if (!this.checkForCompleteness()) {
      return
    }
    
    const hashKey = this.hashFunction(key)
    
    
    if (!this.#storage[hashKey]) {
      this.#storage[hashKey] = [new HashElement(key, value)] 
    } else {
      const searchElement = this.#storage[hashKey].find((item) => item.hasKey(key))
      if (searchElement) {
        searchElement.setValue(value)
      } else {
        this.#storage[hashKey].push(new HashElement(key, value))
      }
    }
  }


  get (key) {
    const arrayElements = this.getElementByKey(key)
    if (!arrayElements) {
      return undefined
    }
    const searchElement = arrayElements.find((item) => item.hasKey(key))
    return !searchElement ? undefined : searchElement.getValue() 
  }

  has (key) {
    const arrayElements = this.getElementByKey(key)
    if (!arrayElements) {
      return undefined
    }
    return !!arrayElements.find((item) => item.hasKey(key))
  }
  
  delete (key) {
    const arrayElements = this.getElementByKey(key)
    
    if (!arrayElements) {
      return undefined
    }

    const element = arrayElements.find((item, index) => item.hasKey(key))
    const needIndex = arrayElements.findIndex((item, index) => item.hasKey(key))
    
    const value = element.getValue(key)
    
    const hashKey = this.hashFunction(key)
    
    this.#storage[hashKey].splice(needIndex, 1)
    
    if (this.#storage[hashKey].length === 0) {
      this.#storage[hashKey] = null
    }

    return value
  }
  
  get storage () {
    return this.#storage
  }
  
  
  // Так так так
  // индекс хэш элемента это 
  // num =(полученный ключ в виде числа, надо его еще в число привести)
  // num % maxLength = допустим будет 42
  // index нашего элемента в хэш таблице будет = 42
}

class HashElement {
  #key
  #value

  constructor(key, value) {
    this.#key = key
    this.#value = value
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
map.set("foo", 99)
map.set('ofo', 10)     // ← коллизия! "ofo" и "foo" дают одинаковый char-code sum
map.set("foo", 88)     // ← обновление, а не вставка

console.log(map.get("foo"))   // ← вернёт 88 (не 99 как в комменте), потому что обновили

console.log(map.delete("foo"))   // ← вернёт 88 (не 99 как в комменте), потому что обновили
console.log(map.delete("ofo"))   // ← вернёт 88 (не 99 как в комменте), потому что обновили

// console.log(map.has(42))       // false
console.log('hash ', map.storage)
