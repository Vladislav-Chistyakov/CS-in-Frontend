// Функция enumerate
// Необходимо написать функцию, которая принимает любой Iterable объект и
// возвращает итератор по парам [номер итерации, элемент]. Нумерация начинается с 0.

function take (iterable, count) {
  let indexes = count

  return Iterator.from({
    next() {
      if (indexes > 0) {
        indexes--
        return {value: iterable.next().value, done: false};
      }
      return { done: true, value: undefined };
    }
  })
}

function random (min, max) {
  const randomNumber = () => Math.floor(Math.random() * (max - min + 1)) + min;
  return Iterator.from({
    next() {
      return {value: randomNumber(), done: false};
    }
  })
}

function enumerate (iterable) {
  let i = 0
  return Iterator.from({
    next() {
      return {value: [i++, iterable.next().value], done: false};
    }
  })
}

const randomInt = random(0, 100);

console.log([...take(enumerate(randomInt), 3)]);

