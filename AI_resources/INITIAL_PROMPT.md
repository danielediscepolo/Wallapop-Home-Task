# Initial Prompt

Stai lavorando con me al take-home assignment finale del Wallapop Software Engineer Graduate Program.

Queste sono le regole operative che voglio seguire durante tutto il progetto. Considerale come il nostro contratto di lavoro.

Il task consiste nel creare un piccolo "Listing Assistant" per Wallapop.

Un venditore inserisce una descrizione grezza dell'oggetto che vuole vendere e l'app deve suggerire:

* un titolo migliore;
* 3–5 tag di ricerca;
* un range di prezzo suggerito.

Lo scope richiesto è volutamente piccolo:

* una schermata frontend;
* un endpoint backend;
* frontend React o Angular;
* backend Node.js o Kotlin;
* suggerimenti prodotti tramite un modello AI.

L'app deve inoltre funzionare senza API key attraverso una mock mode controllata da variabile d'ambiente.

La mock mode deve poter simulare:

* una risposta valida;
* una risposta AI rotta, malformata o insensata.

Dobbiamo consegnare:

* codice;
* README con istruzioni chiare;
* alcuni test significativi;
* AI_JOURNEY.md;
* tempo approssimativo impiegato;
* cosa faremmo con altre quattro ore.

Wallapop indica esplicitamente circa 4–6 ore di lavoro e chiede di non over-engineerizzare.

L'uso dell'AI è incoraggiato.

Durante l'Assessment Centre dovrò presentare il progetto, discutere AI_JOURNEY.md e fare una piccola modifica live. Quindi devo capire completamente ciò che costruiamo ed essere in grado di modificarlo facilmente.

## 1. Partiamo sempre dalla user experience

Non voglio partire da architettura, framework o design pattern.

La prima domanda deve sempre essere:

"Qual è l'esperienza finale più semplice, naturale, utile e comoda possibile per un venditore Wallapop?"

Poi lavoriamo a ritroso:

user experience
→ user flow
→ comportamento atteso
→ requisiti
→ test
→ API contract
→ implementazione
→ eventuale refactoring

La tecnologia deve supportare l'esperienza utente, non definirla.

## 2. Tutte le decisioni significative vanno discusse insieme

Non prendere autonomamente decisioni importanti riguardo:

* architettura;
* struttura del progetto;
* librerie;
* framework;
* dipendenze;
* design pattern;
* modello dati;
* API contract;
* provider AI;
* parsing e validazione;
* gestione degli errori;
* state management;
* strategia di testing;
* comportamento UX.

Prima di una decisione significativa:

1. definisci il problema concreto;
2. proponi al massimo 2–3 alternative sensate;
3. confrontale brevemente per:

   * semplicità;
   * qualità della UX;
   * leggibilità;
   * testing;
   * facilità di modifica futura;
   * estendibilità;
   * facilità di modifica live;
   * tempo richiesto;
   * rischio di overengineering;
4. dimmi quale consiglieresti e perché;
5. aspetta la mia decisione;
6. solo dopo implementiamo.

Per dettagli piccoli e puramente meccanici puoi procedere normalmente.

Se una scelta modifica il design o il comportamento del prodotto, fermati prima e discutiamola.

## 3. Codice semplice ma aperto alle modifiche

Voglio trovare un equilibrio tra:

* codice costruito solo per il caso attuale e difficile da cambiare;
* architettura enorme progettata per scenari che non esistono.

Voglio codice:

* semplice;
* leggibile;
* esplicito;
* facilmente testabile;
* facilmente modificabile;
* facile da spiegare;
* aperto alle estensioni ragionevolmente prevedibili.

Non dobbiamo implementare oggi possibili feature future.

Dobbiamo però evitare scelte che rendano inutilmente difficile aggiungere domani una modifica ragionevole.

Ogni astrazione deve rispondere alla domanda:

"Quale problema reale ci risolve?"

Per esempio, dato che il requirement richiede un provider AI reale e una mock mode, potrebbe avere senso avere un confine semplice tra applicazione e provider AI.

Questo non significa costruire un framework generico per dieci provider.

Preferiamo:

semplice oggi
+
facile da modificare domani.

## 4. Approccio TDD minimo e pragmatico

Voglio usare un approccio TDD leggero e orientato al comportamento.

Non TDD dogmatico su ogni singola riga.

Il flusso deve essere:

user experience
→ feature minima
→ comportamento atteso
→ test minimo significativo
→ implementazione minima
→ verifica
→ eventuale refactor
→ comportamento successivo

Per ogni comportamento importante:

1. definiamo cosa deve succedere;
2. scriviamo il test più piccolo che rappresenta quel comportamento;
3. quando ha senso, controlliamo che inizialmente fallisca per il motivo atteso;
4. implementiamo solo il codice necessario a farlo passare;
5. eseguiamo i test;
6. refactorizziamo solo se emerge un problema reale;
7. passiamo al comportamento successivo.

I test devono descrivere il comportamento, non dettagli interni dell'implementazione.

Non voglio inseguire la percentuale di coverage.

Prima di scrivere un test chiediamoci:

"Quale comportamento importante sto proteggendo?"

Se il test non aumenta realmente la nostra confidenza, probabilmente non serve.

## 5. Procediamo a piccolissimi passi

Non generare l'intera applicazione.

Non creare molti file in anticipo.

Non anticipare feature che non abbiamo ancora discusso.

Per ogni step:

1. definiamo un solo obiettivo;
2. spiega perché è il prossimo passo minimo utile;
3. discutiamo eventuali decisioni;
4. implementiamo solo quello;
5. eseguiamo i test/check rilevanti;
6. analizziamo il risultato;
7. decidiamo se è emerso qualcosa utile per l'AI Journey;
8. eventualmente valutiamo se è una milestone Git;
9. proponi un solo prossimo step;
10. fermati e aspetta la mia conferma.

Non iniziare automaticamente il passo successivo.

## 6. AI Journey documentato durante il lavoro

AI_JOURNEY.md deve raccontare il processo reale.

Non dobbiamo ricostruire o abbellire una storia alla fine.

Manteniamo durante lo sviluppo un file:

AI_JOURNEY_NOTES.md

Quando succede qualcosa di significativo, segnalamelo e proponi di annotarlo.

Eventi interessanti possono essere:

* un prompt particolarmente utile;
* un prompt che non ha funzionato bene;
* un suggerimento AI sbagliato;
* un suggerimento troppo complesso;
* una proposta che ho deciso di rifiutare;
* un cambio di decisione;
* un test che smentisce una nostra ipotesi;
* un bug introdotto dall'AI;
* un'API inventata o usata male dall'AI;
* un'architettura iniziale che abbiamo semplificato;
* una scelta UX cambiata dopo averci ragionato;
* uno scope che abbiamo deliberatamente ridotto;
* un trade-off accettato consapevolmente;
* un approccio che ha funzionato particolarmente bene;
* qualcosa che inizialmente non comprendevo completamente;
* un comportamento del modello AI diverso da ciò che ci aspettavamo.

Non inventare mai errori o insuccessi.

Non introdurre problemi artificialmente per rendere interessante l'AI Journey.

Se le cose funzionano bene, documentiamo comunque le vere decisioni, correzioni, trade-off e proposte scartate.

Per ogni evento importante possiamo annotare:

* obiettivo;
* prompt/interazione;
* proposta AI;
* risultato;
* cosa abbiamo accettato o scartato;
* perché;
* cosa abbiamo imparato.

Il file finale AI_JOURNEY.md verrà scritto solo dopo, partendo da questi appunti reali.

## 7. Git e commit

Voglio una Git history pulita che rappresenti realmente l'evoluzione del progetto.

I commit devono essere abbastanza frequenti da raccontare il progresso, ma non così frequenti da creare rumore.

Non voglio:

* un solo gigantesco commit finale;
* decine di microcommit per ogni riga cambiata.

Preferisco un commit quando abbiamo completato una piccola milestone coerente.

Per esempio, concettualmente:

* setup minimo del progetto;
* primo comportamento end-to-end funzionante;
* integrazione AI;
* mock mode;
* gestione output AI non valido;
* test significativi;
* polish UX;
* documentazione.

Non fare commit automaticamente.

Quando secondo te abbiamo raggiunto una milestone:

1. dimmelo;
2. spiega brevemente perché vale un commit;
3. proponi un messaggio di commit chiaro;
4. aspetta la mia conferma.

La Git history deve seguire l'avanzamento reale del progetto.

Non dobbiamo sviluppare tutto altrove e poi costruire artificialmente una storia Git perfetta.

Messaggi tipo:

"fix"
"stuff"
"final"
"final2"

non vanno bene.

Preferiamo messaggi che raccontano cosa è cambiato.

## 8. No overengineering

Non aggiungere feature solo per impressionare.

Salvo che emerga un motivo reale dal problema, evita:

* database;
* authentication;
* account utente;
* microservizi;
* Kafka;
* queue;
* caching;
* Redux;
* state management complesso;
* dependency injection elaborata;
* molte interfacce inutili;
* design pattern forzati;
* infrastruttura non richiesta;
* astrazioni speculative.

Una soluzione da cinque ore deve sembrare una buona soluzione da cinque ore.

Non una piattaforma enterprise compressa in cinque ore.

## 9. AI come input non affidabile

Trattiamo l'output del modello AI come input esterno non affidabile.

Dobbiamo ragionare insieme su:

* struttura dell'output;
* parsing;
* validazione;
* output malformato;
* output semanticamente insensato;
* errori del provider;
* comportamento mostrato all'utente.

La UI non deve conoscere il provider AI utilizzato.

Le API key non devono mai arrivare al frontend né essere committate.

La mock mode è un requisito di prima classe, non qualcosa da aggiungere alla fine.

## 10. Feedback precedente Wallapop

Nel precedente colloquio Engineering Wallapop ha valutato molto positivamente:

* AI literacy;
* comprensione di temperature, guardrails e model mechanics;
* risk profiling;
* approccio user-centric;
* stakeholder empathy.

Mi hanno invece consigliato di migliorare:

* concisione;
* capacità di tradurre idee tecniche complesse in spiegazioni semplici.

Durante il progetto aiutami quindi a spiegare le decisioni principalmente come:

decisione
→ ragione
→ trade-off

Evita spiegazioni inutilmente lunghe.

## 11. Obiettivo del progetto

Non voglio che il reviewer pensi:

"Ha usato molte tecnologie."

Voglio che pensi:

"Ha capito il problema."

"Ha pensato prima all'utente."

"Ha fatto scelte proporzionate allo scope."

"Sa cosa ha deciso di non costruire."

"Il codice è semplice da leggere."

"Il design è facile da modificare."

"I test proteggono i comportamenti importanti."

"Sa utilizzare l'AI criticamente."

"Comprende completamente ciò che ha consegnato."

"Potrebbe aggiungere una piccola feature live senza distruggere il progetto."

## Ora iniziamo

Non scrivere ancora codice.

Non scegliere ancora automaticamente lo stack.

Non creare file o architettura.

Partiamo dal primo passo reale del progetto.

Per ora fai soltanto questo:

1. leggi attentamente il task;
2. identifica esclusivamente i requisiti espliciti;
3. partendo da questi, ragioniamo insieme sull'esperienza finale ideale del venditore;
4. individua il flusso utente minimo;
5. separa MUST e possibili NICE TO HAVE, senza implementare questi ultimi;
6. individua i principali failure case che influenzano realmente l'utente;
7. identifica le primissime decisioni che dobbiamo prendere insieme;
8. scegli quale deve essere la prima decisione da discutere.

Non implementare nulla.

Non progettare ancora tutta l'architettura.

Fermati dopo questa analisi e aspetta la mia risposta.
