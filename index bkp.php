<!DOCTYPE html lang="pt-br">
	<head>
		<meta charset="utf-8">
		<title>
			Interpretador de Pseudocódigo
		</title>
		<link rel="stylesheet" type="text/css" href="style.css">
		<script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
		<script src="interpretador.js"></script>
		<script src="expressoes.js"></script>
		<script src="verificacoes.js"></script>
		<script src="token.js"></script>
		<script src="utils.js"></script>
		<script>
		function fixTareas()
		{
			var textareas = document.getElementsByTagName('textarea');
			var count = textareas.length;
			for(var i = 0; i < count; i++) {
			    textareas[i].onkeydown = function(e) {
			        if(e.keyCode == 9 || e.which == 9) {
			            e.preventDefault();
			            var s = this.selectionStart;
			            this.value = this.value.substring(0,this.selectionStart) + "\t" + this.value.substring(this.selectionEnd);
			            this.selectionEnd = s + 1;
			        }
			    }
			}
		}
		</script>
	</head>
	<body onload="fixTareas();">
		<h2>Interpretador de pseudocódigos</h2>
		<h4>Desenvolvido por Lucas Rodrigues (Github: <a href="https://github.com/lucasrdrgs">@lucasrdrgs</a>)</h4>
		<i><p>Development Branch</p></i>
		<p>Changelogs:</p>
		<ul>
			<li>Indev2: Adicionado um parser de expressões matemáticas.</li>
			<li>Indev3: Adicionado um lexer primitivo.</li>
		</ul>
		<span>Insira abaixo seu pseudocódigo (saída à direita):</span></br></br>
		<textarea autocomplete="off" style="white-space: pre-wrap; width: 350px; height: 400px;" id="cod" name="cod"></textarea>
		<textarea readonly autocomplete="off" style="white-space: pre-wrap; width: 350px; height: 400px;" id="out" name="out">[ IPC Indev3 ]&#013;&#010;&#013;&#010;</textarea>
		<textarea readonly autocomplete="off" style="width: 300px; height: 400px;" id="dev" name="dev">Debug (ignore):&#013;&#010;</textarea></br></br>
		<!--<span>Insira abaixo suas entradas (para o comando LEIA):</span></br></br>
		<textarea style="width: 704px; height: 100px;" id="inp" name="inp">Usuário</textarea></br></br> : DESABILITADO PQ EXISTE PROMPT()-->
		<button onclick="interpretar();">Executar</button></br>
		<button onclick="limparOutput();">Limpar Saída</button></br></br></br></br>
	</body>
</html>
