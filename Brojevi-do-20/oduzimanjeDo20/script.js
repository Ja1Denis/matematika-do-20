class MathGame {
    constructor() {
        this.score = 0;
        this.currentTask = null;
        this.maxNumber = 20;
        this.inputMode = false;
        
        // DOM elementi
        this.taskElement = document.getElementById('task');
        this.optionsElement = document.getElementById('options');
        this.scoreElement = document.getElementById('score');
        this.feedbackElement = document.getElementById('feedback');
        this.newTaskButton = document.getElementById('newTask');
        this.hintButton = document.getElementById('hint');
        this.toggleInputButton = document.getElementById('toggleInput');
        this.printTasksButton = document.getElementById('printTasks');
        this.userInput = document.getElementById('userInput');
        this.submitAnswerButton = document.getElementById('submitAnswer');
        this.inputContainer = document.querySelector('.input-container');

        // Event listeneri
        this.newTaskButton.addEventListener('click', () => this.generateNewTask());
        this.hintButton.addEventListener('click', () => this.showHint());
        this.toggleInputButton.addEventListener('click', () => this.toggleInputMode());
        this.printTasksButton.addEventListener('click', () => this.printTasks());
        this.submitAnswerButton.addEventListener('click', () => this.checkUserInput());
        this.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.checkUserInput();
        });

        // Inicijalno generiranje zadatka
        this.generateNewTask();
    }

    toggleInputMode() {
        this.inputMode = !this.inputMode;
        this.inputContainer.classList.toggle('hidden');
        this.optionsElement.classList.toggle('hidden');
        this.toggleInputButton.textContent = this.inputMode ? 'Način izbora' : 'Način unosa';
        this.generateNewTask();
    }

    generateNewTask() {
        // Generiranje brojeva za oduzimanje (prvi broj mora biti veći od drugog)
        let num1, num2;
        do {
            num1 = Math.floor(Math.random() * this.maxNumber) + 1;
            num2 = Math.floor(Math.random() * num1) + 1; // osigurava da je num2 manji od num1
        } while (num1 === num2); // izbjegavamo oduzimanje istih brojeva

        const result = num1 - num2;
        
        this.currentTask = {
            num1: num1,
            num2: num2,
            result: result,
            operator: '-'
        };

        // Prikaži zadatak
        this.taskElement.textContent = `${num1} - ${num2} = `;

        if (this.inputMode) {
            this.userInput.value = '';
            this.userInput.focus();
        } else {
            this.generateOptions(result);
        }

        // Sakrij feedback
        this.feedbackElement.classList.add('hidden');
    }

    generateOptions(correctAnswer) {
        // Očisti postojeće opcije
        this.optionsElement.innerHTML = '';

        // Generiraj array s točnim odgovorom i nasumičnim opcijama
        let options = [correctAnswer];
        
        while (options.length < 4) {
            // Generiramo nasumični broj između 0 i 20
            let randomOption;
            do {
                randomOption = Math.floor(Math.random() * (this.maxNumber + 1));
            } while (options.includes(randomOption));
            
            options.push(randomOption);
        }

        // Promiješaj opcije
        options = options.sort(() => Math.random() - 0.5);

        // Stvori gumbe s opcijama
        options.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option;
            button.classList.add('option-button');
            button.addEventListener('click', () => this.checkAnswer(option));
            this.optionsElement.appendChild(button);
        });
    }

    checkAnswer(userAnswer) {
        const correct = userAnswer === this.currentTask.result;
        this.showFeedback(correct);
        
        if (correct) {
            this.score += 1;
            this.scoreElement.textContent = this.score;
            // Generiraj novi zadatak nakon kratke pauze
            setTimeout(() => this.generateNewTask(), 1000);
        }
    }

    checkUserInput() {
        if (this.userInput.value === '') return;
        
        const userAnswer = parseInt(this.userInput.value);
        this.checkAnswer(userAnswer);
    }

    showFeedback(correct) {
        this.feedbackElement.textContent = correct ? 'Točno! 🎉' : 'Pokušaj ponovno! 💪';
        this.feedbackElement.className = 'feedback ' + (correct ? 'correct' : 'incorrect');
        this.feedbackElement.classList.remove('hidden');
    }

    showHint() {
        const { num1, num2 } = this.currentTask;
        
        // Prikaži vizualnu pomoć za oduzimanje
        let hintText = `Pokušaj ovako:\n`;
        hintText += `1. Kreni od većeg broja (${num1})\n`;
        hintText += `2. Odbrojaj ${num2} prema nazad\n`;
        hintText += `3. Broj na kojem završiš je rješenje!`;
        
        this.feedbackElement.textContent = hintText;
        this.feedbackElement.className = 'feedback hint';
        this.feedbackElement.classList.remove('hidden');
    }

    printTasks() {
        // Generiraj zadatke
        let printContent = `
            <style>
                @media print {
                    body { font-family: Arial, sans-serif; }
                    .print-task { 
                        font-size: 16pt; 
                        margin: 30px 0;
                        page-break-inside: avoid;
                    }
                    h2 { 
                        font-size: 20pt; 
                        text-align: center;
                        margin-bottom: 30px;
                    }
                }
            </style>
            <h2>Zadaci za vježbu</h2>
        `;

        for (let i = 1; i <= 10; i++) {
            const num1 = Math.floor(Math.random() * this.maxNumber) + 1;
            const num2 = Math.floor(Math.random() * num1) + 1;
            printContent += `<div class="print-task">${i}. ${num1} - ${num2} = ____</div>`;
        }

        // Spremi trenutni sadržaj
        const originalContent = document.body.innerHTML;

        // Postavi sadržaj za print
        document.body.innerHTML = printContent;

        // Print
        window.print();

        // Vrati originalni sadržaj
        document.body.innerHTML = originalContent;

        // Ponovno inicijaliziraj igru
        this.initializeGame();
    }

    initializeGame() {
        // Ponovno dohvati sve DOM elemente nakon vraćanja HTML-a
        this.taskElement = document.getElementById('task');
        this.optionsElement = document.getElementById('options');
        this.scoreElement = document.getElementById('score');
        this.feedbackElement = document.getElementById('feedback');
        this.newTaskButton = document.getElementById('newTask');
        this.hintButton = document.getElementById('hint');
        this.toggleInputButton = document.getElementById('toggleInput');
        this.printTasksButton = document.getElementById('printTasks');
        this.userInput = document.getElementById('userInput');
        this.submitAnswerButton = document.getElementById('submitAnswer');
        this.inputContainer = document.querySelector('.input-container');

        // Ponovno dodaj event listenere
        this.newTaskButton.addEventListener('click', () => this.generateNewTask());
        this.hintButton.addEventListener('click', () => this.showHint());
        this.toggleInputButton.addEventListener('click', () => this.toggleInputMode());
        this.printTasksButton.addEventListener('click', () => this.printTasks());
        this.submitAnswerButton.addEventListener('click', () => this.checkUserInput());
        this.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.checkUserInput();
        });

        // Generiraj novi zadatak
        this.generateNewTask();
    }
}

// Pokreni igru
const game = new MathGame();
