## Пирамидальная сортировка (сортировка кучей, heapsort)

Необходимо реализовать функцию сортировки массива используя данный алгоритм.
Алгоритм должен работать без дополнительной памяти.

<details>
<summary><strong>Смотреть решение</strong></summary>

```typescript
import * as assert from "node:assert";

interface Comparator<T> {
    (a: T, b: T): number;
}

function heapSort<T>(arr: T[], comparator: Comparator<T>): T[] {
    const n = arr.length;

    // Превращаем массив в кучу (max-heap)
    // Начинаем с последнего родительского узла
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        heapify(arr, n, i, comparator);
    }

    // Извлекаем элементы из кучи по одному
    for (let i = n - 1; i > 0; i--) {
        [arr[0], arr[i]] = [arr[i], arr[0]];
        heapify(arr, i, 0, comparator);
    }

    return arr;
}

function heapify<T>(arr: T[], n: number, i: number, comparator: Comparator<T>) {
    let largest = i;

    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < n && comparator(arr[left], arr[largest]) > 0) {
        largest = left;
    }

    if (right < n && comparator(arr[right], arr[largest]) > 0) {
        largest = right;
    }

    if (largest !== i) {
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        heapify(arr, n, largest, comparator);
    }
}

// Тесты для heapSort
console.log("=== Тесты heapSort ===\n");

// Тест 1: Сортировка чисел
const numbers = [5, 3, 8, 4, 2, 7, 1, 6];
const numberComparator: Comparator<number> = (a, b) => a - b;

const sortedNumbers = heapSort([...numbers], numberComparator);
assert.deepStrictEqual(sortedNumbers, [1, 2, 3, 4, 5, 6, 7, 8]);
console.log("✓ Тест 1 пройден: Сортировка чисел");

// Тест 2: Сортировка чисел с отрицательными значениями
const negativeNumbers = [-5, 3, -8, 4, 0, -2, 7, -1];
const sortedNegative = heapSort([...negativeNumbers], numberComparator);
assert.deepStrictEqual(sortedNegative, [-8, -5, -2, -1, 0, 3, 4, 7]);
console.log("✓ Тест 2 пройден: Сортировка чисел с отрицательными значениями");

// Тест 3: Сортировка строк
const strings = ["banana", "apple", "cherry", "date", "fig", "elderberry"];
const stringComparator: Comparator<string> = (a, b) => a.localeCompare(b);

const sortedStrings = heapSort([...strings], stringComparator);
assert.deepStrictEqual(sortedStrings, ["apple", "banana", "cherry", "date", "elderberry", "fig"]);
console.log("✓ Тест 3 пройден: Сортировка строк");

// Тест 4: Сортировка строк в обратном порядке
const reverseStringComparator: Comparator<string> = (a, b) => b.localeCompare(a);
const sortedStringsReverse = heapSort([...strings], reverseStringComparator);
assert.deepStrictEqual(sortedStringsReverse, ["fig", "elderberry", "date", "cherry", "banana", "apple"]);
console.log("✓ Тест 4 пройден: Сортировка строк в обратном порядке");

// Тест 5: Сортировка объектов по возрасту
interface Person {
    name: string;
    age: number;
}

const people: Person[] = [
    { name: "John", age: 30 },
    { name: "Jane", age: 25 },
    { name: "Bob", age: 35 },
    { name: "Alice", age: 28 },
    { name: "Charlie", age: 22 }
];

const ageComparator: Comparator<Person> = (a, b) => a.age - b.age;
const sortedPeople = heapSort([...people], ageComparator);

assert.deepStrictEqual(sortedPeople, [
    { name: "Charlie", age: 22 },
    { name: "Jane", age: 25 },
    { name: "Alice", age: 28 },
    { name: "John", age: 30 },
    { name: "Bob", age: 35 }
]);
console.log("✓ Тест 5 пройден: Сортировка объектов по возрасту");

// Тест 6: Сортировка объектов по имени
const nameComparator: Comparator<Person> = (a, b) => a.name.localeCompare(b.name);
const sortedPeopleByName = heapSort([...people], nameComparator);

assert.deepStrictEqual(sortedPeopleByName, [
    { name: "Alice", age: 28 },
    { name: "Bob", age: 35 },
    { name: "Charlie", age: 22 },
    { name: "Jane", age: 25 },
    { name: "John", age: 30 }
]);
console.log("✓ Тест 6 пройден: Сортировка объектов по имени");

// Тест 7: Пустой массив
const emptyArray: number[] = [];
const sortedEmpty = heapSort([...emptyArray], numberComparator);
assert.deepStrictEqual(sortedEmpty, []);
console.log("✓ Тест 7 пройден: Пустой массив");

// Тест 8: Массив с одним элементом
const singleElement = [42];
const sortedSingle = heapSort([...singleElement], numberComparator);
assert.deepStrictEqual(sortedSingle, [42]);
console.log("✓ Тест 8 пройден: Массив с одним элементом");

// Тест 9: Уже отсортированный массив
const sorted = [1, 2, 3, 4, 5];
const sortedAlready = heapSort([...sorted], numberComparator);
assert.deepStrictEqual(sortedAlready, [1, 2, 3, 4, 5]);
console.log("✓ Тест 9 пройден: Уже отсортированный массив");

// Тест 10: Массив с дубликатами
const duplicates = [5, 2, 8, 2, 1, 8, 5, 3];
const sortedDuplicates = heapSort([...duplicates], numberComparator);
assert.deepStrictEqual(sortedDuplicates, [1, 2, 2, 3, 5, 5, 8, 8]);
console.log("✓ Тест 10 пройден: Массив с дубликатами");

console.log("\n✅ Все тесты пройдены успешно!");
```

</details>