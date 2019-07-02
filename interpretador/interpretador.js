function interpretar() {
    var src = $('#cod')[0].value;

    // Regex do mal para remover comentários:
    src = src.replace(/\{[^{}]*\}/g, '');

    var err = parse(lex(src));
}
