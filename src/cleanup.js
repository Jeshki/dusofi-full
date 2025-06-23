// ... (failo pradžia)

// Apdorojame filosofus, kad pašalintume pasikartojančias citatas
const cleanedPhilosophers = philosophers.map(philosopher => {
    // Sukuriami Set'ai, kurie saugos jau matytas citatas
    const seenEnglishQuotes = new Set();
    const seenLithuanianQuotes = new Set();

    const currentQuotes = [];
    const currentQuotes_lt = [];

    // Apdorojame angliškas citatas
    if (philosopher.quotes && Array.isArray(philosopher.quotes)) {
        philosopher.quotes.forEach(quote => {
            // Patikrinama, ar citata dar nebuvo matyta
            if (typeof quote === 'string' && quote.trim() !== '' && !seenEnglishQuotes.has(quote.trim())) {
                currentQuotes.push(quote.trim()); // Įdedama į naują masyvą
                seenEnglishQuotes.add(quote.trim()); // Pažymima kaip matyta
            }
        });
    }

    // Apdorojame lietuviškas citatas (tas pats principas)
    if (philosopher.quotes_lt && Array.isArray(philosopher.quotes_lt)) {
        philosopher.quotes_lt.forEach(quote_lt => {
            if (typeof quote_lt === 'string' && quote_lt.trim() !== '' && !seenLithuanianQuotes.has(quote_lt.trim())) {
                currentQuotes_lt.push(quote_lt.trim());
                seenLithuanianQuotes.add(quote_lt.trim());
            }
        });
    }

    // Grąžinamas filosofo objektas su išvalytomis citatomis
    return {
        ...philosopher,
        quotes: currentQuotes,
        quotes_lt: currentQuotes_lt,
    };
});

// ... (toliau spausdinamas rezultatas)