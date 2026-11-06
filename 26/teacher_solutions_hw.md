## Фабрика парсеров take

Необходимо написать функцию-парсер, которая принимает функцию или регулярное выражение и возвращает парсер, считывающий символы, подходящие под условие.
Функция должна настраиваться опциональными параметрами min и max для указания минимального и максимального количества считываемых символов.

```typescript
const takeNumber = take(/\d/)("1234 foo");

console.log(takeNumber); // ['1234', Iterator]

const takeNumber2 = take(/\d/, { max: 2 })("1234 foo");

console.log(takeNumber2);  // ['1234', Iterator]
```

<details>
<summary><strong>Смотреть решение</strong></summary>

```typescript
import type { Parser } from "./types.ts";

export interface TakeOptions {
    min?: number;
    max?: number;
}

export function take(
    pred: ((char: string, escaped: boolean) => boolean) | RegExp,
    { min = 1, max = Infinity }: TakeOptions = {}
): Parser<string> {
    const test = pred instanceof RegExp ? (char: string) => pred.test(char) : pred;

    return (iter) => {
        let result = "";

        let count = 0;

        let escaped = false;

        while (count < max) {
            const char = iter.peek();

            if (char == null || !test(char, escaped)) {
                if (count >= min) {
                    break;
                }

                throw new Error(`Expected at least ${min} matching characters, got ${count}`);
            }

            result += char;
            escaped = escaped ? false : char == '\\';

            count++;
            iter.next();
        }

        return [result, iter];
    };
}
```

</details>

## Простой парсер JSON

Необходимо описать простой парсер JSON-грамматики, используя парсерные комбинаторы. Можно не поддерживать пробельные символы и сложные числа.

[Смотреть решение](https://gist.github.com/kobezzza/ca1da09be2f5fe0c03cda844b374d164)