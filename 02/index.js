const SET_A = 0
const PRINT_A = 1
const IFN_A = 2
const RET = 3
const DEC_A = 4
const DEC_JMP = 5


const instructions = {
    'SET A': SET_A,
    'PRINT A': PRINT_A,
    'IFN A': IFN_A,
    'RET': RET,
    'DEC A': DEC_A,
    'JMP': DEC_JMP
};

const program = [
    // Ставим значения аккумулятора
    instructions['SET A'], /// i = 0
    // В 10
    10, /// i = 1

    // Выводим значение на экран
    instructions['PRINT A'], /// i = 2

    // Если A равно 0
    instructions['IFN A'], /// i = 3

    // Программа завершается
    instructions['RET'], /// i = 4

    // И возвращает 0
    0, /// i = 5

    // Уменьшаем A на 1
    instructions['DEC A'],

    // Устанавливаем курсор выполняемой инструкции
    instructions['JMP'],

    // В значение 2
    2
];

function execute (program) {
  let A = 0
  let i = 0
  let exit = false

  while (!exit) {
    switch (program[i]) {
      case SET_A: {
        i++;
        A = program[i];
        i++;
        break;
      }
      case PRINT_A: {
        console.log(A);
        i++;
        break;
      }
      case IFN_A: {
        if (A === 0) {
          i++;
        } else {
          i+=3;
        }
        break;
      }
      case RET: {
        return program[i + 1];
      }
      case DEC_A: {
        A--;
        i++;
        break;
      }
      case DEC_JMP: {
        i++;
        i = program[i];
        break;
      }
    }
  }
}

execute(program);