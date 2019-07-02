<!DOCTYPE html>
<html lang="pt-br">
	<head>
		<meta charset="utf-8">
		<title>
			Interpretador de Pseudocódigo
		</title>
		<link rel="stylesheet" type="text/css" href="style.css">
		<link rel="stylesheet" type="text/css" href="jquery-lta/jquery-linedtextarea.css">
		<script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>

		<script src="interpretador/interpretador.js"></script>
		<script src="interpretador/expressoes.js"></script>
		<script src="interpretador/verificacoes.js"></script>
		<script src="interpretador/token.js"></script>
		<script src="interpretador/utils.js"></script>
		<script src="interpretador/constantes.js"></script>
		<script src="interpretador/lexer.js"></script>
		<script src="interpretador/parser.js"></script>
		<script src="interpretador/erros.js"></script>

		<script src="jquery-lta/jquery-linedtextarea.js"></script>
	</head>
	<body onload="fixTareas();">
		<h2>Interpretador de pseudocódigos</h2>
		<h3>Desenvolvido por Lucas Rodrigues (Github: <a href="https://github.com/lucasrdrgs">@lucasrdrgs</a>)</h3>
		<p><b><i>Beta Dev Branch</i></b></p>
		<span>Insira abaixo seu pseudocódigo (saída à direita):</span><br><br>
		<textarea id="cod" spellcheck="false" name="cod"></textarea>
		<textarea readonly autocomplete="off" id="out" name="out">[ Saída ]&#010;&#010;</textarea>
		<textarea readonly style="visibility: hidden;" autocomplete="off" id="dev" name="dev">Debug (ignore):&#010;</textarea><br><br>
		<button onclick="interpretar();">Executar</button><br>
		<button onclick="limparOutput();">Limpar Saída</button><br>
		<button onclick="carregar('exemplo.pseudo');">Carregar algoritmo "exemplo" de Lucas</button><br>
		<button onclick="carregar('caique.pseudo');">Carregar algoritmo "Caixa" de Caique</button><br>
		<button onclick="carregar('troca.pseudo');">Carregar algoritmo "troca" de Lucas</button><br>
		<button onclick="carregar('inverter.pseudo');">Carregar algoritmo "inverter" de Lucas</button><br><br><br><br>
	</body>
</html>

<?php

$script = isset($_GET['script']) ? $_GET['script'] : 'exemplo';

echo "<script>carregar('" . $script . ".pseudo');</script>";

?>
