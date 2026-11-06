
## debounce

Необходимо написать функцию, которая принимает другую функцию и возвращает её debounce-версию.

```js
function laugh() {
    console.log("Ha-ha!");
}

const debouncedLaugh = debounce(laugh, 300);

debouncedLaugh();
debouncedLaugh();
debouncedLaugh();
debouncedLaugh();
debouncedLaugh(); // Выполнится через 300 мс
```

<details>
<summary><strong>Смотреть решение</strong></summary>

```js
function debounce(fn, delay) {
    let timer = null;

    return (...args) => {
        if (timer !== null) {
            clearTimeout(timer);
        }

        timer = setTimeout(fn, delay, ...args);
    };
}

function laugh(phrase) {
    console.log(phrase);
}

const debouncedLaugh = debounce(laugh, 300);

debouncedLaugh("Ha-ha!");
debouncedLaugh("He-he!");
debouncedLaugh("Hi-hi!"); // Hi-hi!
```

</details>

## throttle

Необходимо написать функцию, которая принимает другую функцию и возвращает её throttle-версию.

```js
function laugh() {
    console.log("Ha-ha!");
}

const throttledLaugh = throttle(laugh, 300);

throttledLaugh(); // Выполнится сразу
throttledLaugh();
throttledLaugh();
throttledLaugh();
throttledLaugh(); // Выполнится через 300 мс
```

<details>
<summary><strong>Смотреть решение</strong></summary>

```js
function throttle(fn, delay) {
    let timer = null;
    let lastCallArgs = null;

    return (...args) => {
        if (timer) {
            lastCallArgs = args;
            return;
        }

        fn(...args);

        timer = setTimeout(() => {
            timer = null;

            if (lastCallArgs !== null) {
                fn(...lastCallArgs);
                lastCallArgs = null;
            }
        }, delay);
    };
}

const laugh = (phrase) => {
    console.log(phrase);
};

const throttledLaugh = throttle(laugh, 300);

throttledLaugh("Ha-ha!"); // Ha-ha!
throttledLaugh("Ha-ha!");
throttledLaugh("Ha-ha!");
throttledLaugh("Ha-ha!");
throttledLaugh("He-he!"); // He-he!
```

</details>

## waterfall для callback-функций

Необходимо создать функцию для композиции асинхронного кода на callback-функциях, которая работает как показано на примере.

```js
waterfall([
    (cb) => {
        // Первый аргумент cb — это ошибка.
        // Если она не null, выполнение сразу должно переводиться на финальный callback.
        cb(null, "one", "two");
    },

    (arg1, arg2, cb) => {
        console.log(arg1); // one
        console.log(arg2); // two
        cb(null, "three");
    },

    (arg1, cb) => {
        console.log(arg1); // three
        cb(null, "done");
    }
], (err, result) => {
    console.log(result); // done
});

waterfall(new Set([
    (cb) => {
        cb("ha-ha!");
    },

    (arg1, cb) => {
        cb(null, "done");
    }
]), (err, result) => {
    console.log(err);    // ha-ha!
    console.log(result); // undefined
});
```

<details>
<summary><strong>Смотреть решение</strong></summary>

```js
function waterfall(iterable, handler) {
    const iter = Iterator.from(iterable);

    let current = iter.next();

    if (current.done) {
        return handler(undefined, undefined);
    }

    const cb = (err, ...args) => {
        if (err != null) {
            return handler(err, undefined);
        }

        current = iter.next();

        if (current.done) {
            return handler(null, ...args);
        }

        current.value(...args, cb);
    };

    current.value(cb);
}

waterfall([
    (cb) => {
        // Первый аргумент cb — это ошибка.
        // Если она не null, выполнение сразу должно переводиться на финальный callback.
        cb(null, "one", "two");
    },

    (arg1, arg2, cb) => {
        console.log(arg1); // one
        console.log(arg2); // two
        cb(null, "three");
    },

    (arg1, cb) => {
        console.log(arg1); // three
        cb(null, "done");
    }
], (err, result) => {
    console.log(result); // done
});

waterfall(new Set([
    (cb) => {
        cb("ha-ha!");
    },

    (arg1, cb) => {
        cb(null, "done");
    }
]), (err, result) => {
    console.log(err);    // ha-ha!
    console.log(result); // undefined
});
```

</details>