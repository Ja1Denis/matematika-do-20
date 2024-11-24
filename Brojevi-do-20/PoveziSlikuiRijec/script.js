class ConnectGame {
    constructor() {
        this.score = 0;
        this.highScore = parseInt(localStorage.getItem('highScore')) || 0;
        this.level = 1;
        this.timeLeft = 30;
        this.timerInterval = null;
        this.soundEnabled = true;
        this.difficulty = 'easy';
        this.gameMode = 'basic';
        this.currentPairs = [];
        this.connections = new Map();
        this.achievements = new Set(JSON.parse(localStorage.getItem('achievements')) || []);

        // Opisi likova
        this.shapeDescriptions = {
            'kvadrat': 'Lik s četiri jednake stranice i četiri prava kuta.',
            'krug': 'Savršeno okrugli lik, svaka točka je jednako udaljena od središta.',
            'trokut': 'Lik s tri stranice i tri kuta.',
            'elipsa': 'Ovalni oblik, poput spljoštenog kruga.',
            'šesterokut': 'Lik sa šest stranica i šest kutova.',
            'pravilni šesterokut': 'Šesterokut s jednakim stranicama i kutovima.',
            'pravokutnik': 'Lik s četiri prava kuta i dva para jednakih stranica.',
            'romb': 'Četverokut s četiri jednake stranice.',
            'trapez': 'Četverokut s jednim parom paralelnih stranica.',
            'peterokut': 'Lik s pet stranica i pet kutova.'
        };

        // Svojstva likova
        this.shapeProperties = {
            'kvadrat': { kutovi: 4, stranice: 4, svojstva: 'Sve stranice su jednake duljine' },
            'krug': { kutovi: 0, stranice: 0, svojstva: 'Nema kutova ni stranica' },
            'trokut': { kutovi: 3, stranice: 3, svojstva: 'Zbroj kutova je 180°' },
            'elipsa': { kutovi: 0, stranice: 0, svojstva: 'Ima dvije osi simetrije' },
            'šesterokut': { kutovi: 6, stranice: 6, svojstva: 'Ima šest vrhova' },
            'pravilni šesterokut': { kutovi: 6, stranice: 6, svojstva: 'Svi kutovi su 120°' },
            'pravokutnik': { kutovi: 4, stranice: 4, svojstva: 'Nasuprotne stranice su jednake' },
            'romb': { kutovi: 4, stranice: 4, svojstva: 'Dijagonale se sijeku pod pravim kutom' },
            'trapez': { kutovi: 4, stranice: 4, svojstva: 'Ima par paralelnih stranica' },
            'peterokut': { kutovi: 5, stranice: 5, svojstva: 'Zbroj kutova je 540°' }
        };

        // Zanimljive činjenice
        this.funFacts = [
            'Kvadrat je poseban slučaj pravokutnika gdje su sve stranice jednake!',
            'Krug ima beskonačno mnogo osi simetrije!',
            'Svaki pravilni šesterokut možemo podijeliti na šest jednakih trokuta!',
            'Pčele grade svoje saće u obliku pravilnih šesterokuta jer je to najekonomičniji oblik!',
            'Egipćani su koristili pravokutne trokute za izgradnju piramida!'
        ];

        // DOM elementi
        this.imagesContainer = document.getElementById('images-container');
        this.wordsContainer = document.getElementById('words-container');
        this.scoreElement = document.getElementById('score');
        this.levelElement = document.getElementById('level');
        this.highScoreElement = document.getElementById('highScore');
        this.timerElement = document.querySelector('#timer span');

        // Zvukovi
        this.correctSound = document.getElementById('correctSound');
        this.wrongSound = document.getElementById('wrongSound');
        this.levelUpSound = document.getElementById('levelUpSound');

        this.setupEventListeners();
        this.loadHighScore();
        this.generateNewTask();
        this.startTimer();
    }

    setupEventListeners() {
        document.getElementById('newTask').addEventListener('click', () => this.generateNewTask());
        document.getElementById('checkAnswer').addEventListener('click', () => this.checkAnswers());
        document.getElementById('hint').addEventListener('click', () => this.showHint());
        document.getElementById('toggleSound').addEventListener('click', () => this.toggleSound());
        document.getElementById('printTasks').addEventListener('click', () => this.printTasks());

        // Difficulty buttons
        document.getElementById('easyMode').addEventListener('click', () => this.setDifficulty('easy'));
        document.getElementById('mediumMode').addEventListener('click', () => this.setDifficulty('medium'));
        document.getElementById('hardMode').addEventListener('click', () => this.setDifficulty('hard'));

        // Game mode buttons
        document.getElementById('basicMode').addEventListener('click', () => this.setGameMode('basic'));
        document.getElementById('propertiesMode').addEventListener('click', () => this.setGameMode('properties'));
        document.getElementById('anglesMode').addEventListener('click', () => this.setGameMode('angles'));
        document.getElementById('sidesMode').addEventListener('click', () => this.setGameMode('sides'));

        // Tooltip events
        this.imagesContainer.addEventListener('mouseover', (e) => {
            if (e.target.classList.contains('draggable')) {
                this.showTooltip(e.target);
            }
        });

        this.imagesContainer.addEventListener('mouseout', () => {
            this.hideTooltip();
        });

        this.setupDragAndDrop();
    }

    setupDragAndDrop() {
        this.imagesContainer.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('draggable')) {
                e.target.classList.add('dragging');
                e.dataTransfer.setData('text/plain', e.target.dataset.id);
            }
        });

        this.imagesContainer.addEventListener('dragend', (e) => {
            if (e.target.classList.contains('draggable')) {
                e.target.classList.remove('dragging');
            }
        });

        this.wordsContainer.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        this.wordsContainer.addEventListener('drop', (e) => {
            e.preventDefault();
            const imageId = e.dataTransfer.getData('text/plain');
            const wordElement = e.target.closest('.draggable');
            
            if (wordElement) {
                this.connections.set(imageId, wordElement.dataset.id);
                this.updateConnectionsVisual();
            }
        });
    }

    generateNewTask() {
        this.connections.clear();
        this.currentPairs = [];
        
        const numberOfPairs = this.difficulty === 'easy' ? 3 : this.difficulty === 'medium' ? 4 : 5;
        
        let pairs = [];
        switch(this.gameMode) {
            case 'properties':
                pairs = [
                    { image: '⬜', word: 'Sve stranice su jednake duljine' },
                    { image: '⭕', word: 'Nema kutova ni stranica' },
                    { image: '△', word: 'Zbroj kutova je 180°' },
                    { image: '⬯', word: 'Ima dvije osi simetrije' },
                    { image: '⬡', word: 'Ima šest vrhova' },
                    { image: '⬢', word: 'Svi kutovi su 120°' },
                    { image: '▭', word: 'Nasuprotne stranice su jednake' },
                    { image: '⟁', word: 'Dijagonale se sijeku pod pravim kutom' },
                    { image: '⬗', word: 'Ima par paralelnih stranica' },
                    { image: '⬠', word: 'Zbroj kutova je 540°' }
                ];
                break;
            case 'angles':
                pairs = [
                    { image: '⬜', word: '4 kuta' },
                    { image: '⭕', word: '0 kutova' },
                    { image: '△', word: '3 kuta' },
                    { image: '⬯', word: '0 kutova' },
                    { image: '⬡', word: '6 kutova' },
                    { image: '⬢', word: '6 kutova' },
                    { image: '▭', word: '4 kuta' },
                    { image: '⟁', word: '4 kuta' },
                    { image: '⬗', word: '4 kuta' },
                    { image: '⬠', word: '5 kutova' }
                ];
                break;
            case 'sides':
                pairs = [
                    { image: '⬜', word: '4 stranice' },
                    { image: '⭕', word: '0 stranica' },
                    { image: '△', word: '3 stranice' },
                    { image: '⬯', word: '0 stranica' },
                    { image: '⬡', word: '6 stranica' },
                    { image: '⬢', word: '6 stranica' },
                    { image: '▭', word: '4 stranice' },
                    { image: '⟁', word: '4 stranice' },
                    { image: '⬗', word: '4 stranice' },
                    { image: '⬠', word: '5 stranica' }
                ];
                break;
            default:
                pairs = [
                    { image: '⬜', word: 'kvadrat' },
                    { image: '⭕', word: 'krug' },
                    { image: '△', word: 'trokut' },
                    { image: '⬯', word: 'elipsa' },
                    { image: '⬡', word: 'šesterokut' },
                    { image: '⬢', word: 'pravilni šesterokut' },
                    { image: '▭', word: 'pravokutnik' },
                    { image: '⟁', word: 'romb' },
                    { image: '⬗', word: 'trapez' },
                    { image: '⬠', word: 'peterokut' }
                ];
        }

        this.currentPairs = this.shuffleArray(pairs).slice(0, numberOfPairs);
        this.displayItems();
        this.resetTimer();
        this.startTimer();
        this.showRandomFunFact();
    }

    displayItems() {
        // Prikaži slike
        const shuffledImages = this.shuffleArray([...this.currentPairs]);
        this.imagesContainer.innerHTML = shuffledImages
            .map((pair, index) => `
                <div class="draggable" draggable="true" data-id="${index}">
                    <span style="font-size: 2em;">${pair.image}</span>
                </div>
            `).join('');

        // Prikaži riječi
        const shuffledWords = this.shuffleArray([...this.currentPairs]);
        this.wordsContainer.innerHTML = shuffledWords
            .map((pair, index) => `
                <div class="draggable" data-id="${index}">
                    ${pair.word}
                </div>
            `).join('');
    }

    checkAnswers() {
        let allCorrect = true;
        let score = 0;

        this.connections.forEach((wordId, imageId) => {
            const imageItem = this.currentPairs[imageId];
            const wordItem = this.currentPairs[wordId];

            if (imageItem.word === wordItem.word) {
                score++;
            } else {
                allCorrect = false;
            }
        });

        if (allCorrect && this.connections.size === this.currentPairs.length) {
            this.handleCorrectAnswer();
        } else {
            this.handleWrongAnswer();
        }
    }

    handleCorrectAnswer() {
        this.score += this.calculateScore();
        this.scoreElement.textContent = this.score;
        
        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.highScoreElement.textContent = this.highScore;
            localStorage.setItem('highScore', this.highScore);
        }

        this.level++;
        this.levelElement.textContent = this.level;
        
        if (this.soundEnabled) {
            this.correctSound.play();
        }

        // Provjeri i dodijeli postignuća
        this.checkAchievements();

        this.showFeedback('Bravo! Točno si povezao/la sve pojmove! 🎉', 'success');
        setTimeout(() => this.generateNewTask(), 2000);
    }

    handleWrongAnswer() {
        if (this.soundEnabled) {
            this.wrongSound.play();
        }
        this.showFeedback('Pokušaj ponovno! 🤔', 'error');
    }

    calculateScore() {
        const baseScore = this.difficulty === 'easy' ? 10 : this.difficulty === 'medium' ? 20 : 30;
        const timeBonus = Math.floor(this.timeLeft / 5);
        return baseScore + timeBonus;
    }

    showHint() {
        // Implementacija hinta - pokazuje jednu točnu vezu
        const unconnectedImages = [...this.currentPairs.keys()]
            .filter(id => !this.connections.has(String(id)));
        
        if (unconnectedImages.length > 0) {
            const randomImageId = unconnectedImages[Math.floor(Math.random() * unconnectedImages.length)];
            const correctWordId = this.currentPairs.findIndex(pair => 
                pair.word === this.currentPairs[randomImageId].word
            );
            
            this.connections.set(String(randomImageId), String(correctWordId));
            this.updateConnectionsVisual();
        }
    }

    showFeedback(message, type) {
        const feedback = document.getElementById('feedback');
        feedback.textContent = message;
        feedback.className = `feedback ${type}`;
        setTimeout(() => feedback.className = 'feedback hidden', 3000);
    }

    setDifficulty(level) {
        this.difficulty = level;
        document.querySelectorAll('.difficulty-controls .button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(level + 'Mode').classList.add('active');
        
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

    setGameMode(mode) {
        this.gameMode = mode;
        document.querySelectorAll('.mode-button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(mode + 'Mode').classList.add('active');
        this.generateNewTask();
    }

    startTimer() {
        if (this.timerInterval) clearInterval(this.timerInterval);
        
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            this.timerElement.textContent = this.timeLeft;
            
            if (this.timeLeft <= 5) {
                this.timerElement.style.color = '#e74c3c';
            }
            
            if (this.timeLeft <= 0) {
                clearInterval(this.timerInterval);
                this.handleTimeUp();
            }
        }, 1000);
    }

    resetTimer() {
        clearInterval(this.timerInterval);
        this.timeLeft = this.difficulty === 'easy' ? 30 : this.difficulty === 'medium' ? 20 : 15;
        this.timerElement.textContent = this.timeLeft;
        this.timerElement.style.color = '';
    }

    handleTimeUp() {
        this.showFeedback('Vrijeme je isteklo! ⏰', 'error');
        setTimeout(() => this.generateNewTask(), 2000);
    }

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        const soundButton = document.getElementById('toggleSound');
        soundButton.textContent = this.soundEnabled ? '🔊 Zvuk' : '🔇 Zvuk';
    }

    printTasks() {
        const printWindow = window.open('', '_blank');
        const numberOfPairs = this.difficulty === 'easy' ? 3 : this.difficulty === 'medium' ? 4 : 5;

        // Dohvati sve moguće parove prema trenutnom modu
        let allPairs = [];
        switch(this.gameMode) {
            case 'properties':
                allPairs = [
                    { image: '⬜', word: 'Sve stranice su jednake duljine' },
                    { image: '⭕', word: 'Nema kutova ni stranica' },
                    { image: '△', word: 'Zbroj kutova je 180°' },
                    { image: '⬯', word: 'Ima dvije osi simetrije' },
                    { image: '⬡', word: 'Ima šest vrhova' },
                    { image: '⬢', word: 'Svi kutovi su 120°' },
                    { image: '▭', word: 'Nasuprotne stranice su jednake' },
                    { image: '⟁', word: 'Dijagonale se sijeku pod pravim kutom' },
                    { image: '⬗', word: 'Ima par paralelnih stranica' },
                    { image: '⬠', word: 'Zbroj kutova je 540°' }
                ];
                break;
            case 'angles':
                allPairs = [
                    { image: '⬜', word: '4 kuta' },
                    { image: '⭕', word: '0 kutova' },
                    { image: '△', word: '3 kuta' },
                    { image: '⬯', word: '0 kutova' },
                    { image: '⬡', word: '6 kutova' },
                    { image: '⬢', word: '6 kutova' },
                    { image: '▭', word: '4 kuta' },
                    { image: '⟁', word: '4 kuta' },
                    { image: '⬗', word: '4 kuta' },
                    { image: '⬠', word: '5 kutova' }
                ];
                break;
            case 'sides':
                allPairs = [
                    { image: '⬜', word: '4 stranice' },
                    { image: '⭕', word: '0 stranica' },
                    { image: '△', word: '3 stranice' },
                    { image: '⬯', word: '0 stranica' },
                    { image: '⬡', word: '6 stranica' },
                    { image: '⬢', word: '6 stranica' },
                    { image: '▭', word: '4 stranice' },
                    { image: '⟁', word: '4 stranice' },
                    { image: '⬗', word: '4 stranice' },
                    { image: '⬠', word: '5 stranica' }
                ];
                break;
            default:
                allPairs = [
                    { image: '⬜', word: 'kvadrat' },
                    { image: '⭕', word: 'krug' },
                    { image: '△', word: 'trokut' },
                    { image: '⬯', word: 'elipsa' },
                    { image: '⬡', word: 'šesterokut' },
                    { image: '⬢', word: 'pravilni šesterokut' },
                    { image: '▭', word: 'pravokutnik' },
                    { image: '⟁', word: 'romb' },
                    { image: '⬗', word: 'trapez' },
                    { image: '⬠', word: 'peterokut' }
                ];
        }

        // Generiraj 10 različitih setova zadataka
        const tasks = Array(10).fill(null).map(() => {
            // Za svaki zadatak, odaberi random podskup parova
            const shuffledPairs = this.shuffleArray([...allPairs]);
            return shuffledPairs.slice(0, numberOfPairs);
        });

        const content = `
            <html>
            <head>
                <title>Zadaci za vježbu</title>
                <style>
                    body { 
                        font-family: Arial, sans-serif;
                        padding: 20px;
                    }
                    .task { 
                        margin: 20px 0;
                        padding: 15px;
                        border: 1px solid #ccc;
                        border-radius: 5px;
                        page-break-inside: avoid;
                    }
                    .pairs { 
                        display: flex;
                        justify-content: space-around;
                        margin: 10px 0;
                    }
                    .image { 
                        font-size: 2em;
                        margin: 5px 0;
                    }
                    .word {
                        margin: 5px 0;
                        padding: 5px;
                    }
                    @media print {
                        .task {
                            page-break-inside: avoid;
                        }
                    }
                </style>
            </head>
            <body>
                <h1>Zadaci za vježbu - ${this.gameMode === 'basic' ? 'Geometrijski likovi' : 
                                      this.gameMode === 'properties' ? 'Svojstva likova' :
                                      this.gameMode === 'angles' ? 'Kutovi likova' : 'Stranice likova'}</h1>
                ${tasks.map((taskPairs, index) => `
                    <div class="task">
                        <h3>Zadatak ${index + 1}. Poveži odgovarajuće parove:</h3>
                        <div class="pairs">
                            <div>
                                ${taskPairs.map(pair => `<div class="image">${pair.image}</div>`).join('')}
                            </div>
                            <div>
                                ${this.shuffleArray([...taskPairs]).map(pair => `<div class="word">${pair.word}</div>`).join('')}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </body>
            </html>
        `;
        
        printWindow.document.write(content);
        printWindow.document.close();
        printWindow.print();
    }

    updateConnectionsVisual() {
        // Resetiraj sve veze
        document.querySelectorAll('.draggable').forEach(el => {
            el.style.backgroundColor = '';
        });

        // Označi povezane elemente
        this.connections.forEach((wordId, imageId) => {
            const imageElement = [...this.imagesContainer.children].find(el => el.dataset.id === imageId);
            const wordElement = [...this.wordsContainer.children].find(el => el.dataset.id === wordId);
            
            if (imageElement && wordElement) {
                const color = `hsl(${Math.random() * 360}, 70%, 90%)`;
                imageElement.style.backgroundColor = color;
                wordElement.style.backgroundColor = color;
            }
        });
    }

    shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    loadHighScore() {
        this.highScore = parseInt(localStorage.getItem('highScore')) || 0;
        this.highScoreElement.textContent = this.highScore;
    }

    showTooltip(element) {
        const tooltip = document.getElementById('tooltip');
        const shape = this.currentPairs[element.dataset.id];
        if (shape && this.shapeDescriptions[shape.word]) {
            tooltip.textContent = this.shapeDescriptions[shape.word];
            tooltip.style.display = 'block';
            
            const rect = element.getBoundingClientRect();
            tooltip.style.left = rect.left + 'px';
            tooltip.style.top = (rect.bottom + 5) + 'px';
        }
    }

    hideTooltip() {
        document.getElementById('tooltip').style.display = 'none';
    }

    showRandomFunFact() {
        const funFactElement = document.getElementById('funFact');
        funFactElement.textContent = this.funFacts[Math.floor(Math.random() * this.funFacts.length)];
        funFactElement.classList.remove('hidden');
    }

    checkAchievements() {
        const newAchievements = [];
        
        if (this.score >= 100 && !this.achievements.has('score100')) {
            newAchievements.push('Skupljač bodova 🏆');
            this.achievements.add('score100');
        }
        
        if (this.level >= 10 && !this.achievements.has('level10')) {
            newAchievements.push('Majstor geometrije 📐');
            this.achievements.add('level10');
        }

        if (newAchievements.length > 0) {
            this.showAchievement(newAchievements[0]);
            localStorage.setItem('achievements', JSON.stringify([...this.achievements]));
        }
    }

    showAchievement(achievement) {
        const achievementDiv = document.createElement('div');
        achievementDiv.className = 'achievement';
        achievementDiv.textContent = `Novo postignuće: ${achievement}`;
        document.body.appendChild(achievementDiv);
        
        setTimeout(() => {
            achievementDiv.remove();
        }, 3000);
    }
}

// Pokreni igru
window.addEventListener('load', () => {
    const game = new ConnectGame();
});
