var DEBUG = true; // Não é constante mas ficará aqui.
const ASSIGNMENT = '=';
const RESERVED = {
    'ALGORITMO': 'keyword',
    'CONSTANTES': 'keyword',
    'VARIAVEIS': 'keyword',
    'INICIO': 'keyword',
    'FIM': 'endfile',
    'ESCREVA': 'func',
    'LEIA': 'func',
    'LIMPA': 'func',
    'SE': 'condit',
    'ENTAO': 'condit',
    'FIMSE': 'condit',
    'SENAO': 'condit',
    'SENAOSE': 'condit',
    'ESCOLHE': 'condit',
    'CASO': 'condit',
    'FIMESCOLHE': 'condit',
    ';': 'endline',
    ':': 'colon',
    '\t': 'indent',
    'inteiro': 'datatype',
    'real': 'datatype',
    'caractere': 'datatype',
    'logico': 'datatype',
    ',': 'comma',
    'verdadeiro': 'bool',
    'falso': 'bool',
    '(': 'ptopen',
    ')': 'ptclose',
};

const PT_OPEN = '(';
const PT_CLOSE = ')';
const PARENTHESIS = [
    PT_OPEN,
    PT_CLOSE
];

const OPERATOR = [
    '+',
    '-',
    '*',
    '/',
    '^',
    '%'
];

const LOGIC = [
    '>',
    '<',
    '==',
    '!=',
    '>=',
    '<=',
    '||',
    '&&',
    'NAO',
    //'E',
    //'OU',
];

const UNICOS = [
    'ALGORITMO',
    'VARIAVEIS',
    'CONSTANTES',
    'INICIO',
    'FIM'
];

const OBRIGATORIOS = [
    'ALGORITMO',
    'INICIO',
    'FIM'
];

/*const REQUIRES_INDENT = [
    'func',
    'datatype'
];*/

const DEFAULT_VALUE = {
    'inteiro': 0,
    'real': 0.0,
    'logico': 'falso',
    'caractere': ''
};

const OP_ASSOC = {
    '^': 'right',
    '*': 'left',
    '/': 'left',
    '%': 'left',
    '+': 'left',
    '-': 'left',
    '<': 'left',
    '>': 'left',
    '==': 'left',
    '!=': 'left',
    '<=': 'left',
    '>=': 'left',
    '||': 'left',
    //'OU': 'left',
    '&&': 'left',
    //'E': 'left',
    'NAO': 'left'
};

const OP_PREC = {
    '^': 7,
    '*': 6,
    '/': 6,
    '%': 6,
    '+': 5,
    '-': 5,
    '<': 4,
    '>': 4,
    '==': 4,
    '!=': 4,
    '<=': 4,
    '>=': 4,
    'NAO': 3,
    '&&': 2,
    //'E': 2,
    '||': 1,
    //'OU': 1,
};
