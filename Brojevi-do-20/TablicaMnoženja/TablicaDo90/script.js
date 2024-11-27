// Konstante
const BROJ = 9; // Broj koji se množi
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
    let html = '';
    for (let i = MIN_MNOZITELJ; i <= MAX_MNOZITELJ; i++) {
        html += '<tr>';
        for (let j = MIN_MNOZITELJ; j <= MAX_MNOZITELJ; j++) {
            if (i === 1 && j === 1) {
                html += '<td>×</td>';
            } else if (i === 1) {
                html += `<td>${j}</td>`;
            } else if (j === 1) {
                html += `<td>${i}</td>`;
            } else if (i === BROJ || j === BROJ) {
                html += `<td onclick="highlightCells(this)" data-row="${i}" data-col="${j}">${i * j}</td>`;
            } else {
                html += '<td></td>';
            }
        }
        html += '</tr>';
    }
    tablicaElement.innerHTML = html;
}

function highlightCells(cell) {
    removeCellHighlight();
    const row = cell.getAttribute('data-row');
    const col = cell.getAttribute('data-col');
    const cells = document.querySelectorAll(`td[data-row="${row}"], td[data-col="${col}"]`);
    cells.forEach(c => c.classList.add('highlight'));
}

function removeCellHighlight() {
    const cells = document.querySelectorAll('.highlight');
    cells.forEach(cell => cell.classList.remove('highlight'));
}

// Funkcije za zadatke
function generirajZadatke() {
    zadaciContainer.innerHTML = '';
    trenutniZadaci = [];
    
    // Generiranje zadataka
    for (let i = 0; i < BROJ_ZADATAKA; i++) {
        let zadatak;
        do {
            const broj2 = Math.floor(Math.random() * MAX_MNOZITELJ) + 1;
            zadatak = {
                broj1: BROJ,
                broj2: broj2,
                rezultat: BROJ * broj2
            };
        } while (trenutniZadaci.some(z => z.broj2 === zadatak.broj2));
        
        trenutniZadaci.push(zadatak);
    }
    
    // Miješanje zadataka
    shuffleArray(trenutniZadaci);
    
    // Prikaz zadataka
    trenutniZadaci.forEach((zadatak, index) => {
        const zadatakElement = document.createElement('div');
        zadatakElement.className = 'zadatak';
        zadatakElement.innerHTML = `
            ${zadatak.broj1} × ${zadatak.broj2} = 
            <input type="number" id="odgovor${index}" min="0" max="100">
            <button onclick="provjeriOdgovor(${index}, document.getElementById('odgovor${index}').value)">Provjeri</button>
            <span class="checkmark" style="display: none;">✓</span>
        `;
        zadaciContainer.appendChild(zadatakElement);
    });
}

// Pomoćna funkcija za miješanje polja
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function provjeriOdgovor(index, odgovor) {
    if (!odgovor) return;

    const zadatak = trenutniZadaci[index];
    const zadatakElement = zadaciContainer.children[index];
    const checkmark = zadatakElement.querySelector('.checkmark');
    const input = zadatakElement.querySelector('input');
    
    // Uklanjanje prethodnih klasa
    zadatakElement.classList.remove('tocno', 'netocno');
    
    if (parseInt(odgovor) === zadatak.rezultat) {
        zadatakElement.classList.add('tocno', 'rijeseno');
        checkmark.style.display = 'inline';
        input.disabled = true;
        if (testMode) {
            if (!zadatak.bodovan) {
                bodovi++;
                zadatak.bodovan = true;
                bodoviElement.textContent = bodovi;
            }
            provjeriZavrsetakTesta();
        }
        highlightTocnoRjesenje(zadatak.broj1, zadatak.broj2);
    } else {
        zadatakElement.classList.add('netocno');
        checkmark.style.display = 'none';
    }
}

function highlightTocnoRjesenje(broj1, broj2) {
    removeCellHighlight();
    const cells = document.querySelectorAll('td');
    cells.forEach(cell => {
        if ((cell.getAttribute('data-row') == broj1 && cell.getAttribute('data-col') == broj2) ||
            (cell.getAttribute('data-row') == broj2 && cell.getAttribute('data-col') == broj1)) {
            cell.classList.add('highlight', 'tocno-rjesenje');
        }
    });
}

// Funkcije za test mode
function startTest() {
    testMode = true;
    bodovi = 0;
    bodoviElement.textContent = bodovi;
    testInfo.style.display = 'flex';
    startTestBtn.disabled = true;
    generirajZadatkeBtn.disabled = true;
    generirajZadatke();
    pokreniTimer();
}

function pokreniTimer() {
    preostaloVrijeme = VRIJEME_TESTA;
    vrijemeElement.textContent = preostaloVrijeme;
    
    timer = setInterval(() => {
        preostaloVrijeme--;
        vrijemeElement.textContent = preostaloVrijeme;
        
        if (preostaloVrijeme <= 60) {
            vrijemeElement.parentElement.classList.add('warning');
        }
        
        if (preostaloVrijeme <= 0) {
            zavrsiTest();
        }
    }, 1000);
}

function provjeriZavrsetakTesta() {
    if (bodovi === BROJ_ZADATAKA) {
        zavrsiTest();
    }
}

function zavrsiTest() {
    clearInterval(timer);
    testMode = false;
    
    const poruka = `Test je završen! Osvojili ste ${bodovi} od mogućih ${BROJ_ZADATAKA} bodova.`;
    prikaziPoruku(poruka);
    
    testInfo.style.display = 'none';
    startTestBtn.disabled = false;
    generirajZadatkeBtn.disabled = false;
    vrijemeElement.parentElement.classList.remove('warning');
}

function resetirajTest() {
    clearInterval(timer);
    testMode = false;
    testInfo.style.display = 'none';
    startTestBtn.disabled = false;
    generirajZadatkeBtn.disabled = false;
    vrijemeElement.parentElement.classList.remove('warning');
}

function zatvoriRezultat(element) {
    element.parentElement.remove();
}

// Pomoćne funkcije
function prikaziPoruku(tekst) {
    const postojecaPoruka = document.querySelector('.rezultat-popup');
    if (postojecaPoruka) {
        postojecaPoruka.remove();
    }
    
    const poruka = document.createElement('div');
    poruka.className = 'rezultat-popup';
    
    poruka.innerHTML = `
        <h3>Rezultat</h3>
        <p>${tekst}</p>
        <button onclick="zatvoriRezultat(this)">Zatvori</button>
    `;
    
    document.body.appendChild(poruka);
}

// Event listeneri
startTestBtn.addEventListener('click', startTest);
generirajZadatkeBtn.addEventListener('click', generirajZadatke);

// Inicijalno generiranje tablice i zadataka
generirajTablicu();
generirajZadatke();
