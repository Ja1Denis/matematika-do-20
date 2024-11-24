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
        // Nasumično odaberi tip zadatka (zbrajanje ili oduzimanje)
        const taskType = Math.random() < 0.5 ? 'addition' : 'subtraction';
        let num1, num2, result;

        if (taskType === 'addition') {
            // Generiranje brojeva za zbrajanje (rezultat mora biti <= 20)
            do {
                num1 = Math.floor(Math.random() * this.maxNumber) + 1;
                num2 = Math.floor(Math.random() * (this.maxNumber - num1)) + 1;
            } while (num1 + num2 > this.maxNumber);
            
            result = num1 + num2;
            this.currentTask = {
                type: taskType,
                num1: num1,
                num2: num2,
                result: result,
                text: `${num1} + ${num2} = ?`
            };
        } else {
            // Generiranje brojeva za oduzimanje (rezultat mora biti >= 0)
            num1 = Math.floor(Math.random() * this.maxNumber) + 1;
            num2 = Math.floor(Math.random() * num1) + 1;
            result = num1 - num2;
            
            this.currentTask = {
                type: taskType,
                num1: num1,
                num2: num2,
                result: result,
                text: `${num1} - ${num2} = ?`
            };
        }

        this.displayTask();
        if (this.inputMode) {
            this.userInput.value = '';
            this.userInput.focus();
        }
    }

    displayTask() {
        // Prikaži zadatak
        this.taskElement.textContent = this.currentTask.text;
        
        if (!this.inputMode) {
            // Generiraj opcije
            const correctAnswer = this.currentTask.result;
            const options = this.generateOptions(correctAnswer);
            
            // Prikaži opcije
            this.optionsElement.innerHTML = '';
            options.forEach(option => {
                const button = document.createElement('button');
                button.className = 'option';
                button.textContent = option;
                button.addEventListener('click', () => this.checkAnswer(option));
                this.optionsElement.appendChild(button);
            });
        }

        // Sakrij feedback
        this.feedbackElement.className = 'feedback hidden';
    }

    checkUserInput() {
        const userAnswer = parseInt(this.userInput.value);
        if (isNaN(userAnswer)) {
            this.feedbackElement.className = 'feedback error';
            this.feedbackElement.textContent = 'Molim upiši broj!';
            return;
        }
        this.checkAnswer(userAnswer);
    }

    generateOptions(correctAnswer) {
        const options = [correctAnswer];
        
        // Generiraj 3 različite netočne opcije
        while (options.length < 4) {
            let wrongAnswer;
            if (Math.random() < 0.5) {
                // Generiraj broj blizu točnog odgovora
                wrongAnswer = correctAnswer + (Math.floor(Math.random() * 5) + 1) * (Math.random() < 0.5 ? 1 : -1);
            } else {
                // Generiraj nasumični broj između 0 i maxNumber
                wrongAnswer = Math.floor(Math.random() * (this.maxNumber + 1));
            }
            
            // Provjeri je li broj već u opcijama i je li unutar dozvoljenog raspona
            if (!options.includes(wrongAnswer) && wrongAnswer >= 0 && wrongAnswer <= this.maxNumber) {
                options.push(wrongAnswer);
            }
        }
        
        // Promiješaj opcije
        return options.sort(() => Math.random() - 0.5);
    }

    checkAnswer(selectedAnswer) {
        const correct = selectedAnswer === this.currentTask.result;
        
        // Prikaži feedback
        this.feedbackElement.className = `feedback ${correct ? 'success' : 'error'}`;
        this.feedbackElement.textContent = correct ? 
            'Bravo! Točan odgovor! 🎉' : 
            `Pokušaj ponovno! Točan odgovor je ${this.currentTask.result}`;

        // Ažuriraj bodove
        if (correct) {
            this.score += 10;
            this.scoreElement.textContent = this.score;
            
            // Animiraj score
            this.scoreElement.classList.add('pop');
            setTimeout(() => this.scoreElement.classList.remove('pop'), 300);

            // Generiraj novi zadatak nakon kratke pauze
            setTimeout(() => this.generateNewTask(), 1500);
        }
    }

    showHint() {
        let hintText = '';
        if (this.currentTask.type === 'addition') {
            hintText = `Pokušaj brojati od ${this.currentTask.num1} prema gore ${this.currentTask.num2} puta`;
        } else {
            hintText = `Pokušaj brojati od ${this.currentTask.num1} prema dolje ${this.currentTask.num2} puta`;
        }
        
        this.feedbackElement.className = 'feedback';
        this.feedbackElement.textContent = hintText;
    }

    generatePrintTask() {
        const taskType = Math.random() < 0.5 ? 'addition' : 'subtraction';
        let num1, num2;

        if (taskType === 'addition') {
            do {
                num1 = Math.floor(Math.random() * this.maxNumber) + 1;
                num2 = Math.floor(Math.random() * (this.maxNumber - num1)) + 1;
            } while (num1 + num2 > this.maxNumber);
            return `${num1} + ${num2} = ____`;
        } else {
            num1 = Math.floor(Math.random() * this.maxNumber) + 1;
            num2 = Math.floor(Math.random() * num1) + 1;
            return `${num1} - ${num2} = ____`;
        }
    }

    printTasks() {
        const printSection = document.getElementById('printTasks');
        printSection.innerHTML = '';

        // Generiraj 10 zadataka za print
        for (let i = 1; i <= 10; i++) {
            const taskDiv = document.createElement('div');
            taskDiv.className = 'print-task';
            taskDiv.innerHTML = `${i}. ${this.generatePrintTask()}`;
            printSection.appendChild(taskDiv);
        }

        // Otvori print dijalog
        window.print();
    }
}

// Pokreni igru
const game = new MathGame();
