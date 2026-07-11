// Исходный массив должен быть отсортирован по возрасту
const ages = [12, 42, 42, 42, 56];

const users = [
  { age: 12, name: 'Bob' },
  { age: 42, name: 'Ben' },
  { age: 42, name: 'Jack' },
  { age: 42, name: 'Sam' },
  { age: 56, name: 'Bill' }
];

function indexOf<T> (arr: T[], searchElement: number, functionSearch?: (item: T) => number) {
  let needIndex = -1

  // Получаем number элемента T
  const getValue = (item: T): number => functionSearch ? functionSearch(item) : (item as unknown as number)

  // У меня есть индексы самый левый и самый правый
  let left = 0
  let right = arr.length - 1
  let center = Math.floor(right / 2)
  const searchCenter = () => {
    center = left + Math.floor((right - left) / 2)
  }

  let middle = arr

  while (left <= right) {
    searchCenter()
    if (getValue(middle[center]) < searchElement) {
      left = center + 1
    } else if (getValue(middle[center]) > searchElement) {
      right = center - 1
    } else {
      needIndex = center
      right = center - 1
    }
  }

  return needIndex
}

function lastIndexOf<T> (arr: T[], searchElement: number, functionSearch?: (item: T) => number) {
  let needIndex = -1

  // Получаем number элемента T
  const getValue = (item: T): number => functionSearch ? functionSearch(item) : (item as unknown as number)

  // У меня есть индексы самый левый и самый правый
  let left = 0
  let right = arr.length - 1
  let center = Math.floor(right / 2)
  const searchCenter = () => {
    center = left + Math.floor((right - left) / 2)
  }

  let middle = arr
  let i = 0
  while (left <= right && i < 3) {
    i++
    searchCenter()
    if (getValue(middle[center]) < searchElement) {
      left = center + 1
    } else if (getValue(middle[center]) > searchElement) {
      right = center - 1
    } else {
      needIndex = center
      left = center + 1
    }
  }

  return needIndex
}


const N = 100_00
const arrForJob = new Array(N).fill(0)
for (let i = 0; i < N; i++) { arrForJob[i] = i }



const searchElement = 14567

for (let i = 0; i < 10_000; i++) {
  indexOf(arrForJob, searchElement)
}

let t1, t2
t1 = performance.now()
indexOf(arrForJob, searchElement)
t2 = performance.now()
console.log(`benchmark for my indexOf - `, t2 - t1)


for (let i = 0; i < 10_000; i++) {
  arrForJob.indexOf(searchElement)
}
t1 = performance.now()
arrForJob.indexOf(searchElement)
t2 = performance.now()
console.log(`benchmark for default indexOf - `, t2 - t1)

