## Контейнер Result

Необходимо написать контейнер Result с двумя состояниями: Ok и Err.

```typescript
const res1 = new Result(() => 42);

res1.then((data) => {
    console.log(data); // 42
});

const res2 = new Result(() => {
    throw "Boom!";
});

res2.then((data) => {
    // Этот callback не вызовется
    console.log(data);
}).catch((err) => {
    console.error(err); // Boom!
});
```

<details>
<summary><strong>Смотреть решение</strong></summary>

```typescript
class Result<T> {
    static resolve<T>(value: T | Result<T>): Result<T> {
        if (value instanceof Result) {
            return value;
        }

        return new Result(() => value);
    }

    #value?: T;
    #reason?: unknown;
    readonly #state: number = 0;

    constructor(fn: () => T) {
        try {
            const value = fn();

            if (value instanceof Result) {
                value
                    .then((value) => { this.#value = value; })
                    .catch((reason) => { this.#reason = reason; });

            } else {
                this.#value = value;
            }

            this.#state = 1;

        } catch (reason) {
            this.#reason = reason;
        }
    }

    then<U>(onOk: (v: T) => U, onError?: (err: unknown) => U): Result<U> {
        if (this.#state === 1) {
            return new Result(() => onOk(this.#value!));
        }

        return new Result<U>(() => {
            if (onError) {
                return onError(this.#reason);
            }

            throw this.#reason;
        });
    }

    catch(onError: (err: unknown) => T): Result<T> {
        if (this.#state === 0) {
            return new Result(() => onError(this.#reason));
        }

        return new Result(() => this.#value);
    }
}
```

</details>

## async/await для Result

Необходимо, используя генераторы, создать аналог async/await для контейнера Result.

```typescript
exec(function* main() {
    const res1 = new Result(() => 42);
    console.log(yield res1); // 42

    try {
       const res2 = yield new Result(() => {
          throw "Boom!";
       });
    } catch (err) {
       console.error(err); // Boom!
    }
});
```

<details>
<summary><strong>Смотреть решение</strong></summary>

```typescript
class Result<T> {
    static resolve<T>(value: T | Result<T>): Result<T> {
        if (value instanceof Result) {
            return value;
        }

        return new Result(() => value);
    }

    #value?: T;
    #reason?: unknown;
    readonly #state: number = 0;

    constructor(fn: () => T) {
        try {
            const value = fn();

            if (value instanceof Result) {
                value
                    .then((value) => { this.#value = value; })
                    .catch((reason) => { this.#reason = reason; });

            } else {
                this.#value = value;
            }

            this.#state = 1;

        } catch (reason) {
            this.#reason = reason;
        }
    }

    then<U>(onOk: (v: T) => U, onError?: (err: unknown) => U): Result<U> {
        if (this.#state === 1) {
            return new Result(() => onOk(this.#value!));
        }

        return new Result<U>(() => {
            if (onError) {
                return onError(this.#reason);
            }

            throw this.#reason;
        });
    }

    catch(onError: (err: unknown) => T): Result<T> {
        if (this.#state === 0) {
            return new Result(() => onError(this.#reason));
        }

        return new Result(() => this.#value);
    }
}

function exec(genFn: () => Generator<Result<unknown>>): Result<unknown> {
    const iter = genFn();

    const step = ({ done, value }: IteratorResult<unknown>) => {
        if (done) {
            return Result.resolve(value);
        }

        return Result.resolve(value).then(
            (value) => step(iter.next(value)),
            (reason) => step(iter.throw(reason)),
        );
    };

    try {
        return step(iter.next());

    } catch (reason) {
        return new Result(() => {
            throw reason;
        });
    }
}

exec(function* main() {
    const res1 = new Result(() => 42);
    console.log(yield res1); // 42

    try {
        const res2 = yield new Result(() => {
            throw "Boom!";
        });
    } catch (err) {
        console.error(err); // Boom!
    }
});
```

</details>