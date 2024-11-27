class NumberLineGame {
    constructor() {
        this.score = 0;
        this.currentTask = null;
        this.maxNumber = 20;
        this.currentPosition = 0;
        this.targetPosition = 0;
        this.isAddition = true;
        
        // Canvas postavke
        this.canvas = document.getElementById('numberLine');
        console.log('Canvas element:', this.canvas);
        this.ctx = this.canvas.getContext('2d');
        console.log('Canvas context:', this.ctx);
        this.setupCanvas();
        
        // DOM elementi
        this.taskElement = document.getElementById('task');
        this.scoreElement = document.getElementById('score');
        this.feedbackElement = document.getElementById('feedback');
        this.newTaskButton = document.getElementById('newTask');
        this.hintButton = document.getElementById('hint');
        this.toggleOperationButton = document.getElementById('toggleOperation');
        this.printTasksButton = document.getElementById('printTasks');
        this.userInput = document.getElementById('userInput');
        this.submitAnswerButton = document.getElementById('submitAnswer');
        this.stepForwardButton = document.getElementById('stepForward');
        this.stepBackwardButton = document.getElementById('stepBackward');

        // Event listeneri
        this.newTaskButton.addEventListener('click', () => this.generateNewTask());
        this.hintButton.addEventListener('click', () => this.showHint());
        this.toggleOperationButton.addEventListener('click', () => this.toggleOperation());
        this.printTasksButton.addEventListener('click', () => this.printTasks());
        this.submitAnswerButton.addEventListener('click', () => this.checkUserInput());
        this.stepForwardButton.addEventListener('click', () => this.step(1));
        this.stepBackwardButton.addEventListener('click', () => this.step(-1));
        this.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.checkUserInput();
        });

        // Inicijalno generiranje zadatka
        this.generateNewTask();
    }

    setupCanvas() {
        // Postavi stvarnu veličinu canvasa
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        console.log('Canvas dimensions:', this.canvas.width, this.canvas.height);
        
        // Izračunaj dimenzije za brojevnu liniju
        this.lineY = this.canvas.height / 2;
        this.startX = 50;
        this.endX = this.canvas.width - 50;
        this.stepWidth = (this.endX - this.startX) / this.maxNumber;
        
        console.log('Line dimensions:', {
            lineY: this.lineY,
            startX: this.startX,
            endX: this.endX,
            stepWidth: this.stepWidth
        });

        // Odmah nacrtaj brojevnu liniju
        this.drawNumberLine();
        
        // Dodaj listener za promjenu veličine
        window.addEventListener('resize', () => {
            const rect = this.canvas.getBoundingClientRect();
            this.canvas.width = rect.width;
            this.canvas.height = rect.height;
            this.lineY = this.canvas.height / 2;
            this.startX = 50;
            this.endX = this.canvas.width - 50;
            this.stepWidth = (this.endX - this.startX) / this.maxNumber;
            this.drawNumberLine();
        });
    }

    drawNumberLine() {
        if (!this.canvas || !this.ctx) {
            console.error('Canvas ili context nije dostupan');
            return;
        }
        
        // Očisti canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Dohvati CSS varijable
        const style = getComputedStyle(document.documentElement);
        const lineColor = '#333333'; // Fiksna boja za liniju
        const textColor = '#333333'; // Fiksna boja za tekst
        const markerColor = '#e91e63'; // Fiksna boja za marker
        
        // Nacrtaj glavnu liniju
        this.ctx.beginPath();
        this.ctx.moveTo(this.startX, this.lineY);
        this.ctx.lineTo(this.endX, this.lineY);
        this.ctx.strokeStyle = lineColor;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // Nacrtaj oznake i brojeve
        for (let i = 0; i <= this.maxNumber; i++) {
            const x = this.startX + (i * this.stepWidth);
            
            // Oznaka
            this.ctx.beginPath();
            this.ctx.moveTo(x, this.lineY - 10);
            this.ctx.lineTo(x, this.lineY + 10);
            this.ctx.strokeStyle = lineColor;
            this.ctx.stroke();

            // Broj
            this.ctx.font = '16px Comic Neue';
            this.ctx.fillStyle = textColor;
            this.ctx.textAlign = 'center';
            this.ctx.fillText(i.toString(), x, this.lineY + 30);
        }

        // Označi trenutnu poziciju
        const currentX = this.startX + (this.currentPosition * this.stepWidth);
        this.ctx.beginPath();
        this.ctx.arc(currentX, this.lineY, 10, 0, Math.PI * 2);
        this.ctx.fillStyle = markerColor;
        this.ctx.fill();
    }

    drawArrow(fromPosition, toPosition) {
        const fromX = this.startX + (fromPosition * this.stepWidth);
        const toX = this.startX + (toPosition * this.stepWidth);
        const arrowY = this.lineY - 30;
        
        // Nacrtaj liniju strelice
        this.ctx.beginPath();
        this.ctx.moveTo(fromX, arrowY);
        this.ctx.lineTo(toX, arrowY);
        this.ctx.strokeStyle = '#e91e63';
        this.ctx.lineWidth = 3;
        this.ctx.stroke();

        // Nacrtaj vrh strelice
        const arrowHeadLength = 10;
        const angle = toX < fromX ? Math.PI : 0;
        this.ctx.beginPath();
        this.ctx.moveTo(toX, arrowY);
        this.ctx.lineTo(toX - arrowHeadLength * Math.cos(angle - Math.PI / 6), 
                       arrowY - arrowHeadLength * Math.sin(angle - Math.PI / 6));
        this.ctx.lineTo(toX - arrowHeadLength * Math.cos(angle + Math.PI / 6),
                       arrowY - arrowHeadLength * Math.sin(angle + Math.PI / 6));
        this.ctx.closePath();
        this.ctx.fillStyle = '#e91e63';
        this.ctx.fill();
    }

    generateNewTask() {
        if (this.isAddition) {
            // Generiranje zadatka zbrajanja
            const maxFirstNumber = 15; // Maksimalni prvi broj za zbrajanje
            this.currentPosition = Math.floor(Math.random() * maxFirstNumber) + 1;
            const maxStep = Math.min(20 - this.currentPosition, 10); // Ograniči korak da suma ne prelazi 20
            const step = Math.floor(Math.random() * maxStep) + 1;
            this.targetPosition = this.currentPosition + step;
            this.currentTask = {
                start: this.currentPosition,
                step: step,
                result: this.targetPosition
            };
            this.taskElement.textContent = `${this.currentPosition} + ${step} = ?`;
        } else {
            // Generiranje zadatka oduzimanja
            this.currentPosition = Math.floor(Math.random() * 11) + 10; // Broj između 10 i 20
            const maxStep = Math.min(this.currentPosition, 10); // Ograniči korak na maksimalno 10
            const step = Math.floor(Math.random() * maxStep) + 1;
            this.targetPosition = this.currentPosition - step;
            this.currentTask = {
                start: this.currentPosition,
                step: step,
                result: this.targetPosition
            };
            this.taskElement.textContent = `${this.currentPosition} - ${step} = ?`;
        }

        // Resetiraj UI
        this.userInput.value = '';
        this.feedbackElement.classList.add('hidden');
        this.drawNumberLine();
    }

    step(direction) {
        const newPosition = this.currentPosition + direction;
        if (newPosition >= 0 && newPosition <= this.maxNumber) {
            this.currentPosition = newPosition;
            this.drawNumberLine();
            
            // Provjeri je li korisnik došao do ciljane pozicije
            if (this.currentPosition === this.targetPosition) {
                this.checkAnswer(this.currentPosition);
            }
        }
    }

    checkUserInput() {
        if (this.userInput.value === '') return;
        
        const userAnswer = parseInt(this.userInput.value);
        this.checkAnswer(userAnswer);
    }

    checkAnswer(userAnswer) {
        const correct = userAnswer === this.targetPosition;
        this.showFeedback(correct);
        
        if (correct) {
            this.score += 1;
            this.scoreElement.textContent = this.score;
            
            // Animiraj score
            this.scoreElement.classList.add('pop');
            setTimeout(() => this.scoreElement.classList.remove('pop'), 300);

            // Prikaži strelicu do točnog odgovora
            this.drawArrow(this.currentTask.start, this.targetPosition);

            // Generiraj novi zadatak nakon kratke pauze
            setTimeout(() => {
                this.currentPosition = this.targetPosition;
                this.generateNewTask();
            }, 1500);
        }
    }

    showFeedback(correct) {
        this.feedbackElement.textContent = correct ? 'Točno! 🎉' : 'Pokušaj ponovno! 💪';
        this.feedbackElement.className = `feedback ${correct ? 'correct' : 'incorrect'}`;
        this.feedbackElement.classList.remove('hidden');
    }

    showHint() {
        const { start, step } = this.currentTask;
        
        let hintText = 'Pokušaj ovako:\n';
        if (this.isAddition) {
            hintText += `1. Kreni od broja ${start}\n`;
            hintText += `2. Pomakni se ${step} mjesta udesno\n`;
            hintText += `3. Broj na kojem završiš je rješenje!`;
        } else {
            hintText += `1. Kreni od broja ${start}\n`;
            hintText += `2. Pomakni se ${step} mjesta ulijevo\n`;
            hintText += `3. Broj na kojem završiš je rješenje!`;
        }
        
        this.feedbackElement.textContent = hintText;
        this.feedbackElement.className = 'feedback hint';
        this.feedbackElement.classList.remove('hidden');
    }

    toggleOperation() {
        this.isAddition = !this.isAddition;
        this.toggleOperationButton.textContent = this.isAddition ? 'Prijeđi na oduzimanje' : 'Prijeđi na zbrajanje';
        this.generateNewTask();
    }

    printTasks() {
        let printContent = `
            <style>
                @media print {
                    body { 
                        font-family: Arial, sans-serif;
                        padding: 20px;
                        margin: 0;
                    }
                    .print-task { 
                        font-size: 16pt; 
                        margin: 30px 0;
                        page-break-inside: avoid;
                        clear: both;
                    }
                    .number-line {
                        width: 100%;
                        height: 100px;
                        margin: 10px 0;
                        display: block;
                    }
                    h2 { 
                        font-size: 20pt; 
                        text-align: center;
                        margin-bottom: 30px;
                    }
                    @page {
                        size: A4;
                        margin: 2cm;
                    }
                    .no-print {
                        display: none !important;
                    }
                }
            </style>
            <h2>Zadaci za vježbu</h2>
        `;

        // Generiraj 10 zadataka
        for (let i = 1; i <= 10; i++) {
            const isAdd = Math.random() < 0.5;
            let num1, num2;
            
            if (isAdd) {
                num1 = Math.floor(Math.random() * 15) + 1;
                num2 = Math.floor(Math.random() * (20 - num1)) + 1;
                printContent += `
                    <div class="print-task">
                        ${i}) ${num1} + ${num2} = ____
                        <canvas class="number-line" width="800" height="100"></canvas>
                    </div>
                `;
            } else {
                num1 = Math.floor(Math.random() * 11) + 10;
                num2 = Math.floor(Math.random() * Math.min(num1, 10)) + 1;
                printContent += `
                    <div class="print-task">
                        ${i}) ${num1} - ${num2} = ____
                        <canvas class="number-line" width="800" height="100"></canvas>
                    </div>
                `;
            }
        }

        // Spremi trenutni sadržaj
        const originalContent = document.body.innerHTML;

        // Postavi sadržaj za print
        document.body.innerHTML = printContent;

        // Nacrtaj brojevne linije na svim canvasima
        document.querySelectorAll('.number-line').forEach(canvas => {
            const ctx = canvas.getContext('2d');
            this.drawNumberLine(ctx);
        });

        // Dodaj malo vremena za renderiranje canvasa
        setTimeout(() => {
            window.print();
            // Vrati originalni sadržaj nakon ispisa
            document.body.innerHTML = originalContent;
            // Ponovno inicijaliziraj igru
            this.initializeGame();
        }, 100);
    }

    drawNumberLine(ctx) {
        const lineY = 50;
        const startX = 30;
        const endX = 770;
        const stepWidth = (endX - startX) / 20;

        // Očisti canvas prije crtanja
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // Nacrtaj glavnu liniju
        ctx.beginPath();
        ctx.moveTo(startX, lineY);
        ctx.lineTo(endX, lineY);
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Nacrtaj oznake i brojeve
        for (let i = 0; i <= 20; i++) {
            const x = startX + (i * stepWidth);
            
            ctx.beginPath();
            ctx.moveTo(x, lineY - 10);
            ctx.lineTo(x, lineY + 10);
            ctx.stroke();

            ctx.font = '12px Arial';
            ctx.fillStyle = '#333';
            ctx.textAlign = 'center';
            ctx.fillText(i.toString(), x, lineY + 25);
        }
    }

    initializeGame() {
        // Ponovno dohvati sve DOM elemente
        this.canvas = document.getElementById('numberLine');
        this.ctx = this.canvas.getContext('2d');
        this.taskElement = document.getElementById('task');
        this.scoreElement = document.getElementById('score');
        this.feedbackElement = document.getElementById('feedback');
        this.newTaskButton = document.getElementById('newTask');
        this.hintButton = document.getElementById('hint');
        this.toggleOperationButton = document.getElementById('toggleOperation');
        this.printTasksButton = document.getElementById('printTasks');
        this.userInput = document.getElementById('userInput');
        this.submitAnswerButton = document.getElementById('submitAnswer');
        this.stepForwardButton = document.getElementById('stepForward');
        this.stepBackwardButton = document.getElementById('stepBackward');

        // Ponovno postavi event listenere
        this.newTaskButton.addEventListener('click', () => this.generateNewTask());
        this.hintButton.addEventListener('click', () => this.showHint());
        this.toggleOperationButton.addEventListener('click', () => this.toggleOperation());
        this.printTasksButton.addEventListener('click', () => this.printTasks());
        this.submitAnswerButton.addEventListener('click', () => this.checkUserInput());
        this.stepForwardButton.addEventListener('click', () => this.step(1));
        this.stepBackwardButton.addEventListener('click', () => this.step(-1));
        this.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.checkUserInput();
        });

        // Ponovno postavi canvas
        this.setupCanvas();

        // Generiraj novi zadatak
        this.generateNewTask();
    }
}

// Pokreni igru
const game = new NumberLineGame();
