// Функция take
// Необходимо написать функцию, которая принимает любой
// Iterable объект и количество элементов.
// Возвращает итератор, который выдаёт указанное количество
// элементов из исходного итератора.

function random (min, max) {
  const randomNumber = () => Math.floor(Math.random() * (max - min + 1)) + min;
  return Iterator.from({
    next() {
      return {value: randomNumber(), done: false};
    }
  })
}


const randomInt = random(0, 100);

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

// Цепочка адаптеров
console.log([...take(randomInt, 3)]); // [6, 12, 18]
