// Функция filter
// Необходимо написать функцию, которая принимает любой
// Iterable объект и функцию-предикат.
// Возвращает итератор, который выдаёт только те элементы,
// которые удовлетворяют предикату.

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

const randomInt = random(0, 100);

function filter (iterable, callback) {
  return Iterator.from({
    next() {
      const check = () => iterable.next()
      let i = check()
      do {
        if (i.done) {
          return { done: true, value: undefined }
        }
        if (callback(i.value)) {
          return { done: false, value: i.value }
        }
        i = check()
        continue
      } while (!i.done)

      return { done: false, value: 1 }
    }
  })
}

console.log([...take(filter(randomInt, (el) => el > 30), 3)]);

