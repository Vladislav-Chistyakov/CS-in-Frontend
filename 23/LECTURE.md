# AI конспект для лекции #23

## Проблема: разные коллекции — разные способы обхода

В JavaScript существует множество коллекций: массивы, строки, Map, Set, NodeList, arguments и другие. Для каждой из них
можно перебрать элементы, но у каждой свой способ доступа:

```javascript
const arr = ['a', 'b', 'c'];
for (let i = 0; i < arr.length; i++) {
    console.log(arr[i]);
}

const str = 'hello';
for (const char of str) {
    console.log(char); // h, e, l, l, o
}

const text = 'hello 123 world 456';
let match;
const regex = /\d+/;
while ((match = regex.exec(text)) !== null) {
    console.log(match[0]); // "123", "456"
}

// Object — через for...in (перечисляемые свойства)
const obj = {a: 1, b: 2, c: 3};
for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
        console.log(key, obj[key]);
    }
}
```

Почему так происходит: коллекции по-разному устроены в памяти и на уровне API. Массив — непрерывная область памяти с
доступом по индексу. Строка — последовательность с учётом кодировки. Set — хэш-таблица с уникальными значениями. Map —
хэш-таблица с парами ключ-значение. Для каждой структуры требуется свой способ обхода.

## Решение через forEach

Многие коллекции предоставляют метод `forEach`, который принимает функцию-колбэк и применяет её к каждому элементу:

```javascript
[1, 2, 3].forEach(x => console.log(x));
new Set([1, 2, 3]).forEach(x => console.log(x));
new Map([['a', 1], ['b', 2]]).forEach((v, k) => console.log(k, v));
```

Однако у `forEach` есть ограничения:

1. Нельзя прервать обход (`break`, `return`).
2. Нельзя использовать `await` внутри.
3. Нельзя работать с бесконечными последовательностями.
4. Для каждой коллекции своя сигнатура колбэка (значение, индекс, сам массив — у каждой коллекции по-разному).

Можно реализовать свой `forEach`, который поддерживал бы прерывание и асинхронность, но это привело бы к дублированию
дизайна с циклами.

## Решение через итератор

Более универсальное решение — использовать **итератор**. Итератор — это объект с методом `next()`, который возвращает
`{ value, done }`.

```javascript
// Пример простого итератора
function createRange(start, end) {
    let current = start;
    return {
        next() {
            if (current <= end) {
                return { value: current++, done: false };
            }
            return { done: true };
        }
    };
}

const iterator = createRange(1, 3);
console.log(iterator.next()); // { value: 1, done: false }
console.log(iterator.next()); // { value: 2, done: false }
console.log(iterator.next()); // { value: 3, done: false }
console.log(iterator.next()); // { done: true }
```

Итераторы можно использовать и с циклами.

```javascript
// Массив через итератор
const arr = [1, 2, 3];
const arrIterator = arr.values();
for (let i = arrIterator.next(); !i.done; i = arrIterator.next()) {
    console.log(i.value);
}

// Set через итератор
const set = new Set([1, 2, 3]);
const setIterator = set.values();
for (let i = setIterator.next(); !i.done; i = setIterator.next()) {
    console.log(i.value);
}
```

Теперь обход работает единообразно: мы получаем итератор, вызываем `next()` в цикле и проверяем `done`. Но такой код
громоздкий и захламляет логику — приходится вручную управлять вызовами `next()` и проверкой `done`.

## Синтаксические расширения для работы с итераторами

Чтобы избавиться от рутины, JavaScript предоставляет синтаксический сахар:

1. **`for...of`** — автоматический цикл по итератору.
2. **`...` (spread)** — разворачивание в массив или аргументы.
3. **Деструктуризация** — извлечение значений.

```javascript
// for...of — автоматически вызывает next() до done: true
for (const value of [1, 2, 3]) {
    console.log(value);
}

// Spread — собирает все значения в массив
const arr = [...new Set([1, 2, 2, 3])]; // [1, 2, 3]

// Деструктуризация
const [first, second, ...rest] = 'hello';
console.log(first, second, rest); // 'h', 'e', ['l', 'l', 'o']
```

## Почему for...of ожидает не итератор, а Iterable

Важно понять: `for...of`, spread и другие синтаксические конструкции ожидают не итератор, а **итерируемый объект (Iterable)** — это такой объект, для которого существует стандартный способ создания итератора. Это сделано намеренно, чтобы:

1. **Можно было обходить коллекцию несколько раз** — каждый раз создаётся новый итератор.
2. **Коллекция сама управляла своим обходом** — она знает, как правильно итерировать свои элементы.

```javascript
// for...of работает с массивом (Iterable)
for (const value of [1, 2, 3]) {
    console.log(value);
}
```

### Что такое Iterable (итерируемый объект)

**Итерируемый объект (Iterable)** — это объект, у которого есть метод `Symbol.iterator`, возвращающий итератор. Метод
`Symbol.iterator` вызывается каждый раз, когда нужно начать обход заново (например, при входе в `for...of` или при вызове spread).

```javascript
// Проверка, является ли объект итерируемым
const isIterable = obj => typeof obj?.[Symbol.iterator] === 'function';

console.log(isIterable([]));      // true
console.log(isIterable('hello')); // true
console.log(isIterable(new Set())); // true
console.log(isIterable({}));       // false
```

**Как работает обход через Iterable:**

1. При входе в `for...of` вызывается `collection[Symbol.iterator]()`.
2. Метод возвращает свежий итератор.
3. `for...of` автоматически вызывает `next()` до `done: true`.
4. При повторном обходе создаётся новый итератор.

```javascript
// Каждый for...of создаёт новый итератор
const arr = [1, 2, 3];

for (const value of arr) {
    console.log(value); // 1, 2, 3
}

for (const value of arr) {
    console.log(value); // 1, 2, 3 — обход заново
}
```

### Пример создания итератора в коде

Чтобы объект стал итерируемым, нужно реализовать метод `[Symbol.iterator]`:

```javascript
class MyCollection {
    constructor(data) {
        this.data = data;
    }

    [Symbol.iterator]() {
        let index = 0;
        const data = this.data;

        return {
            next() {
                if (index < data.length) {
                    return {value: data[index++], done: false};
                }
                return {done: true};
            }
        };
    }
}

const collection = new MyCollection([10, 20, 30]);

// Теперь работает for...of
for (const item of collection) {
    console.log(item); // 10, 20, 30
}

// Теперь работает spread
const arr = [...collection]; // [10, 20, 30]

// Теперь работает деструктуризация
const [first, second] = collection;
console.log(first, second); // 10, 20
```

### Итератор тоже должен быть Iterable

**Важно:** итератор, возвращаемый методом `Symbol.iterator`, тоже должен быть итерируемым (иметь свой `Symbol.iterator`,
возвращающий самого себя). Это позволяет использовать итераторы в `for...of` и других конструкциях, хотя на практике
`for...of` чаще работает с коллекциями напрямую.

```javascript
class Range {
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }

    [Symbol.iterator]() {
        let current = this.start;
        const end = this.end;

        const iterator = {
            next() {
                if (current <= end) {
                    return {value: current++, done: false};
                }
                return {done: true};
            },

            [Symbol.iterator]() {
                return this; // итератор сам себя возвращает
            }
        };
        return iterator;
    }
}

const range = new Range(1, 3);
for (const value of range[Symbol.iterator]()) {
    console.log(value); // 1, 2, 3
}
```

### Общая схема работы

```text
Коллекция → [Symbol.iterator]() → Итератор → { next() → { value, done } }
```

1. У коллекции есть метод `Symbol.iterator`.
2. При вызове он возвращает объект-итератор.
3. У итератора есть метод `next()`.
4. `next()` возвращает объект с полями `value` и `done`.
5. Итератор тоже должен быть итерируемым (`[Symbol.iterator]` → `this`).

### Явная работа с итератором для возобновляемого обхода

Иногда нужно управлять итератором вручную, чтобы приостанавливать и возобновлять обход:

```javascript
const iterator = [1, 2, 3, 4, 5][Symbol.iterator]();

// Обрабатываем по одному элементу
const first = iterator.next().value;  // 1
const second = iterator.next().value; // 2
// ... делаем что-то между
const third = iterator.next().value;  // 3
```

## Итераторы как основа API

Итераторы — это не просто механизм обхода коллекций. Это мощный инструмент для проектирования API, который делает код
универсальным и отделяет логику генерации данных от логики их потребления.

Рассмотрим типичную задачу: функция `split`, которая разбивает строку на части. Если мы реализуем её так, что она
возвращает массив, мы навязываем вызывающему коду конкретную структуру данных:

```javascript
function split(str, delimiter) {
    const result = [];
    let current = '';
    for (let i = 0; i < str.length; i++) {
        const char = str[i];
        if (char === delimiter) {
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current);
    return result;
}

// Вызывающий код вынужден работать с массивом
const parts = split('a,b,c', ',');
console.log(parts[0]); // 'a'
console.log(parts[1]); // 'b'
console.log(parts[2]); // 'c'
```

В чём проблема? Мы не знаем, как вызывающий код хочет обрабатывать части строки. Возможно, ему нужно сохранить их в Set,
возможно, обработать по одной без сохранения всех сразу, возможно, записать в файл. Возвращая массив, мы заставляем его
хранить все элементы в памяти, даже если это не нужно.

Если же мы переходим в плоскость итераторов, код становится универсальным. Создаём объект, который реализует
`Symbol.iterator` и возвращает итератор с методом `next()`:

```javascript
function createSplitIterator(str, delimiter) {
    let index = 0;
    let current = '';

    const iterator = {
        next() {
            if (index >= str.length && current === '') {
                return {done: true};
            }

            while (index < str.length) {
                const char = str[index++];
                if (char === delimiter) {
                    const result = {value: current, done: false};
                    current = '';
                    return result;
                }
                current += char;
            }

            const result = {value: current, done: false};
            current = '';
            return result;
        },
        [Symbol.iterator]() {
            return this; // итератор сам себя возвращает
        }
    };

    return iterator;
}
```

Теперь вызывающий код может использовать `for...of`, spread и передавать объект напрямую в конструкторы Set и Map:

```javascript
// for...of
for (const part of createSplitIterator('a,b,c', ',')) {
    console.log(part); // 'a', 'b', 'c'
}

// Spread — собираем в массив
const parts = [...createSplitIterator('a,b,c', ',')];
console.log(parts); // ['a', 'b', 'c']

// Передаём в конструктор Set
const unique = new Set(createSplitIterator('a,b,c', ','));
console.log(unique); // Set {'a', 'b', 'c'}
```

**Ключевая идея:** итератор — это контракт между производителем данных и потребителем. Производитель не знает, как
потребитель будет использовать данные. Потребитель сам решает, какую структуру данных использовать и когда остановиться.
Это делает API гибким и универсальным.

## Ленивость итераторов

Ещё одно важное свойство итераторов — **ленивость**. Значения вычисляются только тогда, когда они запрашиваются через
`next()`.

```javascript
function createNumbersIterator() {
    let i = 0;
    return {
        next() {
            console.log(`Вычисляем значение ${i}`);
            return {value: i++, done: false};
        }
    };
}

const iter = createNumbersIterator();
console.log('Итератор создан, но ничего не вычислено');

console.log(iter.next().value); // 'Вычисляем значение 0', 0
console.log(iter.next().value); // 'Вычисляем значение 1', 1
console.log(iter.next().value); // 'Вычисляем значение 2', 2
// Остановились — остальные значения не вычислялись
```

**Что даёт ленивость:**

1. **Экономия памяти** — не нужно хранить все элементы одновременно.

    ```javascript
    function createRangeIterator(start, end) {
        let current = start;
        return {
            next() {
                if (current <= end) {
                    return {value: current++, done: false};
                }
                return {done: true};
            }
        };
    }
    
    // ❌ Память: весь массив загружается сразу
    function createRangeArray(start, end) {
        const result = [];
        for (let i = start; i <= end; i++) {
            result.push(i);
        }
        return result;
    }
    
    const hugeArray = createRangeArray(0, 1000000); // 1 000 000 чисел в памяти!
    
    // ✅ Память: по одному значению за раз
    const hugeIterator = createRangeIterator(0, 1000000);
    let val = hugeIterator.next();
    while (!val.done) {
        // обрабатываем val.value
        val = hugeIterator.next();
    }
    ```

2. **Работа с бесконечными последовательностями** — можно создавать бесконечные ряды данных, не опасаясь, что память
   закончится.

    ```javascript
    function createFibonacciIterator() {
        let a = 0, b = 1;
        return {
            next() {
                const result = {value: a, done: false};
                [a, b] = [b, a + b];
                return result;
            }
        };
    }
    
    // Берём только первые 10 чисел
    let count = 0;
    const fibIter = createFibonacciIterator();
    let fibItem = fibIter.next();
    while (!fibItem.done && count < 10) {
        console.log(fibItem.value);
        fibItem = fibIter.next();
        count++;
    }
    ```

3. **Прерывание обхода** — потребитель может остановиться в любой момент, и производитель не будет тратить ресурсы на
   вычисление ненужных значений.

    ```javascript
    function createExpensiveIterator() {
        let i = 0;
        return {
            next() {
                console.log(`Вычисляем значение ${i}`);
                return {value: i * i, done: false};
            }
        };
    }
    
    const expIter = createExpensiveIterator();
    console.log(expIter.next().value); // Вычисляем значение 0, 0
    console.log(expIter.next().value); // Вычисляем значение 1, 1
    console.log(expIter.next().value); // Вычисляем значение 2, 4
    // Остановились — остальные значения не вычислялись
    ```

## Композиция итераторов и встроенный API Iterator Helpers

Итераторы можно не только создавать, но и **комбинировать**, строя цепочки преобразований без создания промежуточных массивов. Это позволяет обрабатывать данные лениво: каждое значение проходит через всю цепочку преобразований только тогда, когда оно запрашивается.

### Iterator Helpers (Stage 3)

Современный JavaScript предоставляет встроенные методы для работы с итераторами: `map`, `filter`, `take`, `drop`,
`reduce` и другие. Все эти методы ленивые — они возвращают новый итератор, который вычисляет значения по требованию.

```javascript
// Создаём итератор, генерирующий бесконечную последовательность чисел
function createNumbersIterator() {
    let i = 0;
    return Iterator.from({ // Используем фабрику Iterator.from, чтобы появился встроенный API
        next() {
            return {value: i++, done: false};
        }
    });
}

const numbers = createNumbersIterator();

// Ленивая цепочка: умножаем на 2, оставляем только > 5, берём первые 3
const result = numbers
    .map(x => x * 2)
    .filter(x => x > 5)
    .take(3);

// Значения вычисляются по требованию
for (const value of result) {
    console.log(value); // 6, 8, 10
}
```

### Пример: итератор zip

Напишем свой адаптер `zip`, который объединяет два итератора в один, возвращая пары значений:

```javascript
function createZipIterator(iterable1, iterable2) {
    const iter1 = iterable1[Symbol.iterator]();
    const iter2 = iterable2[Symbol.iterator]();

    return Iterator.from({
        next() {
            const next1 = iter1.next();
            const next2 = iter2.next();

            if (next1.done || next2.done) {
                return {done: true};
            }

            return {value: [next1.value, next2.value], done: false};
        }
    });
}

// Использование с массивами
const names = ['Alice', 'Bob', 'Charlie'];
const ages = [25, 30, 35];

// for...of
for (const [name, age] of createZipIterator(names, ages)) {
    console.log(`${name} is ${age} years old`);
}

// Spread
const pairs = [...createZipIterator(names, ages)];
console.log(pairs); // [['Alice', 25], ['Bob', 30], ['Charlie', 35]]
```

После того как мы создали свой адаптер, его можно комбинировать со встроенными методами:

```javascript
function createZipIterator(iterable1, iterable2) {
    const iter1 = iterable1[Symbol.iterator]();
    const iter2 = iterable2[Symbol.iterator]();

    return Iterator.from({
        next() {
            const next1 = iter1.next();
            const next2 = iter2.next();

            if (next1.done || next2.done) {
                return {done: true};
            }

            return {value: [next1.value, next2.value], done: false};
        }
    });
}

const names = ['Alice', 'Bob', 'Charlie', 'David'];
const ages = [25, 30, 35, 40];

// Фильтруем пары, где возраст больше 30, и берём только имена
const result = createZipIterator(names, ages)
    .filter(([name, age]) => age > 30)
    .map(([name, age]) => name);

for (const name of result) {
    console.log(name); // 'Charlie', 'David'
}
```

### Преимущества композиции

1. **Ленивость** — значения вычисляются только тогда, когда они нужны.
2. **Экономия памяти** — нет промежуточных коллекций.
3. **Читаемость** — цепочки методов читаются как последовательность преобразований.
4. **Универсальность** — работают с любыми итерируемыми объектами.

**Итог:** итераторы позволяют строить API, которые не диктуют потребителю, как хранить и обрабатывать данные. В сочетании с ленивостью это даёт мощный инструмент для работы с данными, который экономит память и позволяет обрабатывать бесконечные последовательности.

## Итоги лекции

- **Проблема** — разные коллекции требуют разных способов обхода. Массивы индексируются по числу, Set и Map имеют свои методы, Object — свои. Это приводит к дублированию кода и усложняет универсальные операции.

- **Решение через forEach** — единый метод для многих коллекций, но с ограничениями: нельзя прервать обход (`break`, `return`), нельзя использовать `await`, для каждой коллекции своя сигнатура колбэка.

- **Решение через итератор** — универсальный интерфейс, где каждый шаг обхода контролируется вручную через `next()`. Однако код становится громоздким из-за необходимости явно вызывать `next()` и проверять `done`.

- **Синтаксические расширения** — `for...of`, spread (`...`), деструктуризация — автоматизируют работу с итераторами, скрывая вызовы `next()` и проверку `done`. Они делают код лаконичным и читаемым.

- **Iterable** — объект, у которого есть метод `[Symbol.iterator]`, возвращающий итератор. Именно Iterable ожидают `for...of`, spread, деструктуризация и конструкторы `Set`, `Map`. Это позволяет коллекциям самим управлять своим обходом и давать возможность обходить себя несколько раз.

- **Итератор** — объект с методом `next()`, возвращающим `{ value, done }`. Итератор тоже должен быть итерируемым (иметь `[Symbol.iterator]`, возвращающий самого себя), чтобы его можно было использовать в `for...of` и других конструкциях.

- **Ленивость** — ключевое свойство итераторов. Значения вычисляются только тогда, когда они запрашиваются через `next()`. Это позволяет экономить память (не хранить все элементы), работать с бесконечными последовательностями и прерывать обход в любой момент без лишних вычислений.

- **Iterator Helpers** — встроенные методы `map`, `filter`, `take`, `drop`, `reduce` и другие, которые позволяют строить ленивые цепочки преобразований над итераторами. Каждый метод возвращает новый итератор, значения из которого вычисляются по требованию, без создания промежуточных коллекций.