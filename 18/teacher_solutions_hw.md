## Итератор по символам юникода

Необходимо реализовать итератор по символам юникода для строки, аналогичный нативному (суррогатные пары должны учитываться).

```js
[...iter("😀")] // ["😀"]
```

<details>
<summary><strong>Смотреть решение</strong></summary>

```js
function* iter(str) {
    for (let i = 0; i < str.length; i++) {
        const char = str[i];

        if (i === str.length - 1) {
            yield char;

        } else {
            const charCode = str.charCodeAt(i);
            const nextCharCode = str.charCodeAt(i + 1);

            const isSurrogatePair =
                charCode >= 0xD800 && charCode <= 0xDBFF &&
                nextCharCode >= 0xDC00 && nextCharCode <= 0xDFFF;

            if (isSurrogatePair) {
                yield char + str[i + 1];
                i++;

            } else {
                yield char;
            }
        }
    }
}

console.assert([...iter("😀")].length === 1);
console.assert([...iter("😀")][0] === "😀");
```

</details>

## Число или нет

Необходимо реализовать функцию, которая будет говорить является ли заданная строка числом или нет. Должна быть поддержка не только арабских цифр. Регулярные выражения использовать нельзя.

```js
isDigit("123") // true
isDigit("Ⅻ")  // true
```

<details>
<summary><strong>Смотреть решение</strong></summary>

```js
const LATIN_DIGITS = [48, 57];
const ARABIC_INDIC_DIGITS = [1632, 1641];
const EASTERN_ARABIC_DIGITS = [1776, 1785];
const DEVANAGARI_DIGITS = [2406, 2415];
const BENGALI_DIGITS = [2534, 2543];
const GURMUKHI_DIGITS = [2662, 2671];
const GUJARATI_DIGITS = [2790, 2799];
const ORIYA_DIGITS = [2918, 2927];
const TAMIL_DIGITS = [3046, 3055];
const TELUGU_DIGITS = [3174, 3183];
const KANNADA_DIGITS = [3302, 3311];
const MALAYALAM_DIGITS = [3430, 3439];
const SINHALA_DIGITS = [3558, 3567];
const THAI_DIGITS = [3664, 3673];
const LAO_DIGITS = [3792, 3801];
const TIBETAN_DIGITS = [3872, 3881];
const MYANMAR_DIGITS = [4160, 4169];
const SHAN_DIGITS = [4240, 4249];
const KHMER_DIGITS = [6160, 6169];
const MONGOLIAN_DIGITS = [6470, 6479];
const LIMBU_DIGITS = [6608, 6617];
const NEWA_DIGITS = [6784, 6793];
const TAI_LE_DIGITS = [6900, 6909];
const NEW_TAI_LUE_DIGITS = [6984, 6993];
const KHMER_ATHAROK_DIGITS = [7936, 7945];
const ROMAN_NUMERALS = [8544, 8584];
const CHAM_DIGITS = [9248, 9257];
const KAYAH_LI_DIGITS = [9312, 9321];
const TAI_THAM_HORA_DIGITS = [10160, 10169];
const TAI_THAM_THAM_MUANG_DIGITS = [10174, 10183];
const MEITEI_MAYEK_DIGITS = [11264, 11273];
const LANNA_DIGITS = [42608, 42617];
const SAURASHTRA_DIGITS = [43216, 43225];
const ROHINGYA_DIGITS = [43248, 43257];
const CHAKMA_DIGITS = [43488, 43497];
const OL_CHIKI_DIGITS = [43712, 43721];
const FULLWIDTH_DIGITS = [65296, 65305];

const DIGIT_RANGES = [
    LATIN_DIGITS,
    ARABIC_INDIC_DIGITS,
    EASTERN_ARABIC_DIGITS,
    DEVANAGARI_DIGITS,
    BENGALI_DIGITS,
    GURMUKHI_DIGITS,
    GUJARATI_DIGITS,
    ORIYA_DIGITS,
    TAMIL_DIGITS,
    TELUGU_DIGITS,
    KANNADA_DIGITS,
    MALAYALAM_DIGITS,
    SINHALA_DIGITS,
    THAI_DIGITS,
    LAO_DIGITS,
    TIBETAN_DIGITS,
    MYANMAR_DIGITS,
    SHAN_DIGITS,
    KHMER_DIGITS,
    MONGOLIAN_DIGITS,
    LIMBU_DIGITS,
    NEWA_DIGITS,
    TAI_LE_DIGITS,
    NEW_TAI_LUE_DIGITS,
    KHMER_ATHAROK_DIGITS,
    ROMAN_NUMERALS,
    CHAM_DIGITS,
    KAYAH_LI_DIGITS,
    TAI_THAM_HORA_DIGITS,
    TAI_THAM_THAM_MUANG_DIGITS,
    MEITEI_MAYEK_DIGITS,
    LANNA_DIGITS,
    SAURASHTRA_DIGITS,
    ROHINGYA_DIGITS,
    CHAKMA_DIGITS,
    OL_CHIKI_DIGITS,
    FULLWIDTH_DIGITS,
];

function findDigitRange(charCode) {
    let left = 0;
    let right = DIGIT_RANGES.length - 1;

    while (left <= right) {
        const middle = left + Math.floor((right - left) / 2);

        const [rangeStart, rangeEnd] = DIGIT_RANGES[middle];

        if (charCode >= rangeStart && charCode <= rangeEnd) {
            return DIGIT_RANGES[middle];
        }

        if (charCode < rangeStart) {
            right = middle - 1;

        } else {
            left = middle + 1;
        }
    }

    return null;
}

function isDigit(input) {
    let expectedDigitRange = null;

    for (const char of input) {
        const digitRange = findDigitRange(char.codePointAt(0));

        if (digitRange == null) {
            return false;
        }

        if (expectedDigitRange == null) {
            expectedDigitRange = digitRange;
        }

        if (expectedDigitRange !== digitRange) {
            return false;
        }
    }

    return true;
}

console.assert(isDigit("123", "Индо-арабские цифры"));
console.assert(isDigit("Ⅻ"), "Римские цифры");
console.assert(!isDigit("Ⅻ1"), "Нельзя смешивать цифры");
console.assert(!isDigit("XII"), "Не число");
```

</details>