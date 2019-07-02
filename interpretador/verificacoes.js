function isInt(val) {
    val = val.toString();
    if(val.includes('.')) return false;
    if(/^-{0,1}\d+$/.test(val)) return true;
    return false;
}

function isFloat(val) {
    val = val.toString();
    if(val.endsWith('.')) return false;
    if(/^-?\d*(\.\d+)?$/.test(val) && !isNaN(parseFloat(val)) && (val % 1 != 0)) return true;
    return false;
}

function isBool(val) {
    if(val.toString() === 'true' || val.toString() === 'false' || val === 'verdadeiro' || val === 'falso' || val || !val) return true;
    return false;
}

function toBool(val) {
    if(val === 'true' || val === 'verdadeiro') return true;
    else if(val === 'false' || val === 'falso') return false;
    else if(val || !val) return val;
    return null;
}

function isNum(val) {
    return isFloat(val) || isInt(val);
}

function isExpr(val) {
    if(val.left !== undefined && val.right !== undefined && val.operation !== undefined) return true;
    return false;
}

function isLetter(l) {
    return /[a-zA-Z]/g.test(l);
}

function isOperator(c) {
    return OPERATOR.includes(c);
}

function isLogical(c) {
    return LOGIC.includes(c);
}

function isEmpty(s) {
    // Não será usado Regex aqui.
    // Edit: eu menti.
    return /\s/g.test(s) || (s === '');
}

function isReserved(t) {
    return (t in RESERVED);
}

function isReserved2(t) {
    return ((t in RESERVED) || LOGIC.includes(n) || OPERATOR.includes(n) || n === ASSIGNMENT || PARENTHESIS.includes(n));
}

function isName(n) {
    // /[a-zA-Z_][a-zA-Z0-9_]*$/g
    return (/[a-zA-Z_][a-zA-Z0-9_]*$/g.test(n) && /[a-zA-Z_]/g.test(n[0]) && !isReserved(n) && !LOGIC.includes(n) && !PARENTHESIS.includes(n) && !OPERATOR.includes(n) && n !== ASSIGNMENT && n[0] !== '"' && n[n.length - 1] !== '"');
}

function isPrintable(tok) {
    return (tok.type === 'id' || tok.type === 'string' || tok.type === 'num');
}

function isString(val) {
    return (typeof val === 'string' || val instanceof String);
}

function isCalculable(val) {
    return isString(val) || isNum(val);
}
