// Исходный массив должен быть отсортирован по возрасту
const ages = [12, 42, 43, 55, 56];

const users = [
  { age: 12, name: 'Bob' },
  { age: 42, name: 'Ben' },
  { age: 42, name: 'Jack' },
  { age: 42, name: 'Sam' },
  { age: 56, name: 'Bill' }
];

function indexOf<T> (arr: T[], searchElement: number, functionSearch?: Function) {
  let needIndex = -1
  let startIteration = true
  let takeElement = false
  let count = 1

  let left = false
  let right = false

  function sliceDouble (arrSlice: T[], arrow: 'left' | 'right') { // дробим наш массив
    if (arrow === 'left') {
      left = true
      right = false
    } else {
      left = false
      right = true
    }

    const indexSlice = Math.floor(arrSlice.length / 2)
    return left ? arrSlice.slice(0, indexSlice) : arrSlice.slice(indexSlice)
  }

  function checkElement (arr: T[]): T {
    if (left) {
      return arr[arr.length - 1]
    } else {
      return arr[0]
    }
  }

  let middle = arr // Середина слева

  while (!takeElement) {
    if (startIteration) {
      // проверка больше не нужна
      startIteration = false

      // Находим середину в первой интерации
      const sliceArr =  sliceDouble(arr, 'left')
      // Если элемент поиска больше чем последний элемент слева,
      // то нам надо брать середину справа
      if (sliceArr[sliceArr.length - 1] < searchElement) {
        left = false
        right = true
      }

      // Записываем половину левую или правкую
      middle = sliceDouble(arr, left ? 'left' : 'right')
      continue
    }

    const index = middle.length - 1
    const element = checkElement(middle)

    if (element === searchElement) {
      console.log('=== ', element, element === searchElement)
      const currentValue: number = functionSearch ? functionSearch(element) : element as number
      needIndex = element
    } else if (element < searchElement) {
      middle = sliceDouble(middle, 'right')
      console.log(' < ', middle)
    } else {
      middle = sliceDouble(middle, 'left')
      console.log(' >= ', middle)
    }

    if (index === 0 || index === arr.length - 1) {
      takeElement = false
      break
    }

    count++
  }

  return needIndex
}

console.log('indexOf ', indexOf(ages, 100))
// // Поиск по массиву чисел
// indexOf(ages, 42);     // 1
// lastIndexOf(ages, 42); // 3
//
// // Поиск по массиву объектов (по полю age)
// indexOf(users, 42, (item) => item.age);     // 1
// lastIndexOf(users, 42, (item) => item.age); // 3
//
// // Не найдено
// indexOf(ages, 100);     // -1
// lastIndexOf(ages, 100); // -1