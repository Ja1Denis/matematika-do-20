// Konstante
const BROJ = 7; // Broj koji se množi
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

// Funkcije za tablicu množenja
function generirajTablicu() {
    tablicaElement.innerHTML = '';
    
    // Zaglavlje
    const headerRow = document.createElement('tr');
    for (let i = 0; i <= MAX_MNOZITELJ; i++) {
        const th = document.createElement('th');
        th.textContent = i === 0 ? '×' : i;
        headerRow.appendChild(th);
    }
    tablicaElement.appendChild(headerRow);

    // Red za broj 7
    const row = document.createElement('tr');
    const thRow = document.createElement('th');
    thRow.textContent = BROJ;
    row.appendChild(thRow);

    for (let j = 1; j <= MAX_MNOZITELJ; j++) {
        const td = document.createElement('td');
        td.textContent = BROJ * j;
        td.addEventListener('mouseover', () => highlightCells(td));
        td.addEventListener('mouseout', removeCellHighlight);
        row.appendChild(td);
    }
    tablicaElement.appendChild(row);
}

function highlightCells(cell) {
    // Ukloni prethodno označene ćelije
    removeCellHighlight();
    
    // Označi trenutnu ćeliju
    cell.classList.add('highlight');
}

function removeCellHighlight() {
    const cells = document.querySelectorAll('td');
    cells.forEach(cell => cell.classList.remove('highlight'));
}

// Funkcije za zadatke
function generirajZadatke() {
    zadaciContainer.innerHTML = '';
    trenutniZadaci = [];
    bodovi = 0;
    if (testMode) {
        bodoviElement.textContent = bodovi;
    }

    // Kreiranje niza brojeva 1-10
    let brojevi = Array.from({length: MAX_MNOZITELJ}, (_, i) => i + 1);
    // Miješanje niza
    shuffleArray(brojevi);

    // Uzimanje prvih 10 brojeva za zadatke
    for (let i = 0; i < BROJ_ZADATAKA; i++) {
        const zadatak = {
            broj1: BROJ,
            broj2: brojevi[i],
            rezultat: BROJ * brojevi[i],
            rijesen: false
        };
        trenutniZadaci.push(zadatak);

        const zadatakDiv = document.createElement('div');
        zadatakDiv.className = 'zadatak';
        const input = document.createElement('input');
        input.type = 'number';
        input.id = `zadatak${i}`;
        
        const button = document.createElement('button');
        button.textContent = 'Provjeri';
        
        zadatakDiv.appendChild(document.createTextNode(`${zadatak.broj1} × ${zadatak.broj2} = `));
        zadatakDiv.appendChild(input);
        zadatakDiv.appendChild(button);
        
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                provjeriOdgovor(i);
                e.preventDefault();
            }
        });
        
        button.addEventListener('click', () => provjeriOdgovor(i));
        
        zadaciContainer.appendChild(zadatakDiv);
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
        zadatakElement.classList.remove('netocno');
        zadatakElement.classList.add('tocno');
        zadatak.rijesen = true;
        if (!zadatakElement.classList.contains('rijeseno')) {
            bodovi++;
            zadatakElement.classList.add('rijeseno');
            if (testMode) {
                bodoviElement.textContent = bodovi;
            }
        }
        highlightTocnoRjesenje(zadatak.broj1, zadatak.broj2);
        prikaziPoruku('Točno!');
    } else {
        zadatakElement.classList.remove('tocno');
        zadatakElement.classList.add('netocno');
        prikaziPoruku('Netočno. Pokušaj ponovno!');
        setTimeout(() => zadatakElement.classList.remove('netocno'), 1000);
    }

    if (testMode && bodovi === BROJ_ZADATAKA) {
        zavrsiTest();
    }
}

function highlightTocnoRjesenje(broj1, broj2) {
    const cells = document.querySelectorAll('td');
    const targetCell = cells[broj2 - 1];
    targetCell.classList.add('tocno-rjesenje');
    setTimeout(() => {
        targetCell.classList.remove('tocno-rjesenje');
    }, 500);
}

// Funkcije za test mode
function startTest() {
    testMode = true;
    preostaloVrijeme = VRIJEME_TESTA;
    bodovi = 0;
    testInfo.style.display = 'flex';
    bodoviElement.textContent = bodovi;
    generirajZadatke();
    pokreniTimer();
}

function pokreniTimer() {
    vrijemeElement.textContent = preostaloVrijeme;
    timer = setInterval(() => {
        preostaloVrijeme--;
        vrijemeElement.textContent = preostaloVrijeme;
        
        if (preostaloVrijeme <= 30) {
            vrijemeElement.classList.add('warning');
        }
        
        if (preostaloVrijeme <= 0) {
            zavrsiTest();
        }
    }, 1000);
}

function provjeriZavrsetakTesta() {
    if (bodovi === BROJ_ZADATAKA) {
        zavrsiTest();
        return true;
    }
    return false;
}

function zavrsiTest() {
    clearInterval(timer);
    testMode = false;
    testInfo.style.display = 'none';
    vrijemeElement.classList.remove('warning');
    
    const postotak = (bodovi / BROJ_ZADATAKA) * 100;
    let ocjena = 1;
    
    if (postotak >= 90) ocjena = 5;
    else if (postotak >= 80) ocjena = 4;
    else if (postotak >= 65) ocjena = 3;
    else if (postotak >= 50) ocjena = 2;
    
    prikaziPoruku(`Test je završen!
Bodovi: ${bodovi}/${BROJ_ZADATAKA}
Postotak: ${postotak}%
Ocjena: ${ocjena}`);
}

function resetirajTest() {
    clearInterval(timer);
    testMode = false;
    testInfo.style.display = 'none';
    vrijemeElement.classList.remove('warning');
}

function zatvoriRezultat(element) {
    element.parentElement.remove();
}

// Pomoćne funkcije
function prikaziPoruku(tekst) {
    // Prvo ukloni postojeću poruku ako postoji
    const postojecaPoruka = document.querySelector('.poruka');
    if (postojecaPoruka) {
        postojecaPoruka.remove();
    }

    const poruka = document.createElement('div');
    poruka.className = 'poruka';
    poruka.innerHTML = `
        <div class="poruka-sadrzaj">
            <p>${tekst.replace(/\n/g, '<br>')}</p>
            <button onclick="zatvoriRezultat(this)">Zatvori</button>
        </div>
    `;
    document.body.appendChild(poruka);

    // Automatski ukloni poruku nakon 2 sekunde ako nije poruka o završetku testa
    if (!tekst.includes('Test je završen')) {
        setTimeout(() => {
            if (poruka.parentElement) {
                poruka.remove();
            }
        }, 2000);
    }
}

// Event listeneri
startTestBtn.addEventListener('click', startTest);
generirajZadatkeBtn.addEventListener('click', generirajZadatke);

// Inicijalno generiranje tablice i zadataka
generirajTablicu();
generirajZadatke();
