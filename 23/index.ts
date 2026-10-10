
function random (startNumber: number, endNumber: number) {
  return Iterator.from({
    next () {
      const randomNumber = Math.floor(Math.random() * (endNumber - startNumber + 1)) + startNumber
      return { value: randomNumber, done: false };
    }
  })
}

// const randomInt = random(0, 100);
// console.log(randomInt.next().value); // Случайное число от 0 до 100

class RangeCode {
  readonly #start: number | string
  readonly #end: number | string
  isEnd = false

  constructor(startCode: number | string, endCode: number | string) {
    if (typeof startCode !== typeof endCode) {
      this.#start = '';
      this.#end = '';
      new Error(`Invalid code: ${startCode} ${endCode}`);
    }

    this.#start = startCode;
    this.#end = endCode;
  }

  [Symbol.iterator] (reverse = false): Iterator<string | number> {
    const isReverse = reverse
    let start = isReverse ? this.#end : this.#start;
    let end = isReverse ? this.#start : this.#end;
    let theEnd = false

    if (typeof start === "string" && typeof end === "string") {
      return {
        next () {
          if (theEnd) {
            return { value: undefined, done: true };
          }

          if (typeof start === "string") {
            let startSymbol: string = start;

            const codeValue = startSymbol.charCodeAt(0)
            start = String.fromCharCode(codeValue + 1)

            if (startSymbol === end) {
              theEnd = true
            }

            return { value: startSymbol, done: false };
          }

          return { value: undefined, done: true };
        }
      }
    } else if (typeof this.#start === "number" && typeof this.#end === "number") {
      return {
        next () {
          if (theEnd) {
            return { value: undefined, done: true };
          }

          if (typeof start === "number") {
            let startNumber = start;
            start = isReverse ? start - 1 : start + 1

            if (startNumber === end) {
              theEnd = true
            }

            return { value: startNumber, done: false };
          }

          return { value: undefined, done: true };
        }
      }
    } else {
      return {
        next() {
          return { value: undefined, done: true }
        }
      }
    }
  }

  reverse () {
    return {
      [Symbol.iterator]: () => this[Symbol.iterator](true)
    }
  }
}

// const symbolRange = new RangeCode("a", "f");
// const numberRange = new RangeCode(-5, 1);

// console.log(Array.from(symbolRange)); // ["a", "b", "c", "d", "e", "f"]
// console.log(Array.from(numberRange.reverse())); 1, 0, -1, -2, -3, -4, -5]

function* querySelectorAllLazy(classElement: string, body: HTMLElement) {
  let count = 0

  const elements = body.querySelectorAll(classElement);

  if (count === elements.length) {
    return { value: undefined, done: true };
  }

  while (count + 1 !== elements.length) {
    yield elements[count]
    count++
  }

  return elements[count]
}

const iter = querySelectorAllLazy(".item", document.body);

console.log(iter.next().value); // Первый элемент с классом .item
console.log(iter.next().value); // Второй элемент
console.log(iter.next().value); // Третий элемент
console.log(iter.next().value); // Четверый элемент
console.log(iter.next().value); // Последнего нет, undefined
