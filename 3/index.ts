class MyBCD {

    num: number
    is8Array: Uint8Array

    constructor(num: number) {
        this.num = num;
        if (num < 0) {
            this.num = ~(num) + 1;
        } else {
            this.num = num
        }

        const numberArray = ('' + num).split('').map((n) => {
            return Number(n)
        });

        const is8Arr = new Uint8Array(numberArray)
        this.is8Array = is8Arr
    }

    toBigint(): bigint {
        return BigInt(this.num)
    }

    toNumber(): number {
        return this.num
    }

    toString(): string {
        return String(this.num)
    }

    at(index: number): number {
        if (index < 0) {
            return this.is8Array[this.is8Array.length + index]
        } else {
            return this.is8Array[index]
        }
        
    }
}

const n = new MyBCD(-65536);

console.log(n.toBigint()); // 415030n
console.log(n.toNumber()); // 65536

console.log(n.at(0)); // 6
console.log(n.at(1)); // 5

console.log(n.at(-1)); // 6
console.log(n.at(-2)); // 3
