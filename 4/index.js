



















function cyclicLeftShift (num, positionLeft) {
  let position = positionLeft % 32
  if (position === 0 ) {
    return num
  }
  return (num >>> (32 - position)) | (num << position)
}

function cyclicRigthShift (num, positionRigth) {
  let position = positionRigth % 32
  if (position === 0 ) {
    return num
  }
  return (num >>> (32 - position)) | (num << position)
}

const numOne = 0b10000000_00000000_00000000_00000011
const numOne2 = 0b11111111_00000000_00000000_00000111
const numOne3 = 0b00000000_00000000_00000000_00001110

console.log(cyclicRigthShift(numOne, 33).toString(2))

function createMask(position, size) {
  let mask = 1;
  console.log('_', mask << size, (mask << size).toString(2))
  mask = (mask << size) - 1;
  console.log('__', mask.toString(2))
  mask = mask << position;
  console.log('___', mask.toString(2))
  return mask;
}