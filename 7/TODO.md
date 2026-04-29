# UTF-8 Array Encoding (CS Lesson 7)

## Задача

Реализовать бинарную сериализацию массива строк UTF-8.

Формат данных:


[count: uint32]
[len: uint32][bytes...]
[len: uint32][bytes...]
...


---

## Ключевая идея

Ты работаешь не со строками, а с байтами в памяти.

- ArrayBuffer — сырая память
- DataView — чтение/запись чисел
- Uint8Array — работа с байтами

---

## Инструменты

### ArrayBuffer

```js
const buffer = new ArrayBuffer(size);
DataView
const view = new DataView(buffer);

view.setUint32(offset, value);
view.getUint32(offset);
Uint8Array
new Uint8Array(buffer, offset, length);
TextEncoder / TextDecoder
const encoder = new TextEncoder();
const decoder = new TextDecoder();

const bytes = encoder.encode("hello");
const str = decoder.decode(bytes);
Важно

Длина строки НЕ равна длине в байтах.

Пример:

"мир".length === 3
UTF-8 байт = 6
План решения
encodeStrings(strings)
Посчитать размер buffer
totalSize = 4 + sum(4 + byteLength(str))
Запись данных
offset = 0

записать количество строк (uint32)
offset += 4

для каждой строки:
  записать длину (uint32)
  offset += 4

  записать байты строки
  offset += длина
decodeStrings(buffer)
прочитать количество строк

идти по buffer:
  читать длину
  читать строку
at(index)

Алгоритм:

если index < 0:
  index = length + index

offset = 4

для i от 0 до length:
  прочитать длину

  если i === index:
    прочитать строку и вернуть

  иначе:
    offset += длина
Подводные камни
Пустая строка
length = 0 → вернуть ""
offset

Главный источник ошибок. Если ошибся — всё ломается.

Индексы
at(-1) → последний элемент
Мини тест

Вход:

["A"]

В памяти:

[1][1][65]
Как думать

Ты не пишешь обычный JS.

Ты:

проектируешь бинарный формат
управляешь памятью
считаешь байты
Каркас кода
class Utf8Array {
  constructor(buffer) {
    // TODO: прочитать количество строк
  }

  at(index) {
    // TODO: пройтись по buffer и вернуть строку
  }
}

function encodeStrings(strings) {
  // TODO: посчитать размер и записать данные
}

function decodeStrings(buffer) {
  // TODO: пройтись по всем элементам
}
Стратегия выполнения
Реализовать encodeStrings
Реализовать decodeStrings
Реализовать at
Проверить крайние случаи
Итог

Ты:

работаешь с памятью
создаёшь бинарный формат
учишься мыслить как низкоуровневый разработчик

Это сложно — и это нормально


---

Теперь это:
- ✔ нормальный `.md`
- ✔ без визуального мусора
- ✔ можно спокойно читать оффлайн

Если хочешь — могу сделать **ещё более короткую “шпаргалку на 1 экран”** для поезда.