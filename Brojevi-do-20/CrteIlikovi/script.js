class DrawingGame {
    constructor() {
        this.canvas = document.getElementById('drawingCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.score = 0;
        this.highScore = parseInt(localStorage.getItem('highScore')) || 0;
        this.level = 1;
        this.isDrawing = false;
        this.startPoint = null;
        this.endPoint = null;
        this.baseLine = null;
        this.userLine = null;
        this.difficulty = 'easy';
        this.soundEnabled = true;
        this.timeLeft = 30;
        this.timerInterval = null;
        
        this.setupCanvas();
        this.setupEventListeners();
        this.loadHighScore();
        this.generateNewTask();
        this.startTimer();
    }

    setupCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        
        window.addEventListener('resize', () => {
            const rect = this.canvas.getBoundingClientRect();
            this.canvas.width = rect.width;
            this.canvas.height = rect.height;
            this.redrawCanvas();
        });
    }

    setupEventListeners() {
        this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        this.canvas.addEventListener('mousemove', (e) => this.draw(e));
        this.canvas.addEventListener('mouseup', () => this.stopDrawing());
        this.canvas.addEventListener('mouseout', () => this.stopDrawing());

        document.getElementById('newTask').addEventListener('click', () => this.generateNewTask());
        document.getElementById('checkLine').addEventListener('click', () => this.checkAnswer());
        document.getElementById('clearCanvas').addEventListener('click', () => this.clearUserLine());
        document.getElementById('hint').addEventListener('click', () => this.showHint());
        document.getElementById('toggleSound').addEventListener('click', () => this.toggleSound());
        document.getElementById('printTasks').addEventListener('click', () => this.printTasks());

        // Difficulty buttons
        document.getElementById('easyMode').addEventListener('click', () => this.setDifficulty('easy'));
        document.getElementById('mediumMode').addEventListener('click', () => this.setDifficulty('medium'));
        document.getElementById('hardMode').addEventListener('click', () => this.setDifficulty('hard'));
    }

    setDifficulty(level) {
        this.difficulty = level;
        document.querySelectorAll('.difficulty-controls .button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(level + 'Mode').classList.add('active');
        
        // Prilagodi parametre prema težini
        switch(level) {
            case 'easy':
                this.timeLeft = 30;
                break;
            case 'medium':
                this.timeLeft = 20;
                break;
            case 'hard':
                this.timeLeft = 15;
                break;
        }
        
        this.generateNewTask();
    }

    startTimer() {
        if (this.timerInterval) clearInterval(this.timerInterval);
        
        const timerSpan = document.querySelector('#timer span');
        timerSpan.textContent = this.timeLeft;
        
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            timerSpan.textContent = this.timeLeft;
            
            if (this.timeLeft <= 5) {
                timerSpan.style.color = '#e74c3c';
            }
            
            if (this.timeLeft <= 0) {
                clearInterval(this.timerInterval);
                this.showFeedback('Vrijeme je isteklo!', false);
                this.generateNewTask();
            }
        }, 1000);
    }

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        const soundButton = document.getElementById('toggleSound');
        soundButton.textContent = this.soundEnabled ? '🔊 Zvuk' : '🔇 Zvuk';
    }

    playSound(type) {
        if (!this.soundEnabled) return;
        
        const sound = document.getElementById(type + 'Sound');
        if (sound) {
            sound.currentTime = 0;
            sound.play();
        }
    }

    loadHighScore() {
        document.getElementById('highScore').textContent = this.highScore;
    }

    updateHighScore() {
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('highScore', this.highScore);
            document.getElementById('highScore').textContent = this.highScore;
            this.showFeedback('Novi najbolji rezultat! 🎉', true);
        }
    }

    generateNewTask() {
        clearInterval(this.timerInterval);
        
        // Postavi vrijeme prema težini
        switch(this.difficulty) {
            case 'easy': this.timeLeft = 30; break;
            case 'medium': this.timeLeft = 20; break;
            case 'hard': this.timeLeft = 15; break;
        }
        
        // Generiraj kontrolne točke za zakrivljenu liniju
        const margin = this.difficulty === 'hard' ? 30 : 50;
        const x1 = margin + Math.random() * (this.canvas.width - 2 * margin);
        const y1 = margin + Math.random() * (this.canvas.height - 2 * margin);
        const x2 = margin + Math.random() * (this.canvas.width - 2 * margin);
        const y2 = margin + Math.random() * (this.canvas.height - 2 * margin);
        
        // Kontrolne točke za zakrivljenost
        const cx1 = margin + Math.random() * (this.canvas.width - 2 * margin);
        const cy1 = margin + Math.random() * (this.canvas.height - 2 * margin);
        const cx2 = margin + Math.random() * (this.canvas.width - 2 * margin);
        const cy2 = margin + Math.random() * (this.canvas.height - 2 * margin);

        this.baseLine = { x1, y1, x2, y2, cx1, cy1, cx2, cy2 };
        this.generatePoints();
        this.userLine = null;
        this.redrawCanvas();
        this.hideFeedback();
        this.startTimer();
    }

    generatePoints() {
        const margin = this.difficulty === 'hard' ? 30 : 50;
        let attempts = 0;
        const maxAttempts = 100;

        do {
            const x1 = margin + Math.random() * (this.canvas.width - 2 * margin);
            const y1 = margin + Math.random() * (this.canvas.height - 2 * margin);
            const x2 = margin + Math.random() * (this.canvas.width - 2 * margin);
            const y2 = margin + Math.random() * (this.canvas.height - 2 * margin);

            this.startPoint = { x: x1, y: y1 };
            this.endPoint = { x: x2, y: y2 };

            if (this.doLinesIntersect(
                this.startPoint.x, this.startPoint.y, this.endPoint.x, this.endPoint.y,
                this.baseLine.x1, this.baseLine.y1, this.baseLine.x2, this.baseLine.y2
            )) {
                break;
            }

            attempts++;
        } while (attempts < maxAttempts);
    }

    startDrawing(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (this.isNearPoint(x, y, this.startPoint)) {
            this.isDrawing = true;
            this.userLine = {
                x1: this.startPoint.x,
                y1: this.startPoint.y,
                x2: this.startPoint.x,
                y2: this.startPoint.y
            };
        }
    }

    draw(e) {
        if (!this.isDrawing || !this.userLine) return;

        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        this.userLine.x2 = x;
        this.userLine.y2 = y;
        this.redrawCanvas();
    }

    stopDrawing() {
        if (this.isDrawing && this.userLine) {
            if (this.isNearPoint(this.userLine.x2, this.userLine.y2, this.endPoint)) {
                this.userLine.x2 = this.endPoint.x;
                this.userLine.y2 = this.endPoint.y;
                this.redrawCanvas();
            }
        }
        this.isDrawing = false;
    }

    isNearPoint(x, y, point) {
        const threshold = this.difficulty === 'hard' ? 10 : this.difficulty === 'medium' ? 15 : 20;
        return Math.hypot(x - point.x, y - point.y) < threshold;
    }

    redrawCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Crtanje zakrivljene osnovne linije
        this.ctx.beginPath();
        this.ctx.moveTo(this.baseLine.x1, this.baseLine.y1);
        this.ctx.bezierCurveTo(
            this.baseLine.cx1, this.baseLine.cy1,
            this.baseLine.cx2, this.baseLine.cy2,
            this.baseLine.x2, this.baseLine.y2
        );
        this.ctx.strokeStyle = '#2c3e50';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // Crtanje točaka s animacijom
        const time = Date.now() * 0.001;
        const scale = 1 + Math.sin(time * 2) * 0.1;
        
        this.drawPoint(this.startPoint, 'Početak', scale);
        this.drawPoint(this.endPoint, 'Kraj', scale);

        // Crtanje korisničke linije
        if (this.userLine) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.userLine.x1, this.userLine.y1);
            this.ctx.lineTo(this.userLine.x2, this.userLine.y2);
            this.ctx.strokeStyle = '#3498db';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
        }

        // Animacija okvira
        requestAnimationFrame(() => this.redrawCanvas());
    }

    drawPoint(point, label, scale = 1) {
        this.ctx.beginPath();
        this.ctx.arc(point.x, point.y, 5 * scale, 0, Math.PI * 2);
        this.ctx.fillStyle = '#e74c3c';
        this.ctx.fill();
        
        this.ctx.fillStyle = '#2c3e50';
        this.ctx.font = '14px Comic Neue';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(label, point.x, point.y - 15);
    }

    checkAnswer() {
        if (!this.userLine) {
            this.showFeedback('Prvo nacrtaj liniju!', false);
            this.playSound('wrong');
            return;
        }

        if (!this.isNearPoint(this.userLine.x1, this.userLine.y1, this.startPoint) ||
            !this.isNearPoint(this.userLine.x2, this.userLine.y2, this.endPoint)) {
            this.showFeedback('Linija mora prolaziti kroz obje označene točke!', false);
            this.playSound('wrong');
            return;
        }

        if (this.doLinesIntersect(
            this.userLine.x1, this.userLine.y1, this.userLine.x2, this.userLine.y2,
            this.baseLine.x1, this.baseLine.y1, this.baseLine.x2, this.baseLine.y2
        )) {
            // Bodovi ovise o težini i preostalom vremenu
            const timeBonus = Math.floor(this.timeLeft * 0.5);
            const difficultyMultiplier = this.difficulty === 'hard' ? 2 : this.difficulty === 'medium' ? 1.5 : 1;
            const points = Math.floor((10 + timeBonus) * difficultyMultiplier);
            
            this.score += points;
            document.getElementById('score').textContent = this.score;
            this.updateHighScore();
            
            // Provjeri za level up
            if (this.score >= this.level * 100) {
                this.level++;
                document.getElementById('level').textContent = this.level;
                this.playSound('levelUp');
                this.showFeedback(`Level Up! Razina ${this.level} 🎉`, true);
            } else {
                this.playSound('correct');
                this.showFeedback(`Bravo! +${points} bodova!`, true);
            }
            
            setTimeout(() => this.generateNewTask(), 1500);
        } else {
            this.showFeedback('Linija mora sjeći zadanu liniju!', false);
            this.playSound('wrong');
        }
    }

    doLinesIntersect(x1, y1, x2, y2, baseLineX1, baseLineY1, baseLineX2, baseLineY2) {
        // Provjeri presjek s više točaka duž zakrivljene linije
        const steps = 50;
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const point = this.getBezierPoint(t);
            
            if (i > 0) {
                const prevT = (i - 1) / steps;
                const prevPoint = this.getBezierPoint(prevT);
                
                // Provjeri presjek između dva segmenta
                if (this.lineSegmentsIntersect(
                    x1, y1, x2, y2,
                    prevPoint.x, prevPoint.y, point.x, point.y
                )) {
                    return true;
                }
            }
        }
        return false;
    }

    getBezierPoint(t) {
        const { x1, y1, cx1, cy1, cx2, cy2, x2, y2 } = this.baseLine;
        const oneMinusT = 1 - t;
        const oneMinusTSquared = oneMinusT * oneMinusT;
        const oneMinusTCubed = oneMinusTSquared * oneMinusT;
        const tSquared = t * t;
        const tCubed = tSquared * t;

        const x = oneMinusTCubed * x1 +
                 3 * oneMinusTSquared * t * cx1 +
                 3 * oneMinusT * tSquared * cx2 +
                 tCubed * x2;
        const y = oneMinusTCubed * y1 +
                 3 * oneMinusTSquared * t * cy1 +
                 3 * oneMinusT * tSquared * cy2 +
                 tCubed * y2;

        return { x, y };
    }

    lineSegmentsIntersect(x1, y1, x2, y2, x3, y3, x4, y4) {
        const denominator = ((x2 - x1) * (y4 - y3)) - ((y2 - y1) * (x4 - x3));
        if (denominator === 0) return false;

        const ua = (((x4 - x3) * (y1 - y3)) - ((y4 - y3) * (x1 - x3))) / denominator;
        const ub = (((x2 - x1) * (y1 - y3)) - ((y2 - y1) * (x1 - x3))) / denominator;

        return (ua >= 0 && ua <= 1) && (ub >= 0 && ub <= 1);
    }

    clearUserLine() {
        this.userLine = null;
        this.redrawCanvas();
        this.hideFeedback();
    }

    showHint() {
        const hints = [
            'Povuci ravnu liniju od početne do krajnje točke tako da siječe zadanu liniju!',
            'Klikni na početnu točku i povuci do krajnje točke.',
            'Linija mora proći kroz obje označene točke.',
            'Pokušaj različite kutove dok ne pronađeš pravi!'
        ];
        const randomHint = hints[Math.floor(Math.random() * hints.length)];
        this.showFeedback(randomHint, true);
    }

    showFeedback(message, isSuccess) {
        const feedback = document.getElementById('feedback');
        feedback.textContent = message;
        feedback.classList.remove('hidden', 'success', 'error');
        feedback.classList.add(isSuccess ? 'success' : 'error');
    }

    hideFeedback() {
        const feedback = document.getElementById('feedback');
        feedback.classList.add('hidden');
    }

    printTasks() {
        // Stvori novi prozor za printanje
        const printWindow = window.open('', '_blank');
        
        // Dodaj HTML i CSS za printanje
        let printContent = `
            <html>
            <head>
                <title>Zadaci za vježbu - Crtanje ravnih linija</title>
                <style>
                    @media print {
                        body { 
                            font-family: Arial, sans-serif;
                            padding: 20px;
                        }
                        .print-task { 
                            font-size: 14pt;
                            margin: 30px 0;
                            page-break-inside: avoid;
                            position: relative;
                        }
                        .canvas-container {
                            width: 600px;
                            height: 200px;
                            border: 1px solid #ccc;
                            margin: 10px 0;
                            position: relative;
                        }
                        h2 { 
                            font-size: 18pt;
                            text-align: center;
                            margin-bottom: 30px;
                        }
                        .task-text {
                            margin-bottom: 10px;
                        }
                        .points {
                            position: absolute;
                            width: 12px;
                            height: 12px;
                            background: #000;
                            border-radius: 50%;
                            border: 2px solid #000;
                            box-sizing: border-box;
                            box-shadow: 0 0 0 2px white;
                            z-index: 1;
                        }
                        .base-line {
                            position: absolute;
                            border-top: 2px solid #000;
                            transform-origin: 0 0;
                        }
                    }
                </style>
            </head>
            <body>
                <h2>Zadaci za vježbu - Crtanje ravnih linija</h2>
        `;

        // Generiraj 10 zadataka
        for (let i = 1; i <= 10; i++) {
            printContent += `
                <div class="print-task">
                    <div class="task-text">${i}. Nacrtaj ravnu liniju koja prolazi kroz označene točke i siječe zadanu liniju:</div>
                    <div class="canvas-container">
                        ${this.generatePrintableTask()}
                    </div>
                </div>
            `;
        }

        printContent += `
            </body>
            </html>
        `;

        // Postavi sadržaj u novi prozor i ispiši
        printWindow.document.open();
        printWindow.document.write(printContent);
        printWindow.document.close();
        
        // Čekaj da se sadržaj učita prije printanja
        printWindow.onload = function() {
            printWindow.print();
            printWindow.onafterprint = function() {
                printWindow.close();
            };
        };
    }

    generatePrintableTask() {
        // Generiraj nasumične koordinate za točke i liniju
        const width = 600;
        const height = 200;
        const margin = 50;

        // Generiraj osnovnu zakrivljenu liniju
        const x1 = margin + Math.random() * (width - 2 * margin);
        const y1 = margin + Math.random() * (height - 2 * margin);
        const x2 = margin + Math.random() * (width - 2 * margin);
        const y2 = margin + Math.random() * (height - 2 * margin);
        const cx1 = margin + Math.random() * (width - 2 * margin);
        const cy1 = margin + Math.random() * (height - 2 * margin);
        const cx2 = margin + Math.random() * (width - 2 * margin);
        const cy2 = margin + Math.random() * (height - 2 * margin);

        // Generiraj točke za crtanje
        let p1x, p1y, p2x, p2y;
        let validPoints = false;
        let attempts = 0;
        const maxAttempts = 100;

        do {
            p1x = margin + Math.random() * (width - 2 * margin);
            p1y = margin + Math.random() * (height - 2 * margin);
            p2x = margin + Math.random() * (width - 2 * margin);
            p2y = margin + Math.random() * (height - 2 * margin);

            // Provjeri presjek s više točaka duž zakrivljene linije
            const steps = 50;
            for (let i = 0; i <= steps; i++) {
                const t = i / steps;
                const point = this.getBezierPointForPrint(t, x1, y1, cx1, cy1, cx2, cy2, x2, y2);
                
                if (i > 0) {
                    const prevT = (i - 1) / steps;
                    const prevPoint = this.getBezierPointForPrint(prevT, x1, y1, cx1, cy1, cx2, cy2, x2, y2);
                    
                    if (this.lineSegmentsIntersect(
                        p1x, p1y, p2x, p2y,
                        prevPoint.x, prevPoint.y, point.x, point.y
                    )) {
                        validPoints = true;
                        break;
                    }
                }
            }

            attempts++;
        } while (!validPoints && attempts < maxAttempts);

        // Vrati HTML za zadatak
        return `
            <svg width="${width}" height="${height}" style="position: absolute; top: 0; left: 0;">
                <path d="M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}"
                      stroke="black" 
                      stroke-width="2" 
                      fill="none" />
            </svg>
            <div class="points" style="
                left: ${p1x - 6}px;
                top: ${p1y - 6}px;
            "></div>
            <div class="points" style="
                left: ${p2x - 6}px;
                top: ${p2y - 6}px;
            "></div>
        `;
    }

    getBezierPointForPrint(t, x1, y1, cx1, cy1, cx2, cy2, x2, y2) {
        const oneMinusT = 1 - t;
        const oneMinusTSquared = oneMinusT * oneMinusT;
        const oneMinusTCubed = oneMinusTSquared * oneMinusT;
        const tSquared = t * t;
        const tCubed = tSquared * t;

        const x = oneMinusTCubed * x1 +
                 3 * oneMinusTSquared * t * cx1 +
                 3 * oneMinusT * tSquared * cx2 +
                 tCubed * x2;
        const y = oneMinusTCubed * y1 +
                 3 * oneMinusTSquared * t * cy1 +
                 3 * oneMinusT * tSquared * cy2 +
                 tCubed * y2;

        return { x, y };
    }
}

// Pokreni igru
window.addEventListener('load', () => {
    const game = new DrawingGame();
});
