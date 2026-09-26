// Сжатие строки
// Необходимо написать функцию, которая принимала бы строку и
// "схлопывала" бы все подряд идущие повторения.
//   const myReplace = str.replace(regex, "");
//   const regex = new RegExp(/(\w)\1*/g);
// console.log(zipStr('abbaabbafffbezza')); // abafbeza


// Hello, Bob! Your age is 10.
// const res = format('Hello, ${user}! Your age is ${age}.', {user: 'Bob', age: 10});
//
// function format (text: string, params: object): string {
//   const map = new Map()
//   for (const [key, value] of Object.entries(params)) {
//     map.set(key, value)
//   }
//
//   const rex = new RegExp(/\$\{.+?}/g)
//   const rexPattern = new RegExp(/[${}]/g)
//
//   return text.replace(rex, function (x) {
//     const key = x.replace(rexPattern, "")
//     if (map.has(key)) {
//       return map.get(key)
//     }
//     return ""
//   })
// }
//
// console.log('RES ', res)


calc(`
Какой-то текст (10 + 15 - 24) ** 2
Еще какой то текст 2 * 10
`) == `
Какой-то текст 1
Еще какой-то текст 20`

function calc(text: string): string {
  const mathPattern = new RegExp(/(\+|-|\*|\*\*|\/|%)/g)

  const mathSymb = '( )?(\+|-|\*|\*\*|\/|%)( )?'


  const ops = /(?:\+|-|\*\*?|\/|%)/; // символы операций (+, -, *, **, /, %)
  const num = /\d+/;                 // числа
  const space = /\s*/;               // возможные пробелы

  const combinedOr = new RegExp(`(?:${num.source})|( ?:${ops.source} )`, 'g');

  // const skobkiPattern = new RegExp(/\(\d+( (\+|-|\*|\*\*|\/|%) \d+)+\)()?( (\+|-|\*|\*\*|\/|%) \d+)+/g)
  const skobkiPattern = new RegExp(/\(\d+( (\+|-|\*|\*\*|\/|%) \d+)+\)()?( (\+|-|\*|\*\*|\/|%) \d+)+/g)
  console.log('check-pattern', text.replace(combinedOr, '_'))
  return ''
}

const t = '2+4'
console.log(Number(t))

console.log(new Function('return (10 + 15 - 24) ** 2')())