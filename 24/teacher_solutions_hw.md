## Функция take

Необходимо написать функцию, которая принимает любой Iterable объект и количество элементов. Возвращает итератор, который выдаёт указанное количество элементов из исходного итератора.

```javascript
const randomInt = random(0, 100);

console.log([...take(randomInt, 15)]);
```

<details>
<summary><strong>Смотреть решение</strong></summary>

```typescript
function take<T>(
    iterable: Iterable<T>,
    count: number,
): IteratorObject<T> {
    let remaining = count;
    const iter = Iterator.from(iterable);

    return Iterator.from({
        next() {
            if (remaining > 0) {
                remaining--;
                return iter.next();

            } else {
                return { value: undefined, done: true };
            }
        },
    });
}
  
function random(min: number, max: number): IteratorObject<number> {
    return Iterator.from({
        next() {
            return {
                done: false,
                value: Math.floor(Math.random() * (max - min)) + min,
            }
        }
    });
}

const randomInt = random(0, 100);

console.log([...take(randomInt, 15)]);
```

</details>

## Функция filter

Необходимо написать функцию, которая принимает любой Iterable объект и функцию-предикат. Возвращает итератор, который выдаёт только те элементы, которые удовлетворяют предикату.

```javascript
const randomInt = random(0, 100);

console.log([...take(filter(randomInt, (el) => el > 30), 15)]);
```

<details>
<summary><strong>Смотреть решение</strong></summary>

```typescript
function filter<T>(
    iterable: Iterable<T>,
    pred: (value: T) => boolean,
): IteratorObject<T> {
    const iter = Iterator.from(iterable);

    return Iterator.from({
        next() {
            let current = iter.next();

            while (!current.done && !pred(current.value)) {
                current = iter.next();
            }

            return current;
        },
    });
}

function take<T>(
    iterable: Iterable<T>,
    count: number,
): IteratorObject<T> {
    const iter = Iterator.from(iterable);

    let remaining = count;

    return Iterator.from({
        next() {
            if (remaining > 0) {
                remaining--;
                return iter.next();

            } else {
                return { value: undefined, done: true };
            }
        },
    });
}

function random(min: number, max: number): IteratorObject<number> {
    return Iterator.from({
        next() {
            return {
                done: false,
                value: Math.floor(Math.random() * (max - min)) + min,
            }
        }
    });
}

const randomInt = random(0, 100);

console.log([...take(filter(randomInt, (el) => el > 30), 15)]);
```

</details>

##  Функция enumerate

Необходимо написать функцию, которая принимает любой Iterable объект и возвращает итератор по парам `[номер итерации, элемент]`. Нумерация начинается с 0.

```javascript
const randomInt = random(0, 100);

console.log([...take(enumerate(randomInt), 3)]); // [[0, ...], [1, ...], [2, ...]]
```

<details>
<summary><strong>Смотреть решение</strong></summary>

```typescript
function enumerate<T>(
    iterable: Iterable<T>,
): IteratorObject<[number, T]> {
    const iter = Iterator.from(iterable);

    let i = 0;

    return Iterator.from({
        next() {
            const current = iter.next();
            if (current.done) return current;

            return { value: [i++, current.value], done: false };
        },
    });
}

function take<T>(
    iterable: Iterable<T>,
    count: number,
): IteratorObject<T> {
    const iter = Iterator.from(iterable);

    let remaining = count;

    return Iterator.from({
        next() {
            if (remaining > 0) {
                remaining--;
                return iter.next();

            } else {
                return { value: undefined, done: true };
            }
        },
    });
}

function random(min: number, max: number): IteratorObject<number> {
    return Iterator.from({
        next() {
            return {
                done: false,
                value: Math.floor(Math.random() * (max - min)) + min,
            }
        }
    });
}

const randomInt = random(0, 100);

console.log([...take(enumerate(randomInt), 3)]); // [[0, ...], [1, ...], [2, ...]]
```

</details>

## Функция seq

Необходимо написать функцию, которая принимает множество Iterable объектов и возвращает итератор, последовательно выдающий элементы из каждого переданного итератора.

```javascript
console.log([...seq([1, 2], new Set([3, 4]), "bla")]); // [1, 2, 3, 4, 'b', 'l', 'a']
```

<details>
<summary><strong>Смотреть решение</strong></summary>

```typescript
function seq<T extends Iterable<any>[]>(
    ...iterables: T
): IteratorObject<T extends Iterable<infer V>[] ? V : unknown> {
    const iterators = iterables
        .values()
        .map((iterable) => Iterator.from(iterable));

    let iter = iterators.next();

    return Iterator.from({
        next() {
            while (!iter.done) {
                let current = iter.value.next();

                if (!current.done) {
                    return current;
                }

                iter = iterators.next();
            }

            return { value: undefined, done: true };
        },
    });
}

console.log([...seq([1, 2], new Set([3, 4]), "bla")]); // [1, 2, 3, 4, 'b', 'l', 'a']
```

</details>

## Функция mapSeq

Необходимо написать функцию, которая принимает любой Iterable объект и Iterable с функциями. Возвращает итератор, где к каждому элементу левого итератора последовательно применяются все функции из правого итератора.

```javascript
console.log([...mapSeq([1, 2, 3], [(el) => el * 2, (el) => el - 1])]); // [1, 3, 5]
```

<details>
<summary><strong>Смотреть решение</strong></summary>

```typescript
function mapSeq<T>(
    iterable: Iterable<T>,
    mappers: Iterable<(value: T) => T>,
): IteratorObject<T> {
    const iter = Iterator.from(iterable);
    const fns = [...mappers];

    return Iterator.from({
        next() {
            const current = iter.next();
            if (current.done) return current;

            let value = current.value;

            for (const fn of fns) {
                value = fn(value);
            }

            return { value, done: false };
        },
    });
}

console.log([...mapSeq([1, 2, 3], [(el) => el * 2, (el) => el - 1])]); // [1, 3, 5]
```

</details>