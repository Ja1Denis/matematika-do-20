// Generiranje tablice množenja
function generirajTablicu() {
    const tablica = document.getElementById('tablicaMnozenja');
    tablica.innerHTML = '';

    // Dodaj zaglavlje
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = '<th>×</th>';
    for (let i = 1; i <= 100; i++) {
        headerRow.innerHTML += `<th>${i}</th>`;
    }
    thead.appendChild(headerRow);
    tablica.appendChild(thead);

    // Dodaj tijelo tablice
    const tbody = document.createElement('tbody');
    for (let i = 1; i <= 100; i++) {
        const row = document.createElement('tr');
        row.innerHTML = `<th>${i}</th>`;
        for (let j = 1; j <= 100; j++) {
            const cell = document.createElement('td');
            cell.textContent = i * j;
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener('click', handleCellClick);
            cell.addEventListener('mouseover', handleCellHover);
            cell.addEventListener('mouseout', handleCellOut);
            row.appendChild(cell);
        }
        tbody.appendChild(row);
    }
    tablica.appendChild(tbody);
}

// Generiranje zadataka
function generirajZadatke() {
    const zadaciContainer = document.getElementById('zadaci');
    zadaciContainer.innerHTML = '';

    for (let i = 0; i < 10; i++) {
        const broj1 = Math.floor(Math.random() * 100) + 1;
        const broj2 = Math.floor(Math.random() * 100) + 1;
        
        const zadatak = document.createElement('div');
        zadatak.className = 'zadatak';
        zadatak.innerHTML = `
            <span>${broj1} × ${broj2} = </span>
            <input type="number" class="odgovor-input" data-broj1="${broj1}" data-broj2="${broj2}">
            <button onclick="provjeriOdgovor(this)">Provjeri</button>
        `;
        
        // Dodaj event listener za Enter tipku
        const input = zadatak.querySelector('input');
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                provjeriOdgovor(this.nextElementSibling);
            }
        });

        zadaciContainer.appendChild(zadatak);
    }
}

// Event handleri za tablicu
function handleCellClick(e) {
    const row = e.target.dataset.row;
    const col = e.target.dataset.col;
    highlightCells(row, col);
}

function handleCellHover(e) {
    const row = e.target.dataset.row;
    const col = e.target.dataset.col;
    highlightCells(row, col, true);
}

function handleCellOut() {
    const cells = document.querySelectorAll('td.highlight:not(.tocno-rjesenje)');
    cells.forEach(cell => cell.classList.remove('highlight'));
}

function highlightCells(row, col, isHover = false) {
    if (!isHover) {
        handleCellOut();
    }
    
    const rowCells = document.querySelectorAll(`td[data-row="${row}"]`);
    const colCells = document.querySelectorAll(`td[data-col="${col}"]`);
    
    rowCells.forEach(cell => {
        if (!cell.classList.contains('tocno-rjesenje')) {
            cell.classList.add('highlight');
        }
    });
    
    colCells.forEach(cell => {
        if (!cell.classList.contains('tocno-rjesenje')) {
            cell.classList.add('highlight');
        }
    });
}

// Provjera odgovora
function provjeriOdgovor(button) {
    const zadatak = button.parentElement;
    const input = zadatak.querySelector('input');
    const broj1 = parseInt(input.dataset.broj1);
    const broj2 = parseInt(input.dataset.broj2);
    const korisnikovOdgovor = parseInt(input.value);
    const točanOdgovor = broj1 * broj2;

    if (korisnikovOdgovor === točanOdgovor) {
        // Označi zadatak kao točan
        zadatak.classList.remove('netocno');
        zadatak.classList.add('tocno');
        
        // Pronađi i označi odgovarajuću ćeliju u tablici
        const ćelija = document.querySelector(`td[data-row="${broj1}"][data-col="${broj2}"]`);
        if (ćelija) {
            ćelija.classList.add('tocno-rjesenje');
            // Dodaj efekt treperenja
            ćelija.style.animation = 'none';
            ćelija.offsetHeight; // Trigger reflow
            ćelija.style.animation = null;
        }

        // Onemogući daljnje izmjene
        input.disabled = true;
        button.disabled = true;
        button.textContent = '✓';
        
        // Prikaži poruku
        prikaziPoruku(`Bravo! ${broj1} × ${broj2} = ${točanOdgovor}`);
    } else {
        // Označi zadatak kao netočan
        zadatak.classList.remove('tocno');
        zadatak.classList.add('netocno');
        
        // Prikaži poruku
        prikaziPoruku('Pokušaj ponovno!');
        
        // Ukloni oznaku nakon 1 sekunde
        setTimeout(() => {
            zadatak.classList.remove('netocno');
        }, 1000);
    }
}

// Prikaži poruku o uspjehu/neuspjehu
function prikaziPoruku(tekst) {
    const postojecaPoruka = document.querySelector('.poruka');
    if (postojecaPoruka) {
        postojecaPoruka.remove();
    }

    const poruka = document.createElement('div');
    poruka.className = 'poruka';
    poruka.textContent = tekst;
    document.body.appendChild(poruka);

    // Prikaži poruku
    setTimeout(() => {
        poruka.style.opacity = '1';
    }, 10);

    // Sakrij poruku nakon 2 sekunde
    setTimeout(() => {
        poruka.style.opacity = '0';
        setTimeout(() => {
            poruka.remove();
        }, 300);
    }, 2000);
}

// Test mode
let testMode = false;
let timer;
let vrijeme;
let bodovi;

function startTest() {
    if (testMode) return;
    
    testMode = true;
    vrijeme = 300; // 5 minuta
    bodovi = 0;
    
    // Prikaži timer i bodove
    document.querySelector('.test-info').style.display = 'flex';
    document.getElementById('vrijeme').textContent = vrijeme;
    document.getElementById('bodovi').textContent = '0';
    
    // Generiraj nove zadatke
    generirajZadatke();
    
    // Dodaj test-mode klasu na zadatke
    document.querySelectorAll('.zadatak').forEach(zadatak => {
        zadatak.classList.add('test-mode');
    });
    
    // Onemogući gumbe tijekom testa
    document.getElementById('startTest').disabled = true;
    document.getElementById('generirajZadatke').disabled = true;
    
    // Pokreni timer
    timer = setInterval(() => {
        vrijeme--;
        document.getElementById('vrijeme').textContent = vrijeme;
        
        // Dodaj warning klasu kad je malo vremena preostalo
        if (vrijeme <= 60) {
            document.querySelector('.timer').classList.add('warning');
        }
        
        if (vrijeme <= 0) {
            zavrsiTest();
        }
    }, 1000);
}

function zavrsiTest() {
    clearInterval(timer);
    testMode = false;
    
    // Izračunaj rezultat
    const ukupnoZadataka = document.querySelectorAll('.zadatak').length;
    const tocnihZadataka = document.querySelectorAll('.zadatak.tocno').length;
    const postotak = (tocnihZadataka / ukupnoZadataka) * 100;
    
    // Odredi ocjenu
    let ocjena;
    if (postotak >= 90) ocjena = 5;
    else if (postotak >= 80) ocjena = 4;
    else if (postotak >= 70) ocjena = 3;
    else if (postotak >= 60) ocjena = 2;
    else ocjena = 1;
    
    // Prikaži rezultate
    const rezultat = document.createElement('div');
    rezultat.className = 'rezultat-testa';
    rezultat.innerHTML = `
        <h2>Test je završen!</h2>
        <p>Točno riješenih zadataka: ${tocnihZadataka}/${ukupnoZadataka}</p>
        <p>Postotak uspješnosti: ${postotak.toFixed(1)}%</p>
        <div class="ocjena">Ocjena: ${ocjena}</div>
        <button onclick="resetTest()">Započni Novi Test</button>
    `;
    document.body.appendChild(rezultat);
    
    // Sakrij timer i resetiraj stanje
    document.querySelector('.test-info').style.display = 'none';
    document.getElementById('startTest').disabled = false;
    document.getElementById('generirajZadatke').disabled = false;
}

function resetTest() {
    document.querySelector('.rezultat-testa').remove();
    document.querySelector('.timer').classList.remove('warning');
    generirajZadatke();
}

// Event listeneri
document.getElementById('startTest').addEventListener('click', startTest);
document.getElementById('generirajZadatke').addEventListener('click', generirajZadatke);

// Inicijalno generiranje tablice i zadataka
window.onload = function() {
    generirajTablicu();
    generirajZadatke();
};
