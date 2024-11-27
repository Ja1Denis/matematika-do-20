// Konstante
const BROJ = 1; // Broj koji se množi (za TablicaDo10 to je 1)
const MIN_MNOZITELJ = 1;
const MAX_MNOZITELJ = 10;
const VRIJEME_TESTA = 300; // 5 minuta u sekundama
const BROJ_ZADATAKA = 10;

// Globalne varijable
let trenutniZadaci = [];
let timer;
let preostaloVrijeme;
let bodovi = 0;
let testMode = false;

// DOM elementi
const tablicaElement = document.getElementById('tablicaMnozenja');
const zadaciContainer = document.getElementById('zadaci');
const startTestBtn = document.getElementById('startTest');
const generirajZadatkeBtn = document.getElementById('generirajZadatke');
const testInfo = document.querySelector('.test-info');
const vrijemeElement = document.getElementById('vrijeme');
const bodoviElement = document.getElementById('bodovi');

// Event listeneri
document.addEventListener('DOMContentLoaded', () => {
    generirajTablicu();
    generirajZadatke();
});

startTestBtn.addEventListener('click', zapocniTest);
generirajZadatkeBtn.addEventListener('click', generirajZadatke);

// Funkcije za tablicu množenja
function generirajTablicu() {
    let headerRow = document.createElement('tr');
    headerRow.innerHTML = '<th>×</th>';
    
    // Dodaj stupce za brojeve 1-10
    for (let i = MIN_MNOZITELJ; i <= MAX_MNOZITELJ; i++) {
        headerRow.innerHTML += `<th>${i}</th>`;
    }
    tablicaElement.appendChild(headerRow);

    // Dodaj red za odabrani broj
    let row = document.createElement('tr');
    row.innerHTML = `<th>${BROJ}</th>`;
    
    for (let j = MIN_MNOZITELJ; j <= MAX_MNOZITELJ; j++) {
        row.innerHTML += `<td data-row="${BROJ}" data-col="${j}">${BROJ * j}</td>`;
    }
    tablicaElement.appendChild(row);

    // Dodaj event listenere za hover efekt
    const cells = tablicaElement.getElementsByTagName('td');
    Array.from(cells).forEach(cell => {
        cell.addEventListener('mouseover', () => highlightCells(cell));
        cell.addEventListener('mouseout', () => removeCellHighlight());
    });
}

function highlightCells(cell) {
    const row = cell.dataset.row;
    const col = cell.dataset.col;
    
    const cells = tablicaElement.getElementsByTagName('td');
    Array.from(cells).forEach(c => {
        if (c.dataset.row === row || c.dataset.col === col) {
            c.classList.add('highlight');
        }
    });
}

function removeCellHighlight() {
    const cells = tablicaElement.getElementsByTagName('td');
    Array.from(cells).forEach(cell => {
        cell.classList.remove('highlight');
    });
}

// Funkcije za zadatke
function generirajZadatke() {
    trenutniZadaci = [];
    zadaciContainer.innerHTML = '';
    
    // Generiramo 10 zadataka s nasumičnim brojevima od 1 do 10
    let dostupniBrojevi = Array.from({length: MAX_MNOZITELJ}, (_, i) => i + 1);
    shuffleArray(dostupniBrojevi);
    
    for (let i = 0; i < BROJ_ZADATAKA; i++) {
        const broj2 = dostupniBrojevi[i];
        const rezultat = BROJ * broj2;
        
        trenutniZadaci.push({
            broj1: BROJ,
            broj2,
            rezultat,
            rijesen: false
        });

        const zadatakElement = document.createElement('div');
        zadatakElement.className = 'zadatak';
        zadatakElement.innerHTML = `
            ${BROJ} × ${broj2} = 
            <input type="number" id="zadatak${i}" onkeypress="return provjeraEnter(event, ${i})">
            <button onclick="provjeriOdgovor(${i})">Provjeri</button>
        `;
        
        zadaciContainer.appendChild(zadatakElement);
    }
}

// Pomoćna funkcija za miješanje polja
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function provjeraEnter(event, index) {
    if (event.key === 'Enter') {
        provjeriOdgovor(index);
        return false;
    }
    return true;
}

function provjeriOdgovor(index) {
    if (trenutniZadaci[index].rijesen) return;

    const input = document.getElementById(`zadatak${index}`);
    const odgovor = parseInt(input.value);
    const zadatak = trenutniZadaci[index];
    const zadatakElement = input.parentElement;

    if (odgovor === zadatak.rezultat) {
        zadatakElement.classList.add('tocno');
        zadatak.rijesen = true;
        highlightTocnoRjesenje(zadatak.broj1, zadatak.broj2);
        if (testMode) bodovi++;
        prikaziPoruku('Točno!');
    } else {
        zadatakElement.classList.add('netocno');
        prikaziPoruku('Netočno. Pokušaj ponovno!');
        setTimeout(() => zadatakElement.classList.remove('netocno'), 1000);
    }

    if (testMode) {
        bodoviElement.textContent = bodovi;
        provjeriZavrsetakTesta();
    }
}

function highlightTocnoRjesenje(broj1, broj2) {
    const cell = tablicaElement.querySelector(`td[data-row="${broj1}"][data-col="${broj2}"]`);
    if (cell) {
        cell.classList.add('tocno-rjesenje');
        setTimeout(() => cell.classList.remove('tocno-rjesenje'), 1000);
    }
}

// Funkcije za test mode
function zapocniTest() {
    testMode = true;
    bodovi = 0;
    preostaloVrijeme = VRIJEME_TESTA;
    
    startTestBtn.disabled = true;
    generirajZadatkeBtn.disabled = true;
    testInfo.style.display = 'flex';
    bodoviElement.textContent = '0';
    
    generirajZadatke();
    pokreniTimer();
}

function pokreniTimer() {
    vrijemeElement.textContent = preostaloVrijeme;
    
    timer = setInterval(() => {
        preostaloVrijeme--;
        vrijemeElement.textContent = preostaloVrijeme;
        
        if (preostaloVrijeme <= 30) {
            vrijemeElement.parentElement.classList.add('warning');
        }
        
        if (preostaloVrijeme <= 0) {
            zavrsiTest();
        }
    }, 1000);
}

function provjeriZavrsetakTesta() {
    const sviZadaciRijeseni = trenutniZadaci.every(zadatak => zadatak.rijesen);
    if (sviZadaciRijeseni) {
        zavrsiTest();
    }
}

function zavrsiTest() {
    clearInterval(timer);
    testMode = false;
    
    const postotak = (bodovi / BROJ_ZADATAKA) * 100;
    let ocjena = 1;
    
    if (postotak >= 90) ocjena = 5;
    else if (postotak >= 80) ocjena = 4;
    else if (postotak >= 65) ocjena = 3;
    else if (postotak >= 50) ocjena = 2;

    const rezultatElement = document.createElement('div');
    rezultatElement.className = 'rezultat-testa';
    rezultatElement.innerHTML = `
        <h2>Test Završen!</h2>
        <p>Bodovi: ${bodovi}/${BROJ_ZADATAKA}</p>
        <p>Postotak: ${postotak.toFixed(1)}%</p>
        <p class="ocjena">Ocjena: ${ocjena}</p>
        <button onclick="zatvoriRezultat(this.parentElement)">Zatvori</button>
    `;
    
    document.body.appendChild(rezultatElement);
    resetirajTest();
}

function resetirajTest() {
    startTestBtn.disabled = false;
    generirajZadatkeBtn.disabled = false;
    testInfo.style.display = 'none';
    vrijemeElement.parentElement.classList.remove('warning');
}

function zatvoriRezultat(element) {
    element.remove();
}

// Pomoćne funkcije
function prikaziPoruku(tekst) {
    const poruka = document.createElement('div');
    poruka.className = 'poruka';
    poruka.textContent = tekst;
    document.body.appendChild(poruka);
    
    setTimeout(() => {
        poruka.style.opacity = '1';
    }, 10);
    
    setTimeout(() => {
        poruka.style.opacity = '0';
        setTimeout(() => poruka.remove(), 300);
    }, 2000);
}
