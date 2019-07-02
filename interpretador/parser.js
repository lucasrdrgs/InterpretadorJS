function parse(args) {
    // Limpar fila de saídas:
    emptyQueue();

    var Tokens = args.Tokens;
    var Errors = args.Errors;

    var Variaveis = {};
    var Constantes = {};
    var NomeAlgoritmo = '';

    var err = false;

    function depoisde(tok, ln = null) {
        if (ln == null) ln = tok.line;
        var r = [];
        for(var i = Tokens.indexOf(tok) + 1; i < Tokens.length; i++) {
            if(Tokens[i].line !== ln) return r;
            r.push(Tokens[i]);
        }
        return r;
    }

    function esc_depoisde(tok) {
        var r = [];
        for(var i = Tokens.indexOf(tok) + 1; i < Tokens.length; i++) {
            if(Tokens[i].line !== tok.line)
                r.push(Tokens[i]);
        }
        return r;
    }

    function primeirosTabs(ln) {
        var r = [];
        var linha = nalinha(ln);
        for(var i = 0; i < linha.length; i++) {
            if(linha[i].type !== 'indent') return r;
            r.push(linha[i]);
        }
        return r;
    }

    function tabsAntes(tok) {
        return primeirosTabs(tok.line).length;
    }

    function escopo(tok) {
        var r = [];
        var pTabs = tabsAntes(tok);
        var dps = esc_depoisde(tok);
        for(var i = 0; i < dps.length; i++) {
            if(primeirosTabs(dps[i].line).length > pTabs) {
                r.push(dps[i]);
            } else return r;
        }
        return r;
    }

    function primeiro(x, y) {
        for(var i = 0; i < Tokens.length; i++) {
            if(Tokens[i].value === x) return true;
            if(Tokens[i].value === y) return false;
        }
        return null;
    }

    function nalinha(ln) {
        var r = [];
        for(var i = 0; i < Tokens.length; i++) {
            if(Tokens[i].line === ln) r.push(Tokens[i]);
        }
        return r;
    }

    function any(val) {
        for(var i = 0; i < Tokens.length; i++) {
            if(Tokens[i].value === val) return true;
        }
        return false;
    }

    function count(val) {
        var r = 0;
        for(var i = 0; i < Tokens.length; i++) {
            if(Tokens[i].value === val) r++;
        }
        return r;
    }

    function countOfIn(val, arr) {
        var r = 0;
        for(var i = 0; i < arr.length; i++) {
            if(arr[i] === val) r++;
        }
        return r;
    }

    function ultimo(val, arr) {
        var ult = null;
        for(var i = 0; i < arr.length; i++) {
            if(arr[i].value === val) ult = arr[i];
        }
        return ult;
    }

    function calcRpn(arr) {
        var outQueue = [];
        var opStack = [];
        var rpn = [];

        for(var i = 0; i < arr.length; i++) {
            var d = arr[i];
            if(d.type === 'id') {
                if(d.value in Variaveis) outQueue.push(Variaveis[d.value][0]);
                else if(d.value in Constantes) outQueue.push(Constantes[d.value]);
            }
            else if(d.type === 'num') {
                outQueue.push(d.value);
            }
            else if(d.type === 'string') {
                outQueue.push(d.value);
            }
            else if(d.type === 'operator' || d.type === 'logical') {
                try {
                    while(opStack.peek() && (opStack.peek().type === 'operator' || opStack.peek().type === 'logical')
                        && ((d.assoc() === 'left' && d.prec() <= opStack.peek().prec())
                        || (d.assoc() === 'right' && d.prec() < opStack.peek().prec())))
                    {
                            outQueue.push(opStack.pop());
                    }
                    opStack.push(d);
                }
                catch(e) {
                    err = erro(ERR_MATH_FAIL.format(d.line) + ' (1)');
                    return [undefined, -(dps.length + 1)];
                }
            }
            else if(d.type === 'ptopen') {
                opStack.push(d);
            }
            else if(d.type === 'ptclose') {
                while(opStack.peek() && opStack.peek().type !== 'ptopen') {
                    outQueue.push(opStack.pop());
                }
                opStack.pop();
            }
        }
        rpn = outQueue.concat(opStack.reverse());
        // Hora de analisar a notação RPN e calcular o resultado.
        // Esta parte não será tão difícil (eu espero).
        var final = [];
        for(var i = 0; i < rpn.length; i++) {
            if(!isOperator(rpn[i]) && !isLogical(rpn[i]) && rpn[i].type !== 'operator' && rpn[i].type !== 'logical') {
                final.push(rpn[i]);
            }
            else {
                var op = rpn[i].value;
                if(op === 'NAO') {
                    var left = final.pop();
                    if(left === undefined || left === null) {
                        err = erro(ERR_MATH_FAIL.format(d.line) + ' (2)');
                        return undefined;
                    }
                    final.push(left === 'verdadeiro' ? 'falso' : 'verdadeiro');
                    continue;
                }
                var right = final.pop();
                var left = final.pop();
                if(right === undefined || right === null || left === undefined || left === null) {
                    err = erro(ERR_MATH_FAIL.format(d.line) + ' (3)');
                    return undefined;
                }
                final.push(CalcExpr(new Expression(left, op, right)));
            }
        }
        if(final.length === 1) {
            final = final[0];
        }
        else {
            err = erro(ERR_MATH_FAIL.format(d.line) + ' (4)');
            return undefined;
        }

        if(isNaN(final) && !isString(final)) {
            err = erro(ERR_STRING_OP.format(d.line));
            return undefined;
        }

        log(final);
        return final;
    }

    function condicao(tok) {
        var esc = escopo(tok);
        var dps = depoisde(tok);

        var precisaEntao = (tok.value === 'SE' || tok.value === 'SENAOSE');
        if(precisaEntao) {
            if(dps[dps.length - 1].value !== 'ENTAO') {
                err = erro(ERR_EXPECTED_Z.format('ENTAO', tok.line));
                return -1;
            }
            if(dps.length < 4) {
                err = erro(ERR_EXPECTED_Z.format('condição e ENTAO', tok.line));
                return -1;
            }
            if(dps[0].type !== 'ptopen' || dps[dps.length - 2].type !== 'ptclose') {
                err = erro(ERR_EXPECTED_Z.format('parênteses em volta da condição', tok.line));
                return -1;
            }
        }

        var proxCondic = undefined;
        for(var i = Tokens.indexOf(tok) + 1; i < Tokens.length; i++) {
                if((Tokens[i].value === 'FIMSE' || Tokens[i].value === 'SENAO' || Tokens[i].value === 'SENAOSE')
                    && tabsAntes(Tokens[i]) === tabsAntes(tok)) {
                    proxCondic = Tokens[i];
                    break;
                }
        }

        var temFimSe = false;
        for(var i = Tokens.indexOf(tok) + 1; i < Tokens.length; i++) {
                if(Tokens[i].value === 'FIMSE' && tabsAntes(Tokens[i]) === tabsAntes(tok)) {
                    temFimSe = true;
                    break;
                }
        }

        if(proxCondic === undefined) {
            err = erro(ERR_CONDIT_INCOMPLETE.format(tok.line));
            return -1;
        }
        if(!temFimSe) {
            err = erro(ERR_CONDIT_INCOMPLETE_W.format(tok.line, 'falta um FIMSE.'));
            return -1;
        }

        if(proxCondic.type !== 'condit' || proxCondic.value === 'SE') {
            err = erro(ERR_EXPECTED_W.format('FIMSE, SENAO ou SENAOSE após SE'))
            return -1;
        }

        var condic_toks = dps.slice(0, dps.length - 1);
        var condic = false;

        if(condic_toks.length > 0) {
            condic = calcRpn(condic_toks);
        }

        if(toBool(condic)) {
            var j = -1;
            for(var i = 0; i < esc.length; i++) {
                j = parseToken(esc[i]);
                if(j < 0) break;
                i += j;
            }
            if(j < 0) return -1;
        }
        else {
            if(proxCondic.value === 'SENAOSE') {
                return condicao(proxCondic);
            }
            else if(proxCondic.value === 'SENAO') {
                var j = -1;
                var escElse = escopo(proxCondic);
                for(var i = 0; i < escElse.length; i++) {
                    j = parseToken(escElse[i]);
                    if(j < 0) break;
                    i += j;
                }
                if(j < 0) return -1;
            }
        }
        return 0;
    }

    var token_i = 0;
    function skip(x = 1) {
        token_i += x;
    }

    var UltimoOutput = '';

    // Aqui começa o sofrimento do desenvolvedor:
    function parseToken(tok) {
        if(tok.type === 'indent') return 0;
        else if(tok.type === 'endline') return 0;
        else if(tok.value === 'ALGORITMO') {
            var dps = depoisde(tok);
            if(dps.length === 1) {
                if(dps[0].type === 'id') {
                    NomeAlgoritmo = dps[0].value;
                    skip();
                }
                else {
                    err = erro(ERR_EXPECTED.format('nome do algoritmo', tok.line, dps[0].type));
                }
            }
            else {
                err = erro(ERR_TOO_MANY_TOKENS.format(tok.line, 1, dps.length));
                return 1;
            }
            return 0;
        }
        else if(tok.value === 'CONSTANTES') {
            var esc = escopo(tok);
            for(var i = 0; i < esc.length; i++) {
                var subtok = esc[i];
                if(subtok.type === 'indent') continue;
                if(subtok.type === 'id') {
                    if(!(subtok.value in Constantes) && !(subtok.value in Variaveis)) {
                        if(subtok.right.type === 'assign') {
                            var valtok = depoisde(subtok)[1];
                            if(valtok.type === 'string' || valtok.type === 'num') {
                                if(valtok.right.type === 'endline') {
                                    Constantes[subtok.value] = valtok.value;
                                    i += 3;
                                }
                                else {
                                    err = erro(ERR_EXPECTED.format('; após {0}'.format(valtok.value), valtok.line, 'nada'));
                                    return 1;
                                }
                            }
                            else {
                                err = erro(ERR_EXPECTED.format('valor para constante', valtok.line, '{0} ({1})'.format(valtok.value, valtok.type)));
                                return 1;
                            }
                        }
                        else {
                            err = erro(ERR_EXPECTED.format('=', subtok.right.line, subtok.right.value));
                            return 1;
                        }
                    }
                    else {
                        err = erro(ERR_TWO_DECLARATIONS.format(subtok.value, subtok.line));
                        return 1;
                    }
                }
                else {
                    err = erro(ERR_EXPECTED.format('nome de constante', subtok.line, '{0} ({1})'.format(subtok.value, subtok.type)));
                    return 1;
                }
            }
            skip(esc.length);
            return 0;
        }
        else if(tok.value === 'VARIAVEIS') {
            if(primeiro('CONSTANTES', 'VARIAVEIS') || !any('CONSTANTES')) {
                var esc = escopo(tok);
                for(var i = 0; i < esc.length; i++) {
                    var subtok = esc[i];
                    if(subtok.type === 'indent') continue;
                    if(subtok.type === 'datatype') {
                        var tmp = depoisde(subtok);
                        if(tmp[tmp.length - 1].type !== 'endline') {
                            err = erro(ERR_EXPECTED.format(';', subtok.line, 'nada'));
                            return 1;
                        }
                        var dt = subtok.value;
                        subtok = depoisde(subtok)[0];
                        if(subtok.type === 'id') {
                            if(subtok.right.type === 'endline') {
                                if(!(subtok.value in Constantes) && !(subtok.value in Variaveis)) {
                                    Variaveis[subtok.value] = [DEFAULT_VALUE[dt], dt];
                                    i += 3;
                                }
                                else {
                                    err = erro(ERR_TWO_DECLARATIONS.format(subtok.value, subtok.line));
                                    return 1;
                                }
                            }
                            else if(subtok.right.type === 'comma') {
                                var moretoks = [subtok].concat(depoisde(subtok));
                                moretoks = moretoks.slice(0, moretoks.length);
                                for(var j = 0; j < moretoks.length; j++) {
                                    if(moretoks[j].type === 'comma') continue;
                                    else if(moretoks[j].type === 'endline') break;
                                    else {
                                        if(!(moretoks[j].value in Constantes) && !(moretoks[j].value in Variaveis)) {
                                            Variaveis[moretoks[j].value] = [DEFAULT_VALUE[dt], dt];
                                        }
                                        else {
                                            err = erro(ERR_TWO_DECLARATIONS.format(subtok.value, subtok.line));
                                            return 1;
                                        }
                                    }
                                }
                                i += moretoks.length + 1;
                            }
                            else {
                                err = erro(ERR_EXPECTED.format(', ou ;', subtok.line, subtok.right.value));
                                return 1;
                            }
                        }
                        else {
                            err = erro(ERR_EXPECTED.format('nome de variável', subtok.line, '{0} ({1})'.format(subtok.value, subtok.type)));
                            return 1;
                        }
                    }
                    else {
                        err = erro(ERR_EXPECTED.format('tipo de dados', subtok.line, '{0} ({1})'.format(subtok.value, subtok.type)));
                        return 1;
                    }
                }
                skip(esc.length);
            }
            else {
                err = erro(ERR_ORDER.format('CONSTANTES', 'VARIAVEIS'));
                return 1;
            }
            return 0;
        }
        else if(tok.value === 'INICIO') {
            var esc = escopo(tok);
            for(var i = 0; i < esc.length; i++) {
                if(nalinha(esc[i].line)[0].type !== 'indent') {
                    err = erro(ERR_EXPECTED.format('indentação', esc[0].line, '{0} ({1})'.format(esc[0].value, esc[0].type)));
                    return 1;
                }
            }
            for(var i = 0; i < esc.length; i++) {
                var j = parseToken(esc[i]);
                if(j < 0) break;
                i += j;
                // Me desculpe pelo uso de recursões confusas.
            }
            skip(esc.length);
            return 0;
        }
        else if(tok.value === 'ESCREVA') {
            var wstring = '';
            var writetoks = depoisde(tok);
            if(writetoks[writetoks.length - 1].type !== 'endline') {
                err = erro(ERR_EXPECTED.format('; no fim da linha', tok.line, 'nada'));
                return writetoks.length;
            }
            if(writetoks.length <= 1) {
                err = erro(ERR_EXPECTED.format('algo para escrever', tok.line, 'nada'));
                return writetoks.length;
            }
            writetoks = writetoks.slice(0, writetoks.length - 1);
            var rpn = calcRpn(writetoks);
            if(rpn === undefined) {
                err = erro(ERR_CONCAT.format(tok.line));
                return writetoks.length;
            }
            wstring = rpn.toString();
            wstring = wstring.replace('\\n', '\n');
            UltimoOutput = output(wstring);
            return writetoks.length + 1;
        }
        else if(tok.value === 'LEIA') {
            var leiatoks = depoisde(tok);
            if(leiatoks[leiatoks.length - 1].type !== 'endline') {
                err = erro(ERR_EXPECTED.format('; no fim da linha', tok.line, 'nada'));
                return leiatoks.length;
            }
            leiatoks = leiatoks.slice(0, leiatoks.length - 1);
            if(leiatoks.length === 0) {
                err = erro(ERR_EXPECTED.format('variável para ler', tok.line, 'nada'));
                return leiatoks.length + 1;
            }
            else if(leiatoks.length > 1) {
                err = erro(ERR_TOO_MANY_TOKENS.format(tok.line, 1, leiatoks.length));
                return leiatoks.length + 1;
            }
            else {
                var varName = leiatoks[0].value;
                if(varName in Constantes) {
                    err = erro(ERR_CONST_CHANGE.format(varName, leiatoks[0].line));
                    return leiatoks.length + 1;
                }
                if(varName in Variaveis) {
                    forceOutput(UltimoOutput);
                    OutputQueue.splice(OutputQueue.indexOf(UltimoOutput), 1);
                    var pVal = prompt(UltimoOutput);
                    if(pVal === null) {
                        err = erro(ERR_NULL_INPUT.format(varName));
                        return leiatoks.length + 1;
                    }
                    var varType = Variaveis[varName][1];
                    if(varType === 'inteiro') {
                        if(isFloat(pVal)) {
                            Variaveis[varName][0] = Math.trunc(pVal);
                            return leiatoks.length + 1;
                        }
                        if(!isInt(pVal)) {
                            err = erro(ERR_WRONG_DATATYPE.format(pVal, varName, varType));
                            return leiatoks.length + 1;
                        }
                    }
                    else if(varType === 'real') {
                        if(!isNum(pVal)) {
                            err = erro(ERR_WRONG_DATATYPE.format(pVal, varName, varType));
                            return leiatoks.length + 1;
                        }
                    }
                    else if(varType === 'caractere') {
                        if(!isString(pVal)) {
                            err = erro(ERR_WRONG_DATATYPE.format(pVal, varName, varType));
                            return leiatoks.length + 1;
                        }
                    }
                    else if(varType === 'logico') {
                        if(!isBool(pVal)) {
                            err = erro(ERR_WRONG_DATATYPE.format(pVal, varName, varType));
                            return leiatoks.length + 1;
                        }
                    }
                    Variaveis[varName][0] = pVal;
                    forceOutput(pVal + '\n');
                }
                else {
                    err = erro(ERR_UNDEFINED.format(varName, leiatoks[0].line));
                    return leiatoks.length + 1;
                }
            }
            return leiatoks.length + 1;
        }
        else if(tok.value === 'LIMPA') {
            var limpatoks = depoisde(tok);
            if(limpatoks.length !== 1) {
                err = erro(ERR_UNEXPECTED.format(limpatoks[0].value, 'LIMPA', tok.line));
                return limpatoks.length;
            }
            if(limpatoks[0].type !== 'endline') {
                err = erro(ERR_EXPECTED.format('; no fim da linha', tok.line, 'nada'));
                return limpatoks.length;
            }
            limparOutput();
            return limpatoks.length;
        }
        else if(tok.value === 'SE') {
            var cond = condicao(tok);
            var ret = 0;
            for(var i = Tokens.indexOf(tok) + 1; i < Tokens.length; i++) {
                ret++;
                if(Tokens[i].value === 'FIMSE' && tabsAntes(tok) === tabsAntes(Tokens[i])) break;
            }
            if(cond < 0) {
                err = erro(ERR_CONDIT.format(tok.line));
                return -ret;
            }
            return ret;
        }
        else if(tok.value === 'SENAO') return 0;
        else if(tok.value === 'SENAOSE') return 0;
        else if(tok.value === 'ENTAO') return 0;
        else if(tok.value === 'FIMSE') return 0;
        else if(tok.value === 'ESCOLHE') return 0;
        else if(tok.value === 'CASO') return 0;
        else if(tok.value === 'FIMESCOLHE') return 0;
        else if(tok.type === 'id') {
            var dps = depoisde(tok);
            if(dps.length < 3) {
                err = erro(ERR_EXPECTED.format('um = e um valor/expressão', tok.line, dps.map(function(subtok){ return subtok.value; }).join(' ')));
                return -dps.length;
            }
            if(dps[dps.length - 1].type !== 'endline') {
                err = erro(ERR_EXPECTED.format('; no fim', tok.line, 'nada'));
                return -dps.length;
            }
            if(dps[0].type !== 'assign') {
                err = erro(ERR_EXPECTED.format('=', tok.line, '{0} ({1})'.format(dps[0].value, dps[0].type)));
                return -dps.length;
            }
            if(tok.value in Constantes) {
                err = erro(ERR_CONST_CHANGE.format(tok.value, tok.line));
                return -dps.length;
            }
            if(!(tok.value in Variaveis)) {
                err = erro(ERR_UNDEFINED.format(tok.value, tok.line));
                return -dps.length;
            }
            if(count('(') !== count(')')) {
                err = erro(ERR_PARENTHESIS.format(tok.line));
                return -dps.length;
            }
            dps = dps.slice(1, dps.length - 1);
            if(dps.length === 1) {
                var d = dps[0];
                if(d.type === 'id') {
                    if(d.value in Variaveis) {
                        var dt = Variaveis[tok.value][1];
                        if(dt === 'inteiro' && Variaveis[d.value][1] === 'inteiro') Variaveis[tok.value][0] = Variaveis[d.value][0];
                        else if(dt === 'real' && (Variaveis[d.value][1] === 'inteiro' || Variaveis[d.value][1] === 'real')) Variaveis[tok.value][0] = Variaveis[d.value][0];
                        else if(dt === 'caractere' && Variaveis[d.value][1] === 'caractere') Variaveis[tok.value][0] = Variaveis[d.value][0];
                        else if(dt === 'logico' && Variaveis[d.value][1] === 'logico') Variaveis[tok.value][0] = Variaveis[d.value][0];
                        else {
                            err = erro(ERR_WRONG_DATATYPE.format(final, tok.value, vdt));
                            return -(dps.length + 1);
                        }
                    }
                    else if(d.value in Constantes) {
                        var dt = Variaveis[tok.value][1];
                        if(dt === 'inteiro' && isInt(Constantes[d.value])) Variaveis[tok.value][0] = Constantes[d.value];
                        else if(dt === 'real' && (isFloat(Constantes[d.value]) || isInt(Constantes[d.value]))) Variaveis[tok.value][0] = Constantes[d.value];
                        else if(dt === 'caractere' && isString(Constantes[d.value])) Variaveis[tok.value][0] = Constantes[d.value];
                        else if(dt === 'logico' && isBool(Constantes[d.value])) Variaveis[tok.value][0] = Constantes[d.value];
                        else {
                            err = erro(ERR_WRONG_DATATYPE.format(final, tok.value, vdt));
                            return -(dps.length + 1);
                        }
                    }
                }
                else if(isCalculable(d.value))
                {
                    var dt = Variaveis[tok.value][1];
                    if(dt === 'inteiro' && isInt(d.value)) Variaveis[tok.value][0] = d.value;
                    else if(dt === 'real' && (isInt(d.value) || isFloat(d.value))) Variaveis[tok.value][0] = d.value;
                    else if(dt === 'caractere' && isString(d.value)) Variaveis[tok.value][0] = d.value;
                    else if(dt === 'logico' && isBool(d.value)) Variaveis[tok.value][0] = d.value;
                    else {
                        err = erro(ERR_WRONG_DATATYPE.format(final, tok.value, vdt));
                        return -(dps.length + 1);
                    }
                }
                else {
                    err = erro(ERR_EXPECTED.format('variável/constante', tok.line, '{0} ({1})'.format(d.value, d.type)));
                    return -(dps.length + 1);
                }
                return dps.length + 1;
            }

            var rpn = calcRpn(dps);
            if(rpn === undefined) {
                err = erro(ERR_MATH_FAIL.format(tok.line) + ' (5)');
                return dps.length + 1;
            }
            // Hora de analisar a notação RPN e calcular o resultado.
            // Esta parte não será tão difícil (eu espero).

            var vdt = Variaveis[tok.value][1]; // Tipo de dados
            if(vdt === 'inteiro' && isFloat(rpn)) Variaveis[tok.value][0] = Math.trunc(rpn);
            else if((vdt === 'caractere') && isString(rpn)) Variaveis[tok.value][0] = rpn;
            else if(vdt === 'inteiro' || vdt === 'real') Variaveis[tok.value][0] = rpn;
            else if(vdt === 'logico' && (rpn === 'verdadeiro' || rpn === 'falso')) Variaveis[tok.value][0] = rpn;
            else {
                err = erro(ERR_WRONG_DATATYPE.format(rpn, tok.value, vdt));
                return -(dps.length + 1);
            }
            return dps.length + 1;
        }
        else if(tok.value === 'FIM') {
            if(!err) {
                output('\n\n>>> Fim da execução do algoritmo \'{0}\'.\n\n'.format(NomeAlgoritmo));

                // Mostra todos os outputs na fila:
                showOutputs();
            }
        }
        else {
            err = erro(ERR_UNEXPECTED_W.format(tok.value, tok.line));
            return 0; // 0 para evitar pulos dentro de escopos
        }
    }

    // Verificações pré-parsing:
    {
        if(!any('ALGORITMO')) err = erro(ERR_MISSING.format('ALGORITMO'));
        if(!any('INICIO')) err = erro(ERR_MISSING.format('INICIO'));
        if(!any('FIM')) err = erro(ERR_MISSING.format('FIM'));
        if(!primeiro('ALGORITMO', 'CONSTANTES')) err = erro(ERR_ORDER.format('ALGORITMO', 'qualquer outro token'));
        if(!primeiro('ALGORITMO', 'VARIAVEIS')) err = erro(ERR_ORDER.format('ALGORITMO', 'qualquer outro token'));
        if(!primeiro('CONSTANTES', 'INICIO') && any('CONSTANTES')) err = erro(ERR_ORDER.format('CONSTANTES', 'INICIO'));
        if(!primeiro('VARIAVEIS', 'INICIO') && any('VARIAVEIS')) err = erro(ERR_ORDER.format('VARIAVEIS', 'INICIO'));
        if(!primeiro('INICIO', 'FIM')) err = erro(ERR_ORDER.format('INICIO', 'FIM'));
        if(any('CONSTANTES') && !primeiro('CONSTANTES', 'VARIAVEIS')) err = erro(ERR_ORDER.format('CONSTANTES', 'VARIAVEIS'));
        if(count('VARIAVEIS') > 1) err = erro(ERR_EQUAL_KEYWORDS.format('VARIAVEIS'));
        if(count('CONSTANTES') > 1) err = erro(ERR_EQUAL_KEYWORDS.format('CONSTANTES'));
        if(count('ALGORITMO') > 1) err = erro(ERR_EQUAL_KEYWORDS.format('ALGORITMO'));
        if(count('INICIO') > 1) err = erro(ERR_EQUAL_KEYWORDS.format('INICIO'));
        if(count('FIM') > 1) err = erro(ERR_EQUAL_KEYWORDS.format('FIM'));
        if(err) return 1;
    }

    // Aqui começa a diversão para o usuário:
    for(token_i = 0; token_i < Tokens.length; token_i++) {
        var tok = Tokens[token_i];
        parseToken(tok);
    }

    if(err) {
        return 1;
    }

    if(DEBUG) {
        log('Nome do algoritmo: {0}'.format(NomeAlgoritmo));
        log('------- Constantes -------');
        for(var const_ in Constantes) {
            log('{0} = {1}'.format(const_, Constantes[const_]));
        }
        if(Object.keys(Constantes).length === 0) log('');
        log('------- Variáveis -------');
        for(var var_ in Variaveis) {
            log('{0} = {1}'.format(var_, Variaveis[var_]));
        }
        if(Object.keys(Variaveis).length === 0) log('');
        log('--------------------------');
    }
    return 0;
}
