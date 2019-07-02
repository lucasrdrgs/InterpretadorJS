function lex(src) {
    var TOKS = [];
    var ERRS = [];
    var Tok = '';
    var i = 0;

    function append(type) {
        var left = (TOKS.length === 0) ? null : new Token(TOKS[TOKS.length - 1].type, TOKS[TOKS.length - 1].value, Errln, null, null);
        TOKS.push(new Token(type, Tok, Errln, left, null));
        Tok = '';
    }

    function peek(x = 1) {
        if(i + x >= src.length) return '';
        return src[i + x];
    }

    function peekBack(x = 1) {
        if(i - x < 0) return '';
        return src[i - x];
    }

    function skip(x = 1) {
        i = i + x;
        return 0;
    }

    // Tirar espaços no começo e no fim
    // src = src.trim();

    var InString = false;

    var Errch = 0;
    var Errln = 1;

    for(i = 0; i < src.length; i++) {
        var Char = src[i];
        Tok += Char;
        Errch++;
        // alert(Tok + ': ' + isName(Tok));

        if(!InString) {
            if(Tok === ' ') {
                Tok = '';
            }
            else if(Tok === '\n') {
                Errch = 0;
                Errln++;
                Tok = '';
            }
            else if(isReserved(Tok) && (isEmpty(peek()) || peek() === ';')) {
                append(RESERVED[Tok]);
            }
            else if(Tok === '\t') {
                append(RESERVED[Tok]);
            }
            else if(isName(Tok) && (isEmpty(peek()) || peek() === ';' ||
                    isOperator(peek()) || PARENTHESIS.includes(peek()) ||
                    LOGIC.includes(peek()) || peek() === ASSIGNMENT ||
                    peek() === ',')) {
                append('id');
            }
            else if(isNum(Tok) && (isEmpty(peek()) || peek() === ';' ||
                    isOperator(peek()) || PARENTHESIS.includes(peek()) ||
                    LOGIC.includes(peek()) || peek() === ASSIGNMENT ||
                    peek() === ',')) {
                append('num');
            }
            else if(isOperator(Tok)) {
                if(peekBack() !== '(' && (!isEmpty(peekBack()) || !isNum(peek()))) {
                    append('operator');
                }
            }
            else if(Tok === ASSIGNMENT && peek() !== ASSIGNMENT) {
                append('assign');
            }
            else if(Tok === ASSIGNMENT && peek() === ASSIGNMENT) {
                Tok += peek();
                append('logical');
                skip();
            }
            else if(LOGIC.includes(Tok) && !LOGIC.includes(Tok + peek())) {
                append('logical');
            }
            else if(LOGIC.includes(Tok) && LOGIC.includes(Tok + peek())) {
                Tok += peek();
                append('logical');
                skip();
            }
            else if(LOGIC.includes(Tok) && !LOGIC.includes(Tok + peek())) {
                append('logical');
            }
            else if(LOGIC.includes(Tok) && LOGIC.includes(Tok + peek())) {
                Tok += peek();
                append('logical');
                skip();
            }
            else if(Tok === '"') {
                InString = true;
                Tok = '';
            }
            else if(PARENTHESIS.includes(Tok)) {
                if(Tok === PT_OPEN)
                    append('ptopen');
                else append('ptclose');
            }
            else {
                if(isEmpty(peek())) {
                    ERRS.push({ Line: Errln, Column: Errch - (Tok.length), Value: Tok});
                    append('error');
                }
            }
        }
        else {
            if(Char === '"') {
                InString = false;
                Tok = Tok.slice(0, Tok.length - 1);
                append('string');
            }
        }
    }

    for(i = 0; i < TOKS.length - 1; i++) {
        var tok = TOKS[i + 1];
        TOKS[i].right = new Token(tok.type, tok.value, null, null);
    }

    if(DEBUG) {
        log(TOKS);
        log(ERRS);
    }
    return {Tokens: TOKS, Errors: ERRS};
}
