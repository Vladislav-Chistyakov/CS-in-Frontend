// Поток для извлечения чисел из строк
// Необходим реализовать КА, который считывает
// числа (number) из потока входных данных.
// Если поток данных иссяк, КА должен выбрасывать исключение и переходить
// в состояние ожидания новых данных.

function* getNumbers (str: string) {
  const numberRegex = /(-?\.?\b)(\d+(\.\d+)?)\b/g;
  let copyString = str

  function parseString () {
    const iteratorNumbers = copyString.matchAll(numberRegex)
    let myNumber = iteratorNumbers.next()

    // console.log('myNumber.value', myNumber.value)
    if (myNumber.value) {
      copyString = copyString.replace(myNumber.value?.[0], "")
      return myNumber.value?.[0]
    } else {
      copyString = ''
    }
  }

  while (copyString) {
    const value = parseString()
    if (value) {
      const answer = (yield value) as string;

      if (answer) {
        copyString = answer;
      }
    } else {
      return;
    }
  }
}

const numbers = getNumbers("1000.30 hello world 42");
// console.log(numbers.next())
// console.log(numbers.next())
// console.log(numbers.next())

try {
  console.log(numbers.next())
  console.log(numbers.next())
  console.log(numbers.next("1000500 awesome 42"))
  console.log(numbers.next())
  console.log(numbers.next())
  console.log(numbers.next())
} catch (err) {
  // Expecting new input
  console.log(err);
  // console.log(numbers.next("1000500 awesome 42")); // { value: 1000500, done: false }
}