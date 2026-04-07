class MyBCD {
    is8Array
    length = 0
    countByte = 0
    odd = false

    constructor(num, twoInByte = false) {
      let numberDraft = num < 0 ? ~num + 1 : num

      while (numberDraft > 0) {
        numberDraft = Math.floor(numberDraft / 10)
        this.length++;
      }

      numberDraft = num < 0 ? ~num + 1 : num
      
      if (!twoInByte) {
        this.is8Array = new Uint8Array(this.length)

        for (let i = this.length - 1; i >= 0; i--) {
          this.is8Array[i] = numberDraft % 10
          numberDraft = Math.floor(numberDraft / 10)
        }
      } else {
        this.countByte = Math.ceil(this.length / 2)
        this.is8Array = new Uint8Array(this.countByte)
        this.odd = this.length % 2

        for (let j = this.countByte - 1; j >= 0; j--) {
          let lastNubmerInByte = 0

          if (!(j === this.countByte - 1 && this.odd)) {
            lastNubmerInByte = numberDraft % 10
            numberDraft = Math.floor(numberDraft / 10)
          }

          const firsNumberInByte = numberDraft % 10
          this.is8Array[j] = (firsNumberInByte << 4 | lastNubmerInByte)
          numberDraft = Math.floor(numberDraft / 10)
        }
      }
    }

    toBigint() {
      let num = 0n
      if (this.countByte === 0) {
        for (let i = 0; i < this.is8Array.length; i++) {
          num = num * 10n + BigInt(this.is8Array[i]);
        }
      } else {
        for (let i = 0, j = 0; j < this.countByte; j++) {
          const byte = this.is8Array[j]
          const firstNumber = BigInt(byte >> 4)
          const lastNumber = BigInt(byte & 0b00001111)

          if (this.odd && j + 1 === this.countByte) {
            num = num * 10n + firstNumber
            break
          } else {
            num = num * 10n + firstNumber
            num = num * 10n + lastNumber
          }
        }
      }


      return num
    }

    toNumber() {
      let num = 0
      console.log("asdasd - ", this.countByte)

      if (this.countByte === 0) {
        for (let i = 0; i < this.is8Array.length; i++) {
          num = num * 10 + this.is8Array[i];
        }
      } else {
        for (let i = 0, j = 0; j < this.countByte; j++) {
          const byte = this.is8Array[j]
          const firstNumber = byte >> 4
          const lastNumber = byte & 0b00001111

          if (this.odd && j + 1 === this.countByte) {
            num = num * 10 + firstNumber
            break
          } else {
            num = num * 10 + firstNumber
            num = num * 10 + lastNumber
          }
        }
      }

      return num
    }

    toString() {
      let str = ""
      for (let i = 0; i < this.is8Array.length; i++) {
        str += this.is8Array[i]
      } 
      return str
    }

    at(index) {
      if (index < 0) {
        return this.is8Array[this.is8Array.length + index]
      }
      return this.is8Array[index]
    }
}

const n = new MyBCD(-123406, true);
console.log('n ', n.toBigint())