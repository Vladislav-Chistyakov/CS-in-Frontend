type DIGITS_UNICODE = [number, number]

const LATIN_DIGITS: DIGITS_UNICODE = [48, 57];
const ARABIC_INDIC_DIGITS: DIGITS_UNICODE = [1632, 1641];
const EASTERN_ARABIC_DIGITS: DIGITS_UNICODE = [1776, 1785];
const DEVANAGARI_DIGITS: DIGITS_UNICODE = [2406, 2415];
const BENGALI_DIGITS: DIGITS_UNICODE = [2534, 2543];
const GURMUKHI_DIGITS: DIGITS_UNICODE = [2662, 2671];
const GUJARATI_DIGITS: DIGITS_UNICODE = [2790, 2799];
const ORIYA_DIGITS: DIGITS_UNICODE = [2918, 2927];
const TAMIL_DIGITS: DIGITS_UNICODE = [3046, 3055];
const TELUGU_DIGITS: DIGITS_UNICODE = [3174, 3183];
const KANNADA_DIGITS: DIGITS_UNICODE = [3302, 3311];
const MALAYALAM_DIGITS: DIGITS_UNICODE = [3430, 3439];
const SINHALA_DIGITS: DIGITS_UNICODE = [3558, 3567];
const THAI_DIGITS: DIGITS_UNICODE = [3664, 3673];
const LAO_DIGITS: DIGITS_UNICODE = [3792, 3801];
const TIBETAN_DIGITS: DIGITS_UNICODE = [3872, 3881];
const MYANMAR_DIGITS: DIGITS_UNICODE = [4160, 4169];
const SHAN_DIGITS: DIGITS_UNICODE = [4240, 4249];
const MONGOLIAN_DIGITS: DIGITS_UNICODE = [6470, 6479];
const LIMBU_DIGITS: DIGITS_UNICODE = [6608, 6617];
const NEWA_DIGITS: DIGITS_UNICODE = [6784, 6793];
const TAI_LE_DIGITS: DIGITS_UNICODE = [6900, 6909];
const NEW_TAI_LUE_DIGITS: DIGITS_UNICODE = [6984, 6993];
const KHMER_ATHAROK_DIGITS: DIGITS_UNICODE = [7936, 7945];
const ROMAN_NUMERALS: DIGITS_UNICODE = [8544, 8584];
const CHAM_DIGITS: DIGITS_UNICODE = [9248, 9257];
const KAYAH_LI_DIGITS: DIGITS_UNICODE = [9312, 9321];
const TAI_THAM_HORA_DIGITS: DIGITS_UNICODE = [10160, 10169];
const TAI_THAM_THAM_MUANG_DIGITS: DIGITS_UNICODE = [10174, 10183];
const MEITEI_MAYEK_DIGITS: DIGITS_UNICODE = [11264, 11273];
const LANNA_DIGITS: DIGITS_UNICODE = [42608, 42617];
const SAURASHTRA_DIGITS: DIGITS_UNICODE = [43216, 43225];
const ROHINGYA_DIGITS: DIGITS_UNICODE = [43248, 43257];
const CHAKMA_DIGITS: DIGITS_UNICODE = [43488, 43497];
const KHMER_DIGITS: DIGITS_UNICODE = [6112, 6121];
const OL_CHIKI_DIGITS: DIGITS_UNICODE = [43712, 43721];
const CHINESE_FINANCIAL_THREE_VARIANTS: DIGITS_UNICODE = [21441, 21444];
const FULLWIDTH_DIGITS: DIGITS_UNICODE = [65296, 65305];


const ARRAY_DIGITS: DIGITS_UNICODE[] = [
  ROMAN_NUMERALS,
  LATIN_DIGITS,
  ARABIC_INDIC_DIGITS,
  EASTERN_ARABIC_DIGITS,
  CHINESE_FINANCIAL_THREE_VARIANTS,
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
]

function isDigitsString (str: string): boolean {
  console.log('STR: ', str)
  const arrayChars = [...str].map(c => c.codePointAt(0));
  console.log('arrayChars', arrayChars)

  if (!arrayChars.length) {
    return false
  }

  const firstChar = arrayChars[0];

  const arrayDigitsForUse: [number, number] = [0, 0];

  for (const arrayDigits of ARRAY_DIGITS) {
    if (firstChar && firstChar >= arrayDigits[0] && firstChar <= arrayDigits[1]) {
      arrayDigitsForUse[0] = arrayDigits[0];
      arrayDigitsForUse[1] = arrayDigits[1];
      break
    }
  }

  const isCharsHasArrayDigits =
    arrayChars.every(char => {
      if (char === undefined) {
        return false
      }
      return arrayDigitsForUse[0] && char <= arrayDigitsForUse[1]
    })

  console.log('arrayChars ', arrayChars)
  console.log('arrayDigitsForUse ', arrayDigitsForUse)

  return isCharsHasArrayDigits
}

const numArabic = '12 3'

// Арабо-восточные цифры (используются в арабских странах, например, в Египте)
const numEasternArabic = '١٢٣'; // Это 1, 2, 3

// Цифры Деванагари (используются в Индии для хинди, маратхи и др.)
const numDevanagari = '१२३'; // Это 1, 2, 3

// Кхмерские цифры (Камбоджа)
const numKhmer = '១២៣'; // Это 1, 2, 3

// Китайские / японские иероглифические цифры (финансовое начертание)
const numChinese = '参'; // Это число 3 (в сложном официальном стиле «дасе»)

console.log(isDigitsString(numArabic))
console.log(isDigitsString(numEasternArabic))
console.log(isDigitsString(numDevanagari))
console.log(isDigitsString(numKhmer))
console.log(isDigitsString(numChinese))
