# InterpretadorJS
Esse programa é uma implementação em JavaScript de um modelo de pseudocódigo parecido com Portugol. É quase turing-complete, só falta adicionar laços de repetição.

## Lembrete
O código foi feito em menos de uma semana pois eu estava com preguiça de fazer teste de mesa para os algoritmos propostos nas aulas de programação do 1º semestre do curso e decidi automatizar esse trabalho, portanto é incompleto, mal otimizado e difícil de entender. Sinta-se livre para submeter um pull request. **O projeto foi descontinuado**.

### Exemplo de um programa simples para multiplicar dois números:
```
ALGORITMO multiplicar
VARIAVEIS
	inteiro x, y, z;
INICIO
	ESCREVA "Digite um valor para X: ";
	LEIA x;
	ESCREVA "Digite um valor para Y: ";
	LEIA y;
	z = x * y;
	ESCREVA "X multiplicado por Y é igual a " + z + "\n";
FIM
```
### Exemplo de um programa que verifica se um número é par:
```
ALGORITMO multiplicar
VARIAVEIS
	inteiro x;
INICIO
	ESCREVA "Digite um número: ";
	LEIA x;
	SE (x % 2 == 0) ENTAO
		ESCREVA "O número é par.\n";
	SENAO
		ESCREVA "O número não é par.\n";
	FIMSE
FIM
```
