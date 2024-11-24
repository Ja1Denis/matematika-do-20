// Padezi
const CASES = {
    NOMINATIVE: 'nominativ',
    GENITIVE: 'genitiv',
    DATIVE: 'dativ',
    ACCUSATIVE: 'akuzativ',
    VOCATIVE: 'vokativ',
    LOCATIVE: 'lokativ',
    INSTRUMENTAL: 'instrumental'
};

// Pravila za deklinaciju brojeva
const numberWords = {
    1: 'jedan',
    2: 'dva',
    3: 'tri',
    4: 'četiri',
    5: 'pet',
    6: 'šest',
    7: 'sedam',
    8: 'osam',
    9: 'devet',
    10: 'deset'
};

// Funkcija za deklinaciju imenica prema broju
function declineNounByNumber(number, noun) {
    const nounForms = {
        bombon: {
            singular: 'bombon',
            paucal: 'bombona',    // za 2-4
            plural: 'bombona'     // za 5+
        },
        sendvič: {
            singular: 'sendvič',
            paucal: 'sendviča',
            plural: 'sendviča'
        },
        ptica: {
            singular: 'ptica',
            paucal: 'ptice',
            plural: 'ptica'
        },
        kilogram: {
            singular: 'kilogram',
            paucal: 'kilograma',
            plural: 'kilograma'
        },
        jabuka: {
            singular: 'jabuka',
            paucal: 'jabuke',
            plural: 'jabuka'
        },
        lopta: {
            singular: 'lopta',
            paucal: 'lopte',
            plural: 'lopti'
        },
        sličica: {
            singular: 'sličica',
            paucal: 'sličice',
            plural: 'sličica'
        },
        čokolada: {
            singular: 'čokolada',
            paucal: 'čokolade',
            plural: 'čokolada'
        },
        balon: {
            singular: 'balon',
            paucal: 'balona',
            plural: 'balona'
        },
        kocka: {
            singular: 'kocka',
            paucal: 'kocke',
            plural: 'kocki'
        },
        olovka: {
            singular: 'olovka',
            paucal: 'olovke',
            plural: 'olovaka'
        },
        bojica: {
            singular: 'bojica',
            paucal: 'bojice',
            plural: 'bojica'
        },
        keks: {
            singular: 'keks',
            paucal: 'keksa',
            plural: 'keksa'
        },
        lizalica: {
            singular: 'lizalica',
            paucal: 'lizalice',
            plural: 'lizalica'
        },
        naranča: {
            singular: 'naranča',
            paucal: 'naranče',
            plural: 'naranči'
        }
    };

    if (!nounForms[noun]) {
        console.warn(`Imenica "${noun}" nije definirana u sustavu deklinacija.`);
        return noun;
    }

    if (number === 1) {
        return nounForms[noun].singular;
    } else if (number >= 2 && number <= 4) {
        return nounForms[noun].paucal;
    } else {
        return nounForms[noun].plural;
    }
}

// Funkcija za deklinaciju muških imena
function declineName(name, padez = CASES.NOMINATIVE) {
    const nameRules = {
        // Imena koja završavaju na suglasnik
        consonantEnding: {
            test: (name) => /[bcčćdđfghjklmnprsštvzž]$/i.test(name),
            decline: (name) => ({
                [CASES.NOMINATIVE]: name,
                [CASES.GENITIVE]: name + 'a',
                [CASES.DATIVE]: name + 'u',
                [CASES.ACCUSATIVE]: name + 'a',
                [CASES.VOCATIVE]: name + 'e',
                [CASES.LOCATIVE]: name + 'u',
                [CASES.INSTRUMENTAL]: name + 'om'
            })
        },
        // Imena koja završavaju na -a
        aEnding: {
            test: (name) => /a$/i.test(name),
            decline: (name) => ({
                [CASES.NOMINATIVE]: name,
                [CASES.GENITIVE]: name.slice(0, -1) + 'e',
                [CASES.DATIVE]: name.slice(0, -1) + 'i',
                [CASES.ACCUSATIVE]: name.slice(0, -1) + 'u',
                [CASES.VOCATIVE]: name,
                [CASES.LOCATIVE]: name.slice(0, -1) + 'i',
                [CASES.INSTRUMENTAL]: name.slice(0, -1) + 'om'
            })
        },
        // Imena koja završavaju na -o ili -e (osim posebnih slučajeva)
        oEnding: {
            test: (name) => /[oe]$/i.test(name),
            decline: (name) => ({
                [CASES.NOMINATIVE]: name,
                [CASES.GENITIVE]: name + 'a',
                [CASES.DATIVE]: name + 'u',
                [CASES.ACCUSATIVE]: name + 'a',
                [CASES.VOCATIVE]: name,
                [CASES.LOCATIVE]: name + 'u',
                [CASES.INSTRUMENTAL]: name + 'om'
            })
        }
    };

    // Pronađi pravilo koje odgovara imenu
    const rule = Object.values(nameRules).find(rule => rule.test(name));
    if (!rule) {
        console.warn(`Nije pronađeno pravilo za deklinaciju imena "${name}"`);
        return name;
    }

    // Dekliniraj ime prema pravilu
    const declensions = rule.decline(name);
    return declensions[padez] || name;
}

// Funkcija za slaganje glagola s rodom
function getVerbGenderForm(name, masculine, feminine, neutral) {
    return /a$/i.test(name) ? feminine : masculine;
}

// Globalni objekt za deklinaciju
const declension = {
    CASES,
    numberWords,
    declineNounByNumber,
    declineName,
    getVerbGenderForm
};
