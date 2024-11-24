// Predlošci zadataka
const taskTemplates = [
    {
        id: 'ptice',
        template: (a, b) => {
            const ptice = declension.declineNounByNumber(a, 'ptica');
            const suBile = a === 1 ? 'je bila' : 'su bile';
            const odletjele = b === 1 ? 'je odletjela' : 'su odletjele';
            return `Na grani ${suBile} ${declension.numberWords[a]} ${ptice}. ${declension.numberWords[b]} ${odletjele}.
Koliko je ptica sada na grani?`;
        },
        generate: () => {
            const total = Math.floor(Math.random() * 5) + 2;
            const leave = Math.floor(Math.random() * (total - 1)) + 1;
            return { numbers: [total, leave], answer: total - leave };
        }
    },
    {
        id: 'bomboni',
        template: (a, b) => {
            const childName = names.children[Math.floor(Math.random() * names.children.length)];
            const bomboni = declension.declineNounByNumber(a, 'bombon');
            const pojedeni = declension.declineNounByNumber(b, 'bombon');
            const glagol = declension.getVerbGenderForm(childName, 'pojeo', 'pojela', 'pojeo');
            return `${childName} je ${declension.getVerbGenderForm(childName, 'kupio', 'kupila', 'kupio')} ${declension.numberWords[a]} ${bomboni}. ${declension.numberWords[b]} ${pojedeni} ${glagol}.
Koliko bombona ima sada?`;
        },
        generate: () => {
            const total = Math.floor(Math.random() * 5) + 2;
            const eat = Math.floor(Math.random() * (total - 1)) + 1;
            return { numbers: [total, eat], answer: total - eat };
        }
    },
    {
        id: 'brasno',
        template: (a, b) => {
            const adultName = names.adults[Math.floor(Math.random() * names.adults.length)];
            const kilogrami = declension.declineNounByNumber(a, 'kilogram');
            const potroseni = declension.declineNounByNumber(b, 'kilogram');
            return `U vreći ${a === 1 ? 'je bio' : 'je bilo'} ${declension.numberWords[a]} ${kilogrami} brašna. ${declension.declineName(adultName, declension.CASES.NOMINATIVE)} je potrošila ${declension.numberWords[b]} ${potroseni}.
Koliko je kilograma brašna ostalo u vreći?`;
        },
        generate: () => {
            const total = Math.floor(Math.random() * 5) + 2;
            const used = Math.floor(Math.random() * (total - 1)) + 1;
            return { numbers: [total, used], answer: total - used };
        }
    },
    {
        id: 'sendvici',
        template: (a, b) => {
            const childName = names.children[Math.floor(Math.random() * names.children.length)];
            const sendvici = declension.declineNounByNumber(a, 'sendvič');
            const pojedeni = declension.declineNounByNumber(b, 'sendvič');
            const glagol = declension.getVerbGenderForm(childName, 'pojeo', 'pojela', 'pojeo');
            const ponio = declension.getVerbGenderForm(childName, 'ponio', 'ponijela', 'ponio');
            return `${childName} je na izlet ${ponio} ${declension.numberWords[a]} ${sendvici}. ${declension.numberWords[b]} ${pojedeni} ${glagol}.
Koliko ${declension.getVerbGenderForm(childName, 'mu', 'joj', 'mu')} je sendviča ostalo?`;
        },
        generate: () => {
            const total = Math.floor(Math.random() * 5) + 2;
            const eaten = Math.floor(Math.random() * (total - 1)) + 1;
            return { numbers: [total, eaten], answer: total - eaten };
        }
    },
    {
        id: 'jabuke',
        template: (a, b) => {
            const childName = names.children[Math.floor(Math.random() * names.children.length)];
            const jabuke = declension.declineNounByNumber(a, 'jabuka');
            const pojedene = declension.declineNounByNumber(b, 'jabuka');
            const glagol = declension.getVerbGenderForm(childName, 'pojeo', 'pojela', 'pojelo');
            return `${childName} je ${declension.getVerbGenderForm(childName, 'ubrao', 'ubrala', 'ubralo')} ${declension.numberWords[a]} ${jabuke}. ${declension.numberWords[b]} ${pojedene} je ${glagol}.
Koliko ${declension.getVerbGenderForm(childName, 'mu', 'joj', 'mu')} je jabuka ostalo?`;
        },
        generate: () => {
            const total = Math.floor(Math.random() * 5) + 2;
            const eaten = Math.floor(Math.random() * (total - 1)) + 1;
            return { numbers: [total, eaten], answer: total - eaten };
        }
    },
    {
        id: 'lopte',
        template: (a, b) => {
            const childName = names.children[Math.floor(Math.random() * names.children.length)];
            const lopte = declension.declineNounByNumber(a, 'lopta');
            const izgubljene = declension.declineNounByNumber(b, 'lopta');
            return `${childName} je ${declension.getVerbGenderForm(childName, 'imao', 'imala', 'imalo')} ${declension.numberWords[a]} ${lopte}. ${declension.numberWords[b]} ${izgubljene} je ${declension.getVerbGenderForm(childName, 'izgubio', 'izgubila', 'izgubilo')}.
Koliko ${declension.getVerbGenderForm(childName, 'mu', 'joj', 'mu')} je lopti ostalo?`;
        },
        generate: () => {
            const total = Math.floor(Math.random() * 5) + 2;
            const lost = Math.floor(Math.random() * (total - 1)) + 1;
            return { numbers: [total, lost], answer: total - lost };
        }
    },
    {
        id: 'sličice',
        template: (a, b) => {
            const childName = names.children[Math.floor(Math.random() * names.children.length)];
            const friendName = names.children[Math.floor(Math.random() * names.children.length)];
            const sličice = declension.declineNounByNumber(a, 'sličica');
            const poklonjene = declension.declineNounByNumber(b, 'sličica');
            return `${childName} je ${declension.getVerbGenderForm(childName, 'skupio', 'skupila', 'skupilo')} ${declension.numberWords[a]} ${sličice}. ${declension.numberWords[b]} ${poklonjene} je ${declension.getVerbGenderForm(childName, 'poklonio', 'poklonila', 'poklonilo')} ${declension.declineName(friendName, declension.CASES.DATIVE)}.
Koliko ${declension.getVerbGenderForm(childName, 'mu', 'joj', 'mu')} je sličica ostalo?`;
        },
        generate: () => {
            const total = Math.floor(Math.random() * 5) + 2;
            const given = Math.floor(Math.random() * (total - 1)) + 1;
            return { numbers: [total, given], answer: total - given };
        }
    },
    {
        id: 'čokolade',
        template: (a, b) => {
            const adultName = names.adults[Math.floor(Math.random() * names.adults.length)];
            const čokolade = declension.declineNounByNumber(a, 'čokolada');
            const podijeljene = declension.declineNounByNumber(b, 'čokolada');
            return `${adultName} je kupila ${declension.numberWords[a]} ${čokolade}. ${declension.numberWords[b]} ${podijeljene} je podijelila djeci.
Koliko joj je čokolada ostalo?`;
        },
        generate: () => {
            const total = Math.floor(Math.random() * 5) + 2;
            const shared = Math.floor(Math.random() * (total - 1)) + 1;
            return { numbers: [total, shared], answer: total - shared };
        }
    },
    {
        id: 'baloni',
        template: (a, b) => {
            const childName = names.children[Math.floor(Math.random() * names.children.length)];
            const baloni = declension.declineNounByNumber(a, 'balon');
            const puknuti = declension.declineNounByNumber(b, 'balon');
            return `${childName} je ${declension.getVerbGenderForm(childName, 'dobio', 'dobila', 'dobilo')} ${declension.numberWords[a]} ${baloni}. ${declension.numberWords[b]} ${puknuti} ${b === 1 ? 'je puknuo' : 'su puknuli'}.
Koliko ${declension.getVerbGenderForm(childName, 'mu', 'joj', 'mu')} je balona ostalo?`;
        },
        generate: () => {
            const total = Math.floor(Math.random() * 5) + 2;
            const popped = Math.floor(Math.random() * (total - 1)) + 1;
            return { numbers: [total, popped], answer: total - popped };
        }
    },
    {
        id: 'kocke',
        template: (a, b) => {
            const childName = names.children[Math.floor(Math.random() * names.children.length)];
            const kocke = declension.declineNounByNumber(a, 'kocka');
            const dodane = declension.declineNounByNumber(b, 'kocka');
            return `${childName} je ${declension.getVerbGenderForm(childName, 'složio', 'složila', 'složilo')} toranj od ${declension.numberWords[a]} ${kocke}. Zatim je ${declension.getVerbGenderForm(childName, 'dodao', 'dodala', 'dodalo')} još ${declension.numberWords[b]} ${dodane}.
Koliko sada ima kocki u tornju?`;
        },
        generate: () => {
            const initial = Math.floor(Math.random() * 5) + 2;
            const added = Math.floor(Math.random() * 4) + 1;
            return { numbers: [initial, added], answer: initial + added };
        }
    },
    {
        id: 'olovke',
        template: (a, b) => {
            const childName = names.children[Math.floor(Math.random() * names.children.length)];
            const olovke = declension.declineNounByNumber(a, 'olovka');
            const posudene = declension.declineNounByNumber(b, 'olovka');
            return `${childName} je ${declension.getVerbGenderForm(childName, 'imao', 'imala', 'imalo')} ${declension.numberWords[a]} ${olovke}. ${declension.numberWords[b]} ${posudene} je ${declension.getVerbGenderForm(childName, 'posudio', 'posudila', 'posudilo')} prijateljima.
Koliko ${declension.getVerbGenderForm(childName, 'mu', 'joj', 'mu')} je olovaka ostalo?`;
        },
        generate: () => {
            const total = Math.floor(Math.random() * 5) + 2;
            const lent = Math.floor(Math.random() * (total - 1)) + 1;
            return { numbers: [total, lent], answer: total - lent };
        }
    },
    {
        id: 'bojice',
        template: (a, b) => {
            const childName = names.children[Math.floor(Math.random() * names.children.length)];
            const bojice = declension.declineNounByNumber(a, 'bojica');
            const nove = declension.declineNounByNumber(b, 'bojica');
            return `${childName} je ${declension.getVerbGenderForm(childName, 'imao', 'imala', 'imalo')} ${declension.numberWords[a]} ${bojice}. Za rođendan je ${declension.getVerbGenderForm(childName, 'dobio', 'dobila', 'dobilo')} još ${declension.numberWords[b]} ${nove}.
Koliko sada ima bojica?`;
        },
        generate: () => {
            const initial = Math.floor(Math.random() * 5) + 2;
            const received = Math.floor(Math.random() * 4) + 1;
            return { numbers: [initial, received], answer: initial + received };
        }
    },
    {
        id: 'keksi',
        template: (a, b) => {
            const childName = names.children[Math.floor(Math.random() * names.children.length)];
            const keksi = declension.declineNounByNumber(a, 'keks');
            const pojedeni = declension.declineNounByNumber(b, 'keks');
            return `Mama je ${childName} dala ${declension.numberWords[a]} ${keksi}. ${declension.numberWords[b]} ${pojedeni} je ${declension.getVerbGenderForm(childName, 'pojeo', 'pojela', 'pojelo')} odmah.
Koliko ${declension.getVerbGenderForm(childName, 'mu', 'joj', 'mu')} je keksa ostalo?`;
        },
        generate: () => {
            const total = Math.floor(Math.random() * 5) + 2;
            const eaten = Math.floor(Math.random() * (total - 1)) + 1;
            return { numbers: [total, eaten], answer: total - eaten };
        }
    },
    {
        id: 'lizalice',
        template: (a, b) => {
            const childName = names.children[Math.floor(Math.random() * names.children.length)];
            const lizalice = declension.declineNounByNumber(a, 'lizalica');
            const poklonjene = declension.declineNounByNumber(b, 'lizalica');
            return `${childName} je ${declension.getVerbGenderForm(childName, 'kupio', 'kupila', 'kupilo')} ${declension.numberWords[a]} ${lizalice}. ${declension.numberWords[b]} ${poklonjene} je ${declension.getVerbGenderForm(childName, 'poklonio', 'poklonila', 'poklonilo')} prijateljima.
Koliko ${declension.getVerbGenderForm(childName, 'mu', 'joj', 'mu')} je lizalica ostalo?`;
        },
        generate: () => {
            const total = Math.floor(Math.random() * 5) + 2;
            const given = Math.floor(Math.random() * (total - 1)) + 1;
            return { numbers: [total, given], answer: total - given };
        }
    },
    {
        id: 'naranče',
        template: (a, b) => {
            const childName = names.children[Math.floor(Math.random() * names.children.length)];
            const naranče = declension.declineNounByNumber(a, 'naranča');
            const podijeljene = declension.declineNounByNumber(b, 'naranča');
            return `${childName} je ${declension.getVerbGenderForm(childName, 'ubrao', 'ubrala', 'ubralo')} ${declension.numberWords[a]} ${naranče}. ${declension.numberWords[b]} ${podijeljene} je ${declension.getVerbGenderForm(childName, 'podijelio', 'podijelila', 'podijelilo')} prijateljima.
Koliko ${declension.getVerbGenderForm(childName, 'mu', 'joj', 'mu')} je naranči ostalo?`;
        },
        generate: () => {
            const total = Math.floor(Math.random() * 5) + 2;
            const shared = Math.floor(Math.random() * (total - 1)) + 1;
            return { numbers: [total, shared], answer: total - shared };
        }
    }
];
