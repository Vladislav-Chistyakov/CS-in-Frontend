## Итератор по случайным числам

Необходимо написать функцию-генератор для создания итератора, генерирующего случайные числа в заданном диапазоне.

```js
const randomInt = random(0, 100);

console.log(randomInt.next().value); // Случайное число от 0 до 100
console.log(randomInt.next().value);
console.log(randomInt.next().value);
console.log(randomInt.next().value);
```

<details>
<summary><strong>Смотреть решение</strong></summary>

```js
const randomInt = random(0, 100);

console.log(randomInt.next().value); // Случайное число от 0 до 100
console.log(randomInt.next().value);
console.log(randomInt.next().value);
console.log(randomInt.next().value);

function random(from, to) {
    return {
        [Symbol.iterator]() {
            return this;
        },

        next() {
            return {
                done: false,
                value: Math.floor(Math.random() * (to - from) + from),
            };
        },
    };
}
```

</details>

## Итератор по диапазонам значений

Необходимо написать класс Range, который позволяет создавать диапазоны чисел или символов и обходить элементы Range с любого конца.

```js
const symbolRange = new Range("a", "f");

console.log(Array.from(symbolRange)); // ["a", "b", "c", "d", "e", "f"]

const numberRange = new Range(-5, 1);

console.log(Array.from(numberRange.reverse())); // [1, 0, -1, -2, -3, -4, -5]
```

<details>
<summary><strong>Смотреть решение</strong></summary>

```js
class Range {
    static convert = {
        String: {
            from: (v) => v.codePointAt(0),
            into: (v) => String.fromCodePoint(v),
        },

        Date: {
            from: (v) => v.getTime(),
            into: (v) => new Date(v),
        },

        default: {
            from: (v) => v,
            into: (v) => v,
        }
    }

    #a;
    #start;

    #b;
    #end;

    #step;
    #into;

    constructor(a, b, step = 1) {
        const getType = (value) => /\[object (.*?)]/.exec(({}.toString).call(value))[1];

        const typeA = getType(a);
        const typeB = getType(b);

        if (typeA !== typeB) {
            throw new TypeError(`Type mismatch: expected "${typeA}", got "${typeA}" and "${typeB}"`);
        }

        const converter = Range.convert[typeA] ?? Range.convert.default;

        this.#a = a;
        this.#start = converter.from(a);

        this.#b = b;
        this.#end = converter.from(b);

        this.#step = step * (this.#start > this.#end ? -1 : 1);
        this.#into = converter.into;
    }

    [Symbol.iterator]() {
        let current = this.#start;
        const end = this.#end;

        const step = this.#step;
        const into = this.#into;

        return {
            [Symbol.iterator]() {
                return this;
            },

            next: () => {
                const done = step > 0 ? current > end : current < end;

                if (done) {
                    return { value: undefined, done };
                }

                const value = into(current);
                current += step;

                return { value, done };
            },
        };
    }

    reverse() {
        return new Range(this.#b, this.#a, this.#step);
    }
}

const symbolRange = new Range("a", "f");

console.log(Array.from(symbolRange)); // ["a", "b", "c", "d", "e", "f"]

console.log(Array.from(symbolRange.reverse())); // [ 'f', 'e', 'd', 'c', 'b', 'a' ]

const numberRange = new Range(-5, 1);

console.log(Array.from(numberRange.reverse())); // [1, 0, -1, -2, -3, -4, -5]
```

</details>

## Итератор по DOM с селектором

Необходимо написать функцию-итератор для поиска DOM-узлов, начиная с заданного, по CSS-селектору. Функция должна работать лениво и не запускать поиск сразу по всему DOM-дереву, а выполнять его по мере необходимости (при каждом вызове next()).

```js
const iter = querySelectorAllLazy(".item", document.body);

console.log(iter.next().value); // Первый элемент с классом .item
console.log(iter.next().value); // Второй элемент

// Поиск продолжается только при вызове next()
```

<details>
<summary><strong>Смотреть решение</strong></summary>

```js
function querySelectorAllLazy(selector, source) {
    const treeWalker = document.createTreeWalker(
        source,
        NodeFilter.SHOW_ELEMENT,
        {
            acceptNode(node) {
                return node.matches(selector) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
            },
        },
    );

    return {
        [Symbol.iterator]() {
            return this;
        },

        next() {
            const value = treeWalker.nextNode();
            return { value, done: value == null };
        },
    };
}
```

</details>