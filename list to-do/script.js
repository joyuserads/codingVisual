document.addEventListener('DOMContentLoaded', () => {
    // --- Referências aos elementos do DOM ---
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const changeThemeBtn = document.getElementById('changeThemeBtn');
    const body = document.body; // Referência ao body para mudar o fundo

    // --- Funções de Ajuda ---

    // Função para gerar uma cor hexadecimal aleatória
    function getRandomHexColor() {
        // Gera um número hexadecimal de 6 dígitos
        const randomColor = Math.floor(Math.random() * 16777215).toString(16);
        // Garante que tenha 6 dígitos, preenchendo com zeros à esquerda se necessário
        return '#' + randomColor.padStart(6, '0');
    }

    // Função para salvar as tarefas no LocalStorage
    function saveTasks() {
        // Pega todos os itens da lista
        const tasks = [];
        taskList.querySelectorAll('li').forEach(li => {
            tasks.push({
                text: li.querySelector('span').textContent, // Pega o texto da tarefa
                completed: li.classList.contains('completed') // Verifica se tem a classe 'completed'
            });
        });
        // Converte o array de objetos para uma string JSON e salva
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Função para carregar as tarefas do LocalStorage
    function loadTasks() {
        const storedTasks = localStorage.getItem('tasks');
        if (storedTasks) {
            // Converte a string JSON de volta para um array de objetos
            const tasks = JSON.parse(storedTasks);
            tasks.forEach(task => {
                // Para cada tarefa salva, cria o elemento no DOM
                createTaskElement(task.text, task.completed);
            });
        }
    }

    // Função para criar um novo elemento de tarefa (li) no DOM
    function createTaskElement(taskText, isCompleted = false) {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${taskText}</span>
            <div class="task-actions">
                <button class="delete-btn">Excluir</button>
            </div>
        `;

        // Marca como concluído se for o caso (ao carregar do LocalStorage)
        if (isCompleted) {
            li.classList.add('completed');
        }

        // Adiciona evento para marcar/desmarcar tarefa ao clicar no texto
        li.querySelector('span').addEventListener('click', () => {
            li.classList.toggle('completed'); // Alterna a classe 'completed'
            saveTasks(); // Salva as tarefas após a mudança
        });

        // Adiciona evento para o botão de exclusão
        li.querySelector('.delete-btn').addEventListener('click', () => {
            li.remove(); // Remove o elemento <li> do DOM
            saveTasks(); // Salva as tarefas após a exclusão
        });

        // Adiciona a nova tarefa ao topo da lista
        taskList.prepend(li); // 'prepend' adiciona no início da lista
    }

    // --- Event Listeners ---

    // Evento para adicionar tarefa ao clicar no botão 'Adicionar'
    addTaskBtn.addEventListener('click', () => {
        const taskText = taskInput.value.trim(); // Pega o texto e remove espaços em branco
        if (taskText !== '') { // Verifica se o input não está vazio
            createTaskElement(taskText); // Cria o elemento da tarefa
            taskInput.value = ''; // Limpa o input
            saveTasks(); // Salva as tarefas
        } else {
            alert('Por favor, digite uma tarefa!'); // Alerta se o input estiver vazio
        }
    });

    // Evento para adicionar tarefa ao pressionar 'Enter' no input
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTaskBtn.click(); // Simula o clique no botão 'Adicionar'
        }
    });

    // Evento para mudar a cor de fundo ao clicar no botão 'Mudar Tema'
    changeThemeBtn.addEventListener('click', () => {
        const newColor = getRandomHexColor(); // Gera uma nova cor aleatória
        body.style.backgroundColor = newColor; // Aplica a cor ao body
        // Opcional: Salvar a cor do tema no LocalStorage para que ela persista
        localStorage.setItem('themeColor', newColor);
    });

    // --- Inicialização ---
    // Carrega as tarefas salvas quando a página é carregada
    loadTasks();

    // Carrega a cor do tema salva (se houver), ou define uma padrão
    const savedThemeColor = localStorage.getItem('themeColor');
    if (savedThemeColor) {
        body.style.backgroundColor = savedThemeColor;
    } else {
        // Se não houver cor salva, use a cor padrão do CSS ou gere uma inicial
        // body.style.backgroundColor = getRandomHexColor(); // Descomente para começar com cor aleatória
    }
});