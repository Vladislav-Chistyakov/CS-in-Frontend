class HashMap {
  #storage
  #maxLength
  #length = 0
  #wm = new WeakMap()
  #countObject = 0

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

    function createIndexFromBoolean () {
      return key ? 1 : 0 
    }

    function createIndexFromString () {
      return key.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % maxLength
    }

    const createIndexFromObject = () => {
      if (this.#wm.has(key)) {
        return this.#wm.get(key)
      } else {
        this.#countObject++
        const index = this.#countObject % maxLength
        this.#wm.set(key, index)
        return index
      }
    }
    
    switch (typeKey) {
      case "number":
        return createIndexFromNumber()
      case "string":
        return createIndexFromString()
      case "boolean":
        return createIndexFromBoolean()
      case "object":
      case "function":
        return createIndexFromObject()
      case "undefined":
      case "symbol":
      case "bigint":
        throw new Error("I can't create index for hash map.")
    }
  }
  
  rehashing (key, value) {
    const oldStorage = this.#storage.filter(item => item);
    // Умножаем велечину стора в 2 раза
    this.#maxLength = this.#maxLength * 2
    
    this.#storage = new Array(this.#maxLength).fill(null);
    
    this.#length = 0
    
    oldStorage.flat().forEach(item => this.set(item.key, item.value))
    
    this.set(key, value)
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
      this.rehashing(key, value)
      return
    }
    
    const hashKey = this.hashFunction(key)
    
    
    if (!this.#storage[hashKey]) {
      this.#storage[hashKey] = [new HashElement(key, value)]
      this.#length++
    } else {
      const searchElement = this.#storage[hashKey].find((item) => item.hasKey(key))
      if (searchElement) {
        searchElement.setValue(value)
      } else {
        this.#storage[hashKey].push(new HashElement(key, value))
        this.#length++
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
      return false
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

    this.#length--

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
  
  get key () {
    return this.#key
  }

  get value () {
    return this.#value
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


const map = new HashMap(10)
const obj1 = {a: 1}
const obj2 = {b: 2}

// строки, числа, объекты
map.set("foo", 99)
map.set(42, 10)
map.set(obj1, "first")
map.set(obj2, "second")

console.log(map.get("foo"))      // 99
console.log(map.get(42))         // 10
console.log(map.get(obj1))       // "first"
console.log(map.has(obj2))       // true
console.log(map.delete(obj1))    // "first"
console.log(map.has(obj1))       // false

// провокация для бага 1
try {
  map.set(undefined, 1)
  console.log("✗ бага не словил — undefined прошёл")
} catch (e) {
  console.log("✓ бросилось:", e.message)
}

