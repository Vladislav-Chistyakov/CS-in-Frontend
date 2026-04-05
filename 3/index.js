class MyBCD {
    is8Array
    isDop = false

    constructor(num, isDouByte = false) {
      let numberDraft = num < 0 ? ~num + 1 : num
      let length = 0
      while (numberDraft > 0) {
        numberDraft = Math.floor(numberDraft / 10)
        length++;
      }
      this.is8Array = new Uint8Array(length)

      numberDraft = num < 0 ? ~num + 1 : num

  
      // this.isDop = !Number.isInteger(length / 2)
      
      if (!isDouByte) {
        for (let i = length - 1; i >= 0; i--) {
          this.is8Array[i] = numberDraft % 10
          numberDraft = Math.floor(numberDraft / 10)
        }
      }
    }

    toBigint() {
      let num = 0n
      for (let i = 0; i < this.is8Array.length; i++) {
        num = num * 10n + BigInt(this.is8Array[i]);
      }

      return num
    }

    toNumber() {
      let num = 0

      for (let i = 0; i < this.is8Array.length; i++) {
        num = num * 10 + this.is8Array[i];
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

const n = new MyBCD(-65536);
console.log('n ', n.toNumber())