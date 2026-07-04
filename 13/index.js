class HashMap {
  #storage
  #maxLength
  #length = 0
  #countObject = 0
  symb = Symbol('hashId')

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

    const createIndexFromObject = (keyObj) => {
      if (keyObj[this.symb] === undefined) {
        keyObj[this.symb] = this.#countObject % maxLength
        this.#countObject++
      }
      return keyObj[key]
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
        return createIndexFromObject(key)
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
    
    oldStorage.flat().forEach(item => this.set(item.data.key, item.data.value))
    
    this.set(key, value)
  }

  checkForCompleteness () {
    if ((this.#length / this.#maxLength).toFixed(2) >= 0.65) {
      return false
    }
    return true
  }

  set (key, value) {
    if (!this.checkForCompleteness()) {
      this.rehashing(key, value)
      return
    }
    
    const hashKey = this.hashFunction(key)
    
    if (!this.#storage[hashKey]) {
      this.#storage[hashKey] = {
        data: new HashElement(key, value),
        next: null,
      }
      this.#length++
    } else {
      let element = this.#storage[hashKey]
      let isLastElement = false
      
      while (!isLastElement) {
        if (element.data?.hasKey(key)) {
          element.data.setValue(value)
          break
        } else {
          if (element.next === null) {
            isLastElement = true
            element.next = {
              data: new HashElement(key, value),
              next: null,
            }
            this.#length++
            break
          }
          element = element.next
        }
      }
    }
  }


  get (key) {
    const currentElement = this.searchElement(key)
    return currentElement?.element?.data?.getValue()
  }

  has (key) {
    const currentElement = this.searchElement(key)
    return !!currentElement?.element?.data?.hasKey(key)
  }
  
  delete (key) {
    const currentElement = this.searchElement(key)
    
    if (!currentElement?.element) {
      return undefined
    }
    
    const value = currentElement?.element?.data?.getValue()
    
    const hashKey = this.hashFunction(key)

    if (currentElement.prev) {
      currentElement.prev.next = currentElement.element.next 
    } else {
      this.#storage[hashKey] = currentElement.element.next
    }
    

    this.#length--

    return value
  }
  
  searchElement (key) {
    const hashKey = this.hashFunction(key)


    if (!this.#storage[hashKey]) {
      return null
    } else {
      let element = this.#storage[hashKey]
      let prevElement = null
      let isLastElement = false

      while (!isLastElement) {
        if (element.data?.hasKey(key)) {
          return {
            prev: prevElement,
            element: element
          }
        } else {
          if (element.next === null) {
            return {
              prev: prevElement,
              element: null
            }
          }

          prevElement = element
          element = element.next
        }
      }
    }
  }
  
  get storage () {
    return this.#storage
  }
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


const map = new HashMap(20)
const obj1 = () => {a: 1}
const obj2 = {b: 2}

// строки, числа, объекты
map.set("foo", 99)
map.set("oof", 2)
map.set(obj1, "first")
map.set(obj2, "second")

console.log(map.get("foo"))
console.log(map.get(42))
console.log(map.storage)
console.log(map.get(obj1))
console.log(map.has(obj1))

map.set("zero", 0)
console.log(map.get("zero"))           // ожидаем 0, баг 1 даст undefined

map.set("foo", 1)
map.set("oof", 2)                       // в той же цепочке
console.log(map.delete("never-was-here-but-bucket-not-empty"))
// если хэш этого ключа совпадёт с хэшем "foo" — баг 2 → крах

try {
  map.set(undefined, 1)
  console.log("✗ бага не словил — undefined прошёл")
} catch (e) {
  console.log("✓ бросилось:", e.message)
}

