
// Aguarda o DOM (Document Object Model) ser completamente carregado antes de executar o script.
// Isso garante que todos os elementos HTML já estejam disponíveis para manipulação.
document.addEventListener('DOMContentLoaded', () => {
    // **Seleção de Elementos do DOM**
    // Obtém a referência para o elemento HTML que exibe o resultado da calculadora (a "tela").
    const display = document.getElementById('display');

    // Obtém uma NodeList de todos os botões que possuem a classe 'button'.
    const buttons = document.querySelectorAll('.button');

    // **Variáveis de Estado da Calculadora**
    // 'currentInput' armazena o número que o usuário está digitando atualmente ou o resultado da operação.   
    let currentInput = '0';

    // 'operator' armazena o operador matemático selecionado (+, -, *, /).
    // Começa como 'null' porque nenhuma operação foi selecionada ainda.
    let operator = null;

    // 'firstInput' armazena o primeiro número da operação, antes do operador ser clicado.
    firstInput = '';
    
    // 'awaitingNextInput' é uma flag booleana.
    // 'true' significa que a calculadora está esperando o usuário digitar o segundo número da operação.
    // 'false' significa que o usuário ainda está digitando o primeiro número ou o resultado acabou de ser exibido.
    let awaitingNextInput = false;


    // **Função para Atualizar o Display**
    // Esta função simples define o texto do elemento 'display' com o valor de 'currentInput'.
    function updateDisplay() {
        display.textContent = currentInput;
    }


    // **Adição de Event Listeners a Todos os Botões**
    // Itera sobre cada botão na NodeList 'buttons'.
    buttons.forEach(button => {
        // Adiciona um 'event listener' de 'click' a cada botão.
        // Quando um botão é clicado, a função anônima é executada.
        button.addEventListener('click', (e) => {
            // Obtém o texto contido dentro do botão que foi clicado.
            const buttonText = e.target.textContent;

            // **Lógica para Números e Ponto Decimal**
            // Verifica se o botão clicado possui a classe 'number' (incluindo o ponto decimal).
            if (e.target.classList.contains('number')) {
                // Se 'awaitingNextInput' for verdadeiro, significa que um operador foi clicado
                // e o próximo clique de número deve iniciar um novo 'currentInput'.
                if (awaitingNextInput) {
                    // Se o botão clicado for o ponto, inicia '0.'; caso contrário, inicia com o número.
                    currentInput = buttonText === '.' ? '0.' : buttonText;
                    // Reseta a flag, pois o novo número já começou a ser digitado.
                    awaitingNextInput = false;
                } else {
                    // Se o botão clicado for o ponto e 'currentInput' já contém um ponto,
                    // ignora para evitar múltiplos pontos decimais (ex: "3..5").
                    if (buttonText === '.' && currentInput.includes('.')) {
                        return;
                    }
                    // Se 'currentInput' for '0' e o botão clicado não for o ponto,
                    // substitui o '0' pelo novo número (ex: '0' -> '7').
                    if (currentInput === '0' && buttonText !== '.') {
                        currentInput = buttonText;
                    } else {
                        // Caso contrário, adiciona o novo dígito ao 'currentInput'.
                        currentInput += buttonText;
                    }
                }
                // Atualiza a tela da calculadora para mostrar o 'currentInput'.
                updateDisplay();
                // Retorna para sair da função, pois a lógica para números foi tratada.
                return;
            }

            // **Lógica para o Botão "C" (Clear)**
            // Verifica se o ID do botão clicado é 'clear'.
            if (e.target.id === 'clear') {
                // Reseta todas as variáveis de estado para seus valores iniciais.
                currentInput = '0';
                operator = null;
                firstInput = '';
                awaitingNextInput = false;
                // Atualiza a tela para mostrar '0'.
                updateDisplay();
                return;
            }

            // **Lógica para Operadores (+, -, *, /)**
            // Verifica se o botão clicado possui a classe 'operator'.
            if (e.target.classList.contains('operator')) {
                // Se já houver um operador e não estivermos esperando um novo input,
                // significa que o usuário está encadeando operações (ex: "5 + 3 +").
                // Neste caso, calcula o resultado da operação anterior antes de definir o novo operador.
                if (operator && !awaitingNextInput) {
                    calculate();
                }
                // Armazena o operador clicado.
                operator = buttonText;
                // Move o 'currentInput' para 'firstInput', pois ele é o primeiro operando.
                firstInput = currentInput;
                // Define a flag para 'true', indicando que agora estamos esperando o segundo número.
                awaitingNextInput = true;
                return;
            }

            // **Lógica para o Botão "=" (Equals)**
            // Verifica se o ID do botão clicado é 'equals'.
            if (e.target.id === 'equals') {
                // Executa o cálculo somente se houver um operador e um 'first' válido.
                if (operator && firstInput !== '') {
                    calculate();
                    // Após o cálculo, o operador é resetado.
                    operator = null;
                    // Define a flag para 'true' para que o próximo clique de número
                    // inicie um novo cálculo em vez de continuar o anterior.
                    awaitingNextInput = true;
                }
                return;
            }
        });
    });

    // **Função para Realizar o Cálculo**
    // Esta função é chamada quando um novo operador é clicado (para encadeamento) ou o '=' é clicado.
    function calculate() {
        let result; // Variável para armazenar o resultado da operação.
        // Converte os inputs para números de ponto flutuante.
        const prev = parseFloat(firstInput);
        const current = parseFloat(currentInput);

        // Se 'prev' ou 'current' não forem números válidos, interrompe a função para evitar erros.
        if (isNaN(prev) || isNaN(current)) return;

        // Utiliza um 'switch' para executar a operação correta baseada no 'operator'.
        switch (operator) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '*':
                result = prev * current;
                break;
            case '/':
                // Lida com o caso de divisão por zero.
                if (current === 0) {
                    currentInput = 'Erro: Div por zero'; // Exibe mensagem de erro no display.
                    operator = null; // Reseta o operador.
                    firstInput = ''; // Limpa o input anterior.
                    awaitingNextInput = true; // Prepara para um novo input.
                    return; // Interrompe a função.
                }
                result = prev / current;
                break;
            default:
                // Se não houver operador válido, não faz nada e sai da função.
                return;
        }
        // Converte o resultado de volta para string e atualiza 'currentInput'.
        currentInput = result.toString();
        // Atualiza a tela com o resultado.
        updateDisplay();
        // Limpa 'first Input' para a próxima operação.
        firstInput = '';
    }

    // **Inicialização**
    // Chama 'updateDisplay()' uma vez ao carregar a página para garantir que o '0' inicial seja exibido.
    updateDisplay();
})