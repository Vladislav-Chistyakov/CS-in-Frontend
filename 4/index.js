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
  return ((num >>> position) | (num <<  (32 - position)) >>> 0) >>> 0
}

const numOne = 0b10000000_00000000_00000000_00000011
const numOne2 = 0b11111111_00000000_00000000_00000111
const numOne3 = 0b00000000_00000000_00000000_00001110