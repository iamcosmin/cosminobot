import express from 'express';
const server = express();
server.all('/', (_req, res) => {
    res.send('Robotul ruleaza!');
});
function keepAlive() {
    server.listen(3000, () => {
        console.log('Serverul este pregatit de interactiunea cu utilizatorul.');
    });
}
export default keepAlive;
// Iată o listă de comenzi pe care o poți folosi.
// Notații: (a): doar pentru admini, [a, b]: argumente care pot fi folosite în comandă, any: poate fi folosita si fara argument, (r): necesita răspuns la un mesaj..
// /roll [dart, basket, football, bowling, slot, any] : trimite un emoji stabilit 
// /mut [any] (a, r) : Dezactiveaza permisiunea de a vorbi a unui membru.
// /unmut [any] (a, r) : Reactiveaza permisiunea de a vorbi a unui membru.
// /promote [any] (a, r) : Promoveaza un membru la functia de administrator.
// /demote [any] (a, r) : Retrogradeaza un membru de la functia de administrator.
// /prinde [any], (a, r) : Prinde un mesaj.
// /desprinde [any], (a, r) : Desprinde un mesaj.
// /com [true, false], (a, r): Activeaza sau dezactiveaza comunicarea integrala in grup.
//# sourceMappingURL=server.js.map