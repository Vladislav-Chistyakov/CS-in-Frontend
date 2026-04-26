import {Person} from "./src.js";

export const bob = Person.create({
  age: 40,
  name: 13,
  firstName: 'Bob',
  lastName: 'Rudoff',
  color: [0xFF, 0xF0, 0xFE]
})

console.log('bob', bob.name, bob.age, bob.color[0])
console.log('buffer', bob.buffer)