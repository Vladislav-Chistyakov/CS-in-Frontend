# AI конспект для лекции #28

## Что такое ошибка в языке программирования?

**Ошибка** — это нарушение фундаментальных контрактов системы. Синтаксические ошибки, нарушение контрактов работы с
памятью, нехватка памяти. Как правило, единственно верный способ обработки таких ошибок — завершить процесс.

```javascript
// Синтаксическая ошибка — программа даже не запустится
function foo() { // забыли закрывающую скобку
    console.log("Hello");

// Ошибка памяти — приложение упадёт
const arr = [];
while (true) {
    arr.push(new Array(1000000));
}
```

## Что такое исключение?

**Исключение** — это исключительная ситуация работы функции. Некритические локальные нарушения контрактов, например, при
работе с IO (файловая система, сеть). В отличие от фатальных ошибок, исключения можно и нужно обрабатывать.

```javascript
function divide(a, b) {
    if (b === 0) {
        // Исключительная ситуация — throw
        throw "Деление на ноль";
    }
    // Нормальный результат — return
    return a / b;
}

try {
    const result = divide(10, 0);
    console.log(result); // Не выполнится
} catch (err) {
    console.error("Ошибка:", err); // Деление на ноль
}
```

**Ключевая идея:** исключения позволяют отделить нормальный поток выполнения от обработки ошибок. Код, который может
вызвать ошибку, не обязан знать, как её обрабатывать — он просто "бросает" исключение, а тот, кто знает, как её
обработать, перехватывает его.

## Проблема возврата специальных значений

Иногда возникает ситуация, когда функция должна вернуть "пустое" значение: элемент не найден, файл уже существует, ник
занят. В JS можно возвращать разные типы из функций, но это плохое решение.

### Специальные константы в JS

Язык предоставляет специальные константы для обозначения исключительных ситуаций:

| Константа   | Назначение                        |
|-------------|-----------------------------------|
| `NaN`       | Число, которое не число           |
| `null`      | Объект, который не объект         |
| `undefined` | Значение, у которого нет значения |
| `-1`        | Индекс массива, которого нет      |
| `""`        | Строка, в которой нет символов    |
| `[]`        | Массив, в котором нет элементов   |

**Насколько это хорошее решение?** Зависит от ситуации. Если можно вернуть значение, не нарушающее инвариантов (
например, пустой массив), это вполне хорошее решение. А вот с `null`, `undefined` или `NaN` проблема — их легко забыть
обработать, они часто не видны на уровне типов.

```javascript
// Хорошо — возвращаем безопасное значение
function getItems() {
    const data = fetchData();
    return data?.items ?? []; // пустой массив вместо null
}

// Плохо — возвращаем null
function getItems() {
    const data = fetchData();
    return data?.items ?? null; // Нужно проверять
}

const items = getItems();
// items — всегда массив, можно вызывать .map
items.forEach(item => console.log(item)); // безопасно
```

### Проблема с NaN

```javascript
const value = parseInt("abc"); // NaN

// NaN не равен самому себе
if (value === NaN) {
// Никогда не выполнится
}

// Правильно
if (Number.isNaN(value)) {
    console.log("Это NaN");
}
```

## Механизм исключений в JavaScript

Исключения — это отдельный способ вернуть значение из функции с помощью оператора `throw`. Тип данных, возвращаемых
через `throw`, может быть любым. С помощью `throw` можно описать все исключительные ситуации.

**throw похож на return, но с нюансами:**

- Получить значение, выброшенное через `throw`, можно только с помощью `try-catch`.
- Если значение не обработано, оно всплывает выше по иерархии вызовов.
- Ошибки (не исключения) таким образом отловить зачастую нельзя.
- При кодогенерации (eval) некоторые ошибки становятся исключениями.

```javascript
function level1() {
    level2();
}

function level2() {
    level3();
}

function level3() {
    throw "Ошибка на уровне 3";
}

try {
    level1();
} catch (err) {
    console.log("Поймали на верхнем уровне:", err);
}
```

## Классы ошибок

В `throw` можно передать любое значение, но удобнее всего использовать специальные объекты ошибок. В JS есть специальный
класс `Error` и множество его подклассов. Можно создавать свои классы от `Error`. Удобный API и метаинформация для
отладки.

```javascript
import * as fs from "node:fs";

function readFile(filePath) {
    if (!fs.existsSync(filePath)) {
        throw new Error(`Файл не найден: ${filePath}`);
    }

    try {
        return fs.readFileSync(filePath, "utf-8");
    } catch (err) {
        if (err.code === "EACCES") {
            throw new Error(`Нет доступа к файлу: ${filePath}`);
        }
        throw new Error(`Ошибка чтения файла: ${filePath} — ${err.message}`);
    }
}

try {
    const data = readFile("./config.json");
    console.log("Файл прочитан:", data);
} catch (err) {
    console.error("Ошибка:", err.message);
    console.log("Стек:", err.stack);
}
```

### Ошибки-обёртки

Иногда удобно создать отдельный тип ошибок и оборачивать им другие. Хороший паттерн — хранить "исходную" ошибку в
`cause`.

```javascript
try {
    try {
        const data = JSON.parse("{ invalid }");
    } catch (err) {
        throw new Error("Ошибка парсинга JSON", {cause: err});
    }
} catch (err) {
    console.log(err.message, err.cause);
}
```

### AggregateError

`AggregateError` позволяет группировать несколько ошибок в одну.

```javascript
const errors = [
    new Error("Ошибка 1"),
    new Error("Ошибка 2"),
    new Error("Ошибка 3"),
];

try {
    throw new AggregateError(errors, "Множественные ошибки");
} catch (err) {
    console.log("Сообщение:", err.message);
    console.log("Все ошибки:", err.errors);
}
```

## finally

Иногда нужно выполнить код в любом случае, например, закрыть соединение с БД. В JS есть конструкция `finally`.

```javascript
let db = null;

try {
    db = openConnection();
    // работа с БД
} catch (err) {
    console.error("Ошибка:", err);
} finally {
    // Выполнится всегда
    if (db) {
        db.close();
    }
}

// finally без catch
try {
    riskyOperation();
} finally {
    try {
        cleanup();
    } catch {
    }
}
```

## using

Новое ключевое слово `using` (ES2024, поддерживается в TS 5.2+ и Node.js) позволяет создавать переменные с вызываемыми
деструкторами. Деструктор вызовется автоматически, как только переменная перестанет быть доступной (выйдет из области
видимости).

```javascript
const getResource = () => {
    return {
        [Symbol.dispose]: () => {
            console.log("Destroy");
        }
    };
};

{
    using resource = getResource();
    console.log("...");
    throw new Error("Boom");
} // Деструктор вызовется автоматически
```

### Особенности using

- Работает похожим образом на `const`.
- Как только переменная покинет область видимости, будет вызван автоматический деструктор.
- Если в коде сработает исключение, деструктор всё равно вызовется.
- Деструкторы будут вызываться в порядке стека.
- Исключения в деструкторах не мешают другим деструкторам.
- Исключение в деструкторе не может заменить явное исключение в самом коде.

```javascript
class Resource {
    constructor(name) {
        this.name = name;
    }

    [Symbol.dispose]() {
        console.log(`${this.name} очищен`);
    }
}

class BrokenResource {
    [Symbol.dispose]() {
        throw new Error("Ошибка очистки");
    }
}

try {
    using a = new Resource("A");
    using b = new BrokenResource(); // Деструктор упадёт
    using c = new Resource("C");
    throw new Error("Основная ошибка");
} catch (err) {
// Ошибка деструктора
    console.log(err.error.message); // Ошибка очистки
}
```

## Нестандартное использование исключений

Исключения можно использовать как способ управления потоком выполнения, создавая аналог `goto`.
Иногда это удобно (например, с генераторами), но старайтесь избегать такого подхода.

```javascript
function findDeep(node, predicate) {
    try {
        traverse(node, predicate);
    } catch (found) {
        return found;
    }
    return null;

    function traverse(node, predicate) {
        if (predicate(node)) {
            throw node;
        }
        for (const child of node.children) {
            traverse(child, predicate);
        }
    }
}
```

## Исключения в асинхронном коде

JS изначально был спроектирован как однопоточный синхронный язык. Среды могут добавлять примитивы для асинхронного кода,
но встроенный механизм исключений не умеет с этим работать нормально.

```javascript
// ❌ Не сработает — try-catch не перехватывает исключения в setTimeout
try {
    setTimeout(() => {
        throw new Error("Ошибка");
    }, 100);
} catch {
    console.log("Не поймали");
}

// ✅ Правильно — catch внутри setTimeout
setTimeout(() => {
    try {
        throw new Error("Ошибка");
    } catch (err) {
        console.log("Поймали", err);
    }
}, 100);
```

### Обработка через аргумент callback

Популярный паттерн в Node.js: первый аргумент callback — всегда `null` или ошибка. Минусы: много синтаксического шума,
сложно выстраивать композиции (callback hell).

```javascript
import * as fs from "node:fs";

// Ад колбэков
fs.readFile("file1.txt", (err1, data1) => {
    if (err1) return console.error(err1);
    fs.readFile("file2.txt", (err2, data2) => {
        if (err2) return console.error(err2);
        fs.readFile("file3.txt", (err3, data3) => {
            if (err3) return console.error(err3);
            // обработка data1, data2, data3
        });
    });
});
```

## Событийный подход

Вместо передачи колбэков аргументами, используется специальное API:

- `on` — добавляет обработчик на событие.
- `off` — отменяет обработку.
- `emit` — запускает все обработчики по типу события.

```javascript
class EventEmitter {
    constructor() {
        this.events = new Map();
    }

    on(eventName, callback) {
        if (!this.events.has(eventName)) {
            this.events.set(eventName, []);
        }
        this.events.get(eventName).push(callback);
    }

    off(eventName, callback) {
        if (!this.events.has(eventName)) return;
        const listeners = this.events.get(eventName);
        const index = listeners.indexOf(callback);
        if (index !== -1) {
            listeners.splice(index, 1);
        }
    }

    emit(eventName, ...args) {
        if (!this.events.has(eventName)) return;
        for (const callback of this.events.get(eventName)) {
            callback(...args);
        }
    }
}
```

### События и асинхронный код

Модель событий работает как с синхронным, так и с асинхронным кодом. Многие асинхронные API работают именно таким
образом. Преимущество в том, что события могут повторяться (например, пользователь может нажимать на кнопку много раз).

### События для ошибок

События можно использовать для универсальной обработки ошибок. Один объект может испускать одно или несколько событий
ошибки.

### uncaughtException и window.onerror

В Node.js есть событие `uncaughtException` для обработки любых необработанных исключений. В противном случае такое
исключение экстренно завершит всю работу процесса. В браузере есть похожее событие `error`.

```javascript
// Node.js
process.on("uncaughtException", (err) => {
    console.error("Необработанная ошибка:", err.message);
    console.log("Стек:", err.stack);
});

setTimeout(() => {
    throw new Error("Ошибка без try-catch");
}, 1000);
```

```javascript
// Браузер
window.addEventListener("error", (event) => {
    console.error("Ошибка:", event.message);
    console.log("Файл:", event.filename);
    console.log("Строка:", event.lineno);
    console.log("Колонка:", event.colno);
});

setTimeout(() => {
    throw new Error("Ошибка без try-catch");
}, 1000);
```

## Минусы исключений

- Нельзя понять, бросает ли функция исключение, не прочитав её код.
- Исключения разрушают нормальный поток исполнения.
- Исключения сложно компоновать (цепочки вычислений).
- Полноценно не работают с асинхронным кодом.
- Единственный кейс, где они оправданы, — тот, где их не надо обрабатывать.

## Контейнерные типы как альтернатива

Вместо того чтобы возвращать просто данные, оборачиваем их в специальный контейнер. Контейнер содержит данные и
дополнительный контекст (например, что произошла ошибка или данных нет). Доступ к данным осуществляется через API
контейнера.

### Контейнер Result

```typescript
type Result<T, E = Error> =
    | { ok: true; value: T }
    | { ok: false; error: E };

function parseJSON(str: string): Result<unknown> {
    if (!str) {
        return {ok: false, error: new Error("Пустая строка")};
    }
    try {
        return {ok: true, value: JSON.parse(str)};
    } catch (err) {
        return {ok: false, error: err as Error};
    }
}

// Использование — только через API контейнера
const result = parseJSON('{"name": "Vue"}');

if (result.ok) {
    console.log("Данные:", result.value);
} else {
    console.error("Ошибка:", result.error.message);
}
```

### Контейнер Option

```typescript
type Option<T> =
    | { some: true; value: T }
    | { some: false };

function findUser(id: number): Option<User> {
    const user = users.find((u) => u.id === id);
    return user
        ? {some: true, value: user}
        : {some: false};
}

const user = findUser(42);

if (user.some) {
    console.log(user.value.name);
} else {
    console.log("Пользователь не найден");
}
```

### Контейнер Promise

`Promise` — это тоже контейнер, который может быть resolved (успех) или rejected (ошибка). Он предоставляет API для
работы с результатом асинхронной операции.

```javascript
import * as fs from "node:fs/promises";

function readConfig() {
    const readFile = (path) => fs.readFile(path, {encoding: "utf8"});

    return readFile("/etc/app/config.json")
        .catch(() => readFile("/~/.config/app.json"))
        .catch(() => readFile("config.json"))
        .then((content) => {
            if (content.trim().length > 0) {
                return content;
            }
            throw "Empty config";
        })
        .then(JSON.parse)
        .catch(() => ({})); // Дефолтные настройки
}

readConfig().then(console.log);
```

## Преимущества контейнеров

- Используется `return`, больше не нужен `throw`.
- Нельзя "случайно" забыть обработать исключение — всё равно придётся работать через API контейнера.
- Хорошо дружится с TS — не нужно читать код, чтобы понять, что у значения есть контекст.
- Одинаковая работа как для синхронного, так и для асинхронного кода.
- Можно строить цепочки вычислений (map, flatMap, chain).

## Подводим итоги

- **Ошибки** — нарушение фундаментальных контрактов системы (синтаксис, память). Единственный способ — завершить
  процесс.
- **Исключения** — некритические локальные нарушения контрактов. Можно и нужно обрабатывать через `try-catch`.
- **throw** — оператор для генерации исключений. В отличие от `return`, исключение всплывает по стеку вызовов.
- **Классы ошибок** — `Error`, `TypeError`, `RangeError`, `AggregateError`. Можно создавать свои с полем `cause`.
- **finally** — блок, выполняющийся всегда (очистка ресурсов).
- **using** — новое ключевое слово для автоматического освобождения ресурсов (`Symbol.dispose`). Работает как RAII.
- **Исключения в асинхронном коде** — не работают через try-catch на уровне вызова. Нужны колбэки, события или
  `async/await`.
- **Событийный подход** — универсальный механизм для обработки ошибок в асинхронном коде. Используется в браузере и
  Node.js.
- **Контейнерные типы** (`Result`, `Option`, `Promise`) — альтернатива исключениям. Возвращают упакованное значение с
  контекстом, явно указывая на успех или ошибку.