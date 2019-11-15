function limparOutput() {
    $('#out')[0].value = '[ Saída ]\n\n';
}

function log(msg) {
    if(!DEBUG) return;
    $('#dev')[0].value += msg + '\n';
    console.log(msg);
}

OutputQueue = [];

function emptyQueue() {
    OutputQueue = [];
    return 0;
}

function forceOutput(msg) {
    $('#out')[0].value += msg;
    return msg;
}

function output(msg) {
    OutputQueue.push(msg);
    return msg;
    // $('#out')[0].value += msg;
}

function showOutputs() {
    var out = $('#out')[0];
    for(var i = 0; i < OutputQueue.length; i++) {
        out.value += OutputQueue[i].replace('\\n', '\n');
    }
    emptyQueue();
}

function erro(msg) {
    $('#out')[0].value += '\n[ERR] {0}\n'.format(msg);
    return true;
}

if(!String.prototype.format) {
	String.prototype.format = function() {
		var args = arguments;
		return this.replace(/{(\d+)}/g, function(match, number) {
			return typeof args[number] != 'undefined' ? args[number] : match;
		});
	}
}

function carregar(nome) {
	if (location.protocol !== 'https:') {
		alert("Não é possível carregar algoritmos se a página não estiver aberta em HTTPS. Clique OK para ser redirecionado...");
		window.location.href = 'https://c5k.ddns.net:8788/pseudocodigo/';
	}
	$.ajax({url: 'https://c5k.ddns.net:8788/pseudocodigo/' + nome, success: function(data)
	{
		var tarea = $('#cod')[0];
		tarea.value = data;
	}});
}

function fixTareas()
{
    var textareas = document.getElementsByTagName('textarea');
    var count = textareas.length;
    for(var i = 0; i < count; i++) {
        if(textareas[i].id === 'cod')
        textareas[i].onkeydown = function(e) {
            if(e.keyCode == 9 || e.which == 9) {
                e.preventDefault();
                var s = this.selectionStart;
                this.value = this.value.substring(0,this.selectionStart) + "\t" + this.value.substring(this.selectionEnd);
                this.selectionEnd = s + 1;
            }
        }
    }
    $('#cod').linedtextarea();
    $('.lines')[0].style.width = '35px';
    $('.lines')[0].style.height = '392px';
    $('.linedwrap')[0].style.height = '392px';
    $('.linedtextarea')[0].style.height = '392px';
	$('#cod')[0].style.height = '99%';
    if(DEBUG) $('#dev')[0].style.visibility = 'visible';
}

function debug(toggle) {
    DEBUG = toggle;
    $('#dev')[0].style.visibility = DEBUG ? 'visible' : 'hidden';
}

Array.prototype.peek = function() {
    return this.slice(-1)[0];
};

Array.prototype.insertAt = function(index, item) {
    this.splice(index, 0, item);
};
/*
String.prototype.prec() = function() {
    return OP_PREC[this];
}

String.prototype.assoc() = function() {
    return OP_ASSOC[this];
}
*/
