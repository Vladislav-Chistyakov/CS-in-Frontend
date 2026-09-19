## Сжатие строки

Необходимо написать функцию, которая бы принимала бы строку и "схлопывала" бы все подряд идущие повторения.

```js
console.log(zipStr('abbaabbafffbezza')); // abafbeza
```

<details>
<summary><strong>Смотреть решение</strong></summary>

```js
console.log(zipStr("abbaabbafffbezza")); // abafbeza

function zipStr(str) {
    let prev;

    do {
        prev = str;
        str = str.replaceAll(/(.+)\1+/g, "$1");
    } while (str.length !== prev.length);

    return str;
}
```

</details>

## Простой шаблонизатор

Необходимо написать функцию, которая принимает строковый шаблон и объект параметров, и возвращает результат применения данных к этому шаблону.

```js
// Hello, Bob! Your age is 10.
const res = format('Hello, ${user}! Your age is ${age}.', {user: 'Bob', age: 10});
```


<details>
<summary><strong>Смотреть решение</strong></summary>

```js
console.log(format("Hello, ${user}! Your age is ${age}.", { user: "Bob", age: 10 }));

function format(str, vars) {
    const regex = /\$\{(.+?)}/g
    return str.replaceAll(regex, (_, name) => vars[name]);
}
```

</details>

## Вычисление выражений в строке

Необходимо написать функцию, которая находит арифметические операции в строке и заменяет на результат вычислений.

```js
calc(`
Какой-то текст (10 + 15 - 24) ** 2
Еще какой то текст 2 * 10
`) == `
Какой-то текст 1
Еще какой-то текст 20
`
```

<details>
<summary><strong>Смотреть решение</strong></summary>

```js
console.assert(calc(`
Какой-то текст (10 + 15 - 24) ** 2
Еще какой то текст 2 * 10
`),  `
Какой-то текст 1
Еще какой-то текст 20
`)

function calc(str) {
    return str.replaceAll(/[(\d-][-+*/\d() ]*[\d)]/g, (expr) => {
        try {
            return Function(`return ${expr}`)();

        } catch {
            return expr;
        }
    });
}
```

</details>