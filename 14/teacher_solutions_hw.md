```js
// Бинарный поиск первого вхождения
function indexOf(arr, value, options = {}) {
    const {
        getter = null,
        order = "asc"
    } = options;

    let left = 0;
    let right = arr.length - 1;
    let result = -1;

    while (left <= right) {
        const mid = left + Math.floor((right - left) / 2);
        const currentValue = getter ? getter(arr[mid]) : arr[mid];

        if (currentValue === value) {
            result = mid;
            right = mid - 1;

        } else if (order === "asc" ? currentValue < value : currentValue > value) {
            left = mid + 1;

        } else {
            right = mid - 1;
        }
    }

    return result;
}

// Бинарный поиск последнего вхождения
function lastIndexOf(arr, value, options = {}) {
    const {
        getter = null,
        order = "asc"
    } = options;

    let left = 0;
    let right = arr.length - 1;
    let result = -1;

    while (left <= right) {
        const mid = left + Math.floor((right - left) / 2);
        const currentValue = getter ? getter(arr[mid]) : arr[mid];

        if (currentValue === value) {
            result = mid;
            left = mid + 1;

        } else if (order === "asc" ? currentValue < value : currentValue > value) {
            left = mid + 1;

        } else {
            right = mid - 1;
        }
    }

    return result;
}

const ages = [12, 42, 42, 42, 56];
const agesDesc = [56, 42, 42, 42, 12];

const users = [
    { age: 12, name: "Bob" },
    { age: 42, name: "Ben" },
    { age: 42, name: "Jack" },
    { age: 42, name: "Sam" },
    { age: 56, name: "Bill" }
];

const usersDesc = [
    { age: 56, name: "Bill" },
    { age: 42, name: "Sam" },
    { age: 42, name: "Jack" },
    { age: 42, name: "Ben" },
    { age: 12, name: "Bob" }
];

// Поиск по массиву чисел (возрастание)
console.assert(indexOf(ages, 42) === 1, "indexOf(ages, 42)");
console.assert(lastIndexOf(ages, 42) === 3, "lastIndexOf(ages, 42)");

// Поиск по массиву чисел (убывание)
console.assert(indexOf(agesDesc, 42, { order: "desc" }) === 1, 'indexOf(agesDesc, 42, { order: "desc" })');
console.assert(lastIndexOf(agesDesc, 42, { order: "desc" }) === 3, 'lastIndexOf(agesDesc, 42, { order: "desc" })');

// Поиск по массиву объектов (возрастание)
console.assert(indexOf(users, 42, { getter: (item) => item.age }) === 1, "indexOf(users, 42, { getter: ... })");
console.assert(lastIndexOf(users, 42, { getter: (item) => item.age }) === 3, "lastIndexOf(users, 42, { getter: ... })");

// Поиск по массиву объектов (убывание)
console.assert(indexOf(usersDesc, 42, { getter: (item) => item.age, order: "desc" }) === 1, "indexOf with both options");
console.assert(lastIndexOf(usersDesc, 42, { getter: (item) => item.age, order: "desc" }) === 3, "lastIndexOf with both options");

// Не найдено
console.assert(indexOf(ages, 100) === -1, "indexOf(ages, 100)");
console.assert(lastIndexOf(ages, 100) === -1, "lastIndexOf(ages, 100)");
console.assert(indexOf(agesDesc, 100, { order: "desc" }) === -1, "indexOf not found desc");
console.assert(lastIndexOf(agesDesc, 100, { order: "desc" }) === -1, "lastIndexOf not found desc");

// Пустой массив
console.assert(indexOf([], 42) === -1, "empty array");
console.assert(lastIndexOf([], 42) === -1, "empty array");

console.log("All tests passed!");
```
