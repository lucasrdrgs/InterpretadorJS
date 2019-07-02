class Token {
    constructor (type, value, line = null, left = null, right = null) {
        this.type = type;
        this.value = value;
        this.line = line;
        this.left = left;
        this.right = right;
    }
}

Token.prototype.assoc = function() {
    return OP_ASSOC[this.value];
}

Token.prototype.prec = function() {
    return OP_PREC[this.value];
}
