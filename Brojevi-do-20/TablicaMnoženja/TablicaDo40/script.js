const BROJ = 4;
const VRIJEME_TESTA = 300; // 5 minuta u sekundama
let preostaloVrijeme = VRIJEME_TESTA;
let timerInterval;
let zadaci = [];
let trenutniZadatak = 0;
let bodovi = 0;
let testMode = false;

// Generiranje tablice množenja
function generirajTablicu() {
    const tablica = document.getElementById('tablicaMnozenja');
    tablica.innerHTML = '';

    // Zaglavlje
    const headerRow = document.createElement('tr');
    for (let i = 0; i <= 10; i++) {
        const th = document.createElement('th');
        th.textContent = i === 0 ? '×' : i;
        headerRow.appendChild(th);
    }
    tablica.appendChild(headerRow);

    // Red za broj 4
    const row = document.createElement('tr');
    const thRow = document.createElement('th');
    thRow.textContent = BROJ;
    row.appendChild(thRow);

    for (let j = 1; j <= 10; j++) {
        const td = document.createElement('td');
        td.textContent = BROJ * j;
        td.addEventListener('mouseover', () => highlightCells(0, j));
        td.addEventListener('mouseout', removeHighlight);
        row.appendChild(td);
    }
    tablica.appendChild(row);
}

// Označavanje ćelija
function highlightCells(i, j) {
    const cells = document.querySelectorAll('td');
    cells[j - 1].classList.add('highlight');
}

function removeHighlight() {
    const cells = document.querySelectorAll('td');
    cells.forEach(cell => cell.classList.remove('highlight'));
}

// Generiranje zadataka
function generirajZadatke() {
    const zadaciDiv = document.getElementById('zadaci');
    zadaciDiv.innerHTML = '';
    zadaci = [];
    trenutniZadatak = 0;
    bodovi = 0;

    // Kreiranje niza brojeva 1-10
    let brojevi = Array.from({length: 10}, (_, i) => i + 1);
    // Miješanje niza
    shuffleArray(brojevi);

    // Uzimanje prvih 10 brojeva za zadatke
    for (let i = 0; i < 10; i++) {
        const zadatak = {
            broj1: BROJ,
            broj2: brojevi[i],
            rezultat: BROJ * brojevi[i]
        };
        zadaci.push(zadatak);

        const zadatakDiv = document.createElement('div');
        zadatakDiv.className = 'zadatak';
        zadatakDiv.innerHTML = `
            ${zadatak.broj1} × ${zadatak.broj2} = 
            <input type="number" id="odgovor${i}" />
        `;
        zadaciDiv.appendChild(zadatakDiv);

        const input = zadatakDiv.querySelector('input');
        input.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                provjeriOdgovor(i, parseInt(input.value));
            }
        });
    }
}

// Provjera odgovora
function provjeriOdgovor(index, odgovor) {
    const zadatak = zadaci[index];
    const zadatakDiv = document.querySelectorAll('.zadatak')[index];
    const input = zadatakDiv.querySelector('input');

    if (odgovor === zadatak.rezultat) {
        zadatakDiv.classList.remove('incorrect');
        zadatakDiv.classList.add('correct');
        if (!zadatakDiv.classList.contains('rijeseno')) {
            bodovi++;
            zadatakDiv.classList.add('rijeseno');
            if (testMode) {
                document.getElementById('bodovi').textContent = bodovi;
            }
        }
    } else {
        zadatakDiv.classList.remove('correct');
        zadatakDiv.classList.add('incorrect');
    }

    if (testMode && bodovi === 10) {
        zavrsiTest();
    }
}

// Miješanje niza
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Test mod
function startTest() {
    testMode = true;
    preostaloVrijeme = VRIJEME_TESTA;
    bodovi = 0;
    document.querySelector('.test-info').style.display = 'flex';
    document.getElementById('bodovi').textContent = bodovi;
    generirajZadatke();
    
    timerInterval = setInterval(() => {
        preostaloVrijeme--;
        document.getElementById('vrijeme').textContent = preostaloVrijeme;
        
        if (preostaloVrijeme <= 30) {
            document.getElementById('vrijeme').style.color = 'red';
        }
        
        if (preostaloVrijeme <= 0) {
            zavrsiTest();
        }
    }, 1000);
}

function zavrsiTest() {
    clearInterval(timerInterval);
    testMode = false;
    document.querySelector('.test-info').style.display = 'none';
    
    const postotak = (bodovi / 10) * 100;
    let ocjena = 1;
    
    if (postotak >= 90) ocjena = 5;
    else if (postotak >= 80) ocjena = 4;
    else if (postotak >= 65) ocjena = 3;
    else if (postotak >= 50) ocjena = 2;
    
    alert(`Test je završen!\nBodovi: ${bodovi}/10\nPostotak: ${postotak}%\nOcjena: ${ocjena}`);
}

// Event listeneri
document.getElementById('generirajZadatke').addEventListener('click', generirajZadatke);
document.getElementById('startTest').addEventListener('click', startTest);

// Inicijalno generiranje tablice i zadataka
generirajTablicu();
generirajZadatke();
