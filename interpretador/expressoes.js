function CalcExpr(expr) {
    var left = expr.left;
    if(isExpr(left)) {
        left = CalcExpr(left);
    }
    var right = expr.right;
    if(isExpr(right)) {
        right = CalcExpr(right);
    }

    if(isFloat(left)) left = parseFloat(left);
    else if(isInt(left)) left = parseInt(left);

    if(isFloat(right)) right = parseFloat(right);
    else if(isInt(right)) right = parseInt(right);

    if(expr.operation === '+')
        return left + right;
    else if(expr.operation === '-')
        return left - right;
    else if(expr.operation === '*')
        return left * right;
    else if(expr.operation === '/')
        return left / right;
    else if(expr.operation === '^')
        return Math.pow(left, right);
    else if(expr.operation === '%')
        return left % right;
    else if(expr.operation === '>')
        return left > right ? 'verdadeiro' : 'falso';
    else if(expr.operation === '<')
        return left < right ? 'verdadeiro' : 'falso';
    else if(expr.operation === '>=')
        return left >= right ? 'verdadeiro' : 'falso';
    else if(expr.operation === '<=')
        return left <= right ? 'verdadeiro' : 'falso';
    else if(expr.operation === '==')
        return left === right ? 'verdadeiro' : 'falso';
    else if(expr.operation === '!=')
        return left !== right ? 'verdadeiro' : 'falso';
    else if(expr.operation === '||' || expr.operation.toLowerCase() === 'ou') {
        if(isBool(left) && isBool(right))
            return (left || right) ? 'verdadeiro' : 'falso';
        else return null;
    }
    else if(expr.operation === '&&' || expr.operation.toLowerCase() === 'e') {
        if(isBool(left) && isBool(right))
            return (left && right) ? 'verdadeiro' : 'falso';
        else return null;
    }
    else return null;
}

class Expression {
    constructor(left, op, right) {
        this.left = left;
        this.operation = op;
        this.right = right;
    }
}
