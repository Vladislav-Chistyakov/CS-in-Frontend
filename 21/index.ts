// ## Требования:
//
// Локальная часть (до @): латинские буквы, цифры, точки, подчёркивания, дефисы
// Домен (после @): латинские буквы, цифры, дефисы, точка
// Доменная зона: от 2 до 6 букв (например, .com, .ru, .org)

const emailRegex = /\w+@\w+\.\w{2,6}/;

console.log(emailRegex.test("user@example.com"));   // true
console.log(emailRegex.test("test@mail.ru"));       // true
console.log(emailRegex.test("user123@domain.org")); // true
console.log(emailRegex.test("@domain.org"));        // false
console.log(emailRegex.test("invalid-email"));      // false
console.log(emailRegex.test("user@.com"));          // false
console.log(emailRegex.test("user@domain"));        // false
console.log(emailRegex.test("user@domain.c"));      // false

// Целые числа: 42, -5, 0
// Числа с плавающей точкой: 3.14, -0.5, .5
// Не должны захватывать числа внутри слов (например, version2 — не число)

const numberRegex = /(-?\.?\b)(\d+(\.\d+)?)\b/g;
const textNumber = "The price is 100.4 dollars, -0.51 .7 degrees, and version2 is out. 9123 02 8";

const numbers = textNumber.match(numberRegex);
console.log(numbers); // [ '100.4', '-0.51', '.7', '9123', '02', '8' ]


// ## Необходимо написать регулярное выражение, которое находит все даты в формате DD.MM.YYYY или YYYY-MM-DD.
//
//   Требования:
//
// - Формат 1: 15.01.2025 (день.месяц.год)
// - Формат 2: 2025-01-15 (год-месяц-день)
// - День: 01–31, месяц: 01–12, год: 1900–2099

const year = '(19|20)\\d{2}'
const month = '(0[1-9]|1[0-2])'
const day = '(3[01]|[12]\\d|0[1-9])'
const dateRegex = new RegExp(`${day}\\.${month}\\.${year}|${year}-${month}-${day}`, 'g')
const text = "Today is 15.01.2025 and tomorrow is 2025-01-16. Invalid: 32.13.2025";

const dates = text.match(dateRegex);
console.log(dates); // ["15.01.2025", "2025-01-16"]