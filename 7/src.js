import {U8} from "./u8.js";
import {U16} from "./u16.js";
import {FixedAsciiString} from "./fixed-ascii-string.js";
import {Struct} from "./struct.js";
import {Tuple} from "./tuple.js";
import {TypedArray} from "./typed-array.js";


export const Color = Tuple(U8, U8, U8);

export const Person = new Struct({
  age: U8,
  id: U16,
  firstName: FixedAsciiString(8),
  lastName: FixedAsciiString(8),
  color: Color
})

export const PersonArray = new TypedArray(Person, 1e5)

console.log('PERSON ARRAY', PersonArray)