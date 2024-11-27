// Generiranje tablice množenja
function generirajTablicu() {
    const tablica = document.getElementById('tablicaMnozenja');
    tablica.innerHTML = '';

    // Dodaj zaglavlje
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = '<th>×</th>';
    for (let i = 1; i <= 10; i++) {
        headerRow.innerHTML += `<th>${i}</th>`;
    }
    thead.appendChild(headerRow);
    tablica.appendChild(thead);

    // Dodaj tijelo tablice
    const tbody = document.createElement('tbody');
    for (let i = 1; i <= 10; i++) {
        const row = document.createElement('tr');
        row.innerHTML = `<th>${i}</th>`;
        for (let j = 1; j <= 10; j++) {
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

// Rukovanje klikovima na ćelije
function handleCellClick(e) {
    const cell = e.target;
    const row = cell.dataset.row;
    const col = cell.dataset.col;
    const result = parseInt(cell.textContent);

    // Ukloni aktivnu klasu sa svih ćelija
    document.querySelectorAll('td').forEach(td => td.classList.remove('active'));

    // Dodaj aktivnu klasu na kliknutu ćeliju
    cell.classList.add('active');

    // Prikaži informaciju o množenju
    prikaziInformaciju(`${row} × ${col} = ${result}`);
}

// Rukovanje prelaskom miša preko ćelije
function handleCellHover(e) {
    const cell = e.target;
    const row = cell.dataset.row;
    const col = cell.dataset.col;
    
    // Označi redak i stupac
    document.querySelectorAll(`td[data-row="${row}"]`).forEach(td => 
        td.style.backgroundColor = 'var(--cell-highlight)');
    document.querySelectorAll(`td[data-col="${col}"]`).forEach(td => 
        td.style.backgroundColor = 'var(--cell-highlight)');
}

// Rukovanje odlaskom miša s ćelije
function handleCellOut(e) {
    // Vrati sve ćelije na originalnu boju
    document.querySelectorAll('td').forEach(td => {
        if (!td.classList.contains('active')) {
            td.style.backgroundColor = '';
        }
    });
}

// Prikaži informaciju o množenju
function prikaziInformaciju(tekst) {
    let info = document.getElementById('info-množenje');
    if (!info) {
        info = document.createElement('div');
        info.id = 'info-množenje';
        info.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--primary-color);
            color: white;
            padding: 10px 20px;
            border-radius: var(--border-radius);
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 1000;
            transition: opacity 0.3s ease;
        `;
        document.body.appendChild(info);
    }
    info.textContent = tekst;
    info.style.opacity = '1';
    
    // Sakrij informaciju nakon 2 sekunde
    setTimeout(() => {
        info.style.opacity = '0';
    }, 2000);
}

// Generiranje zadataka
function generirajZadatke() {
    const zadaciContainer = document.getElementById('zadaci');
    zadaciContainer.innerHTML = '';

    for (let i = 0; i < 10; i++) {
        const broj1 = Math.floor(Math.random() * 10) + 1;
        const broj2 = Math.floor(Math.random() * 10) + 1;
        
        const zadatak = document.createElement('div');
        zadatak.className = 'zadatak';
        zadatak.innerHTML = `
            <span>${broj1} × ${broj2} = </span>
            <input type="number" class="odgovor-input" data-broj1="${broj1}" data-broj2="${broj2}">
            <button onclick="provjeriOdgovor(this)">Provjeri</button>
        `;
        zadaciContainer.appendChild(zadatak);
    }
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
    let poruka = document.getElementById('poruka');
    if (!poruka) {
        poruka = document.createElement('div');
        poruka.id = 'poruka';
        poruka.className = 'poruka';
        document.body.appendChild(poruka);
    }
    
    poruka.textContent = tekst;
    poruka.style.opacity = '1';
    
    setTimeout(() => {
        poruka.style.opacity = '0';
    }, 2000);
}

let testMode = false;
let timer = null;
let bodovi = 0;
let preostaloVrijeme = 300; // 5 minuta

// Event listeneri
document.addEventListener('DOMContentLoaded', () => {
    generirajTablicu();
    generirajZadatke();

    document.getElementById('startTest').addEventListener('click', započniTest);
    document.getElementById('generirajZadatke').addEventListener('click', generirajZadatke);
});

// Započni test
function započniTest() {
    testMode = true;
    bodovi = 0;
    preostaloVrijeme = 300;
    
    // Resetiraj UI
    document.querySelector('.test-info').style.display = 'flex';
    document.getElementById('bodovi').textContent = '0';
    document.getElementById('vrijeme').textContent = preostaloVrijeme;
    document.getElementById('startTest').disabled = true;
    document.getElementById('generirajZadatke').disabled = true;
    
    // Generiraj nove zadatke za test
    generirajZadatke();
    
    // Pokreni timer
    timer = setInterval(() => {
        preostaloVrijeme--;
        document.getElementById('vrijeme').textContent = preostaloVrijeme;
        
        // Upozorenje kad je malo vremena preostalo
        if (preostaloVrijeme <= 60) {
            document.querySelector('.timer').classList.add('upozorenje');
        }
        
        // Završi test kad vrijeme istekne
        if (preostaloVrijeme <= 0) {
            završiTest();
        }
    }, 1000);
}

// Završi test
function završiTest() {
    clearInterval(timer);
    testMode = false;
    
    // Onemogući daljnje odgovore
    document.querySelectorAll('.zadatak input, .zadatak button').forEach(el => {
        el.disabled = true;
    });
    
    // Prikaži rezultate
    const postotak = (bodovi / 10) * 100;
    const ocjena = izračunajOcjenu(postotak);
    
    const rezultatDiv = document.createElement('div');
    rezultatDiv.className = 'rezultat-testa';
    rezultatDiv.innerHTML = `
        <h3>Test Završen!</h3>
        <p>Bodovi: ${bodovi}/10</p>
        <p>Postotak: ${postotak}%</p>
        <p>Ocjena: ${ocjena}</p>
        <button onclick="resetirajTest()">Započni Novi Test</button>
    `;
    document.body.appendChild(rezultatDiv);
}

// Izračunaj ocjenu
function izračunajOcjenu(postotak) {
    if (postotak >= 90) return '5';
    if (postotak >= 80) return '4';
    if (postotak >= 65) return '3';
    if (postotak >= 50) return '2';
    return '1';
}

// Resetiraj test
function resetirajTest() {
    document.querySelector('.rezultat-testa')?.remove();
    document.querySelector('.test-info').style.display = 'none';
    document.getElementById('startTest').disabled = false;
    document.getElementById('generirajZadatke').disabled = false;
    document.querySelector('.timer').classList.remove('upozorenje');
    generirajZadatke();
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
        }

        // Onemogući daljnje izmjene
        input.disabled = true;
        button.disabled = true;
        button.textContent = '✓';
        
        // Dodaj bod ako smo u test modu
        if (testMode) {
            bodovi++;
            document.getElementById('bodovi').textContent = bodovi;
            
            // Provjeri jesmo li završili test
            if (document.querySelectorAll('.zadatak.tocno').length === 10) {
                završiTest();
            }
        }
        
        prikaziPoruku(`Bravo! ${broj1} × ${broj2} = ${točanOdgovor}`);
    } else {
        zadatak.classList.remove('tocno');
        zadatak.classList.add('netocno');
        prikaziPoruku('Pokušaj ponovno!');
        
        setTimeout(() => {
            zadatak.classList.remove('netocno');
        }, 1000);
    }
}
