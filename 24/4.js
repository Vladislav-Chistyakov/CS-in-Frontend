// Функция seq
// Необходимо написать функцию, которая принимает
// множество Iterable объектов и возвращает итератор,
// последовательно выдающий элементы из каждого переданного итератора.

function isIterable(obj) {
  return obj != null && typeof obj[Symbol.iterator] === 'function'
}

function seq (...iterables) {
  let i = 0
  let values = []
  let valuesIndex = 0

  return Iterator.from({
    next() {
      if (valuesIndex < values.length) {
        return { value: values[valuesIndex++], done: false }
      }

      while (i < iterables.length) {
        const current = iterables[i]
        i++
        valuesIndex = 0

        values = isIterable(current) ? [...current] : []

        if (values.length > 0) {
          return { value: values[valuesIndex++], done: false }
        }
      }

      return { value: undefined, done: true }
    }
  })
}

console.log([...seq([1, 2], [], [], new Map(), undefined, 123, new Set([3, 4]), "bla")]); // [1, 2, 3, 4, 'b', 'l', 'a']
