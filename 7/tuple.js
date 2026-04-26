import {Struct} from './struct.js'

export function Tuple(...types) {
  const schema = types.reduce((acc, type, i) => {
    acc[i] = type;
    return acc
  }, {})

  console.log('Tuple schema =  ', schema)
  return new Struct(schema)
}
