// Pomoćne funkcije za deklinaciju
function getNumberForm(number) {
    if (number === 1) return 'jedan';
    if (number === 2) return 'dva';
    if (number === 3) return 'tri';
    if (number === 4) return 'četiri';
    return number.toString();
}

function declineNoun(number, singular, plural2to4, plural5plus) {
    if (number === 1) return singular;
    if (number >= 2 && number <= 4) return plural2to4;
    return plural5plus;
}

let currentTask = null;
let score = 0;

const taskText = document.getElementById('taskText');
const userAnswer = document.getElementById('userAnswer');
const checkButton = document.getElementById('checkAnswer');
const newTaskButton = document.getElementById('newTask');
const resultDiv = document.getElementById('result');
const scoreDiv = document.getElementById('score');

function generateNewTask() {
    const taskTemplate = taskTemplates[Math.floor(Math.random() * taskTemplates.length)];
    const task = taskTemplate.generate();
    currentTask = {
        text: taskTemplate.template(...task.numbers),
        answer: task.answer
    };
    taskText.textContent = currentTask.text;
    userAnswer.value = '';
    resultDiv.textContent = '';
    userAnswer.focus();
}

function checkAnswer() {
    if (!currentTask) return;

    const userValue = parseInt(userAnswer.value);
    if (isNaN(userValue)) {
        resultDiv.textContent = 'Molim te upiši broj!';
        resultDiv.className = 'result incorrect';
        return;
    }

    if (userValue === currentTask.answer) {
        resultDiv.textContent = '🎉 Točno! Bravo!';
        resultDiv.className = 'result correct';
        score++;
        scoreDiv.textContent = `Bodovi: ${score}`;
        setTimeout(generateNewTask, 1500);
    } else {
        resultDiv.textContent = '❌ Netočno. Pokušaj ponovno!';
        resultDiv.className = 'result incorrect';
    }
}

checkButton.addEventListener('click', checkAnswer);
newTaskButton.addEventListener('click', generateNewTask);
userAnswer.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        checkAnswer();
    }
});

// Funkcija za generiranje print previewa
function generatePrintPreview() {
    const printPreview = document.getElementById('printPreview');
    const printTaskList = document.getElementById('printTaskList');
    
    // Očisti postojeće zadatke
    printTaskList.innerHTML = '';
    
    // Generiraj 10 različitih zadataka
    const usedTemplates = new Set();
    for (let i = 0; i < 10; i++) {
        // Odaberi nasumični predložak koji još nije korišten
        let availableTemplates = taskTemplates.filter(template => !usedTemplates.has(template.id));
        if (availableTemplates.length === 0) {
            usedTemplates.clear();
            availableTemplates = taskTemplates;
        }
        
        const template = availableTemplates[Math.floor(Math.random() * availableTemplates.length)];
        usedTemplates.add(template.id);
        
        // Generiraj zadatak
        const task = template.generate();
        
        // Kreiraj element za zadatak
        const taskElement = document.createElement('div');
        taskElement.className = 'print-task';
        
        // Dodaj tekst zadatka
        const taskText = document.createElement('div');
        taskText.className = 'print-task-text';
        taskText.textContent = template.template(...task.numbers);
        
        // Dodaj liniju za odgovor
        const answerLine = document.createElement('div');
        answerLine.className = 'answer-line';
        answerLine.textContent = 'Odgovor: ';
        
        taskElement.appendChild(taskText);
        taskElement.appendChild(answerLine);
        printTaskList.appendChild(taskElement);
    }
    
    // Prikaži print preview
    printPreview.classList.add('show');
    
    // Dodaj event listenere za kontrole
    document.getElementById('doPrint').onclick = () => {
        window.print();
    };
    
    document.getElementById('closePreview').onclick = () => {
        printPreview.classList.remove('show');
    };
}

// Dodaj event listener za gumb za printanje
document.getElementById('printTasks').addEventListener('click', generatePrintPreview);

// Initialize first task
generateNewTask();
