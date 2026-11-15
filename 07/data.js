import {Person, PersonArray} from "./src.js";

// export const person = Person.create(
//   {
//     age: 41,
//     id: 13,
//     firstName: 'Bob',
//     lastName: 'Rudoff',
//     color: [0xFF, 0xF0, 0xFE]
//   })


export const personArray = PersonArray.create([
  {
    age: 41,
    id: 13,
    firstName: 'Bob',
    lastName: 'Rudoff',
    color: [0xFF, 0xF0, 0xFE]
  },
  {
    age: 42,
    id: 14,
    firstName: 'Bobd',
    lastName: 'Rudoff',
    color: [0xFF, 0xF0, 0xFE]
  },
  {
    age: 43,
    id: 15,
    firstName: 'Boba',
    lastName: 'Rudffd',
    color: [0xFF, 0xF0, 0xFE]
  },
  {
    age: 44,
    id: 16,
    firstName: 'Bobq',
    lastName: 'Rdoffa',
    color: [0xFF, 0xF0, 0xFE]
  }
])

console.log('personArray', personArray.buffer)
