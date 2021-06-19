import { Telegraf } from 'telegraf';
import { fun } from './commands/fun';
import management from './commands/management';
import { parseParameter } from './functions';
import keepAlive from './server';
keepAlive();
const bot = new Telegraf(process.env.TOKEN);
//! Commands
/// Types of commands include
/// management - managing group and chat permisions
/// interactive - fun commands
//////////////////////////////////////////////////////////
// Packets
//////////////////////////////////////////////////////////
management(bot);
fun(bot);
//////////////////////////////////////////////////////////
// Regular
//////////////////////////////////////////////////////////
//? [ /start ]
bot.start((ctx) => {
    ctx.reply('Salut! Pentru a vedea ce abilitati am, poti folosi comanda /help!');
});
bot.on('new_chat_members', ctx => {
    ctx.reply('Bine ai venit, ' + ctx.from.first_name + '!' + '\n' + 'Conformează-te cu principiile grupului pentru a sta aici cât mai mult!');
    ctx.deleteMessage(ctx.message.message_id);
});
//? [ /help ]
bot.command('help', (ctx) => {
    const parameter = parseParameter(ctx);
    if (parameter === "management") {
        ctx.reply('Iata cateva comezi care te vor ajuta intr-un supergrup:\n\
        \nDoar pentru administratori:\n\
        \n /mute [timp] - Utilizatorul la care nu raspunzi nu va putea vorbi.\
        \n /out [timp] - Utilizatorul la care raspunzi va fi dat afara din grup.\
        \n /lift - Utilizatorul la care raspunzi va avea toate restrictiile ridicate.\
        \n /promote - Utilizatorul la care raspunzi va primi drepturi de administrator.\
        \n /demote - Utilizatorul la care raspunzi nu va mai avea drepturi de administrator.\
        \n /prinde - Raspunde la un mesaj pentru a-l prinde in partea de sus a ecranului.\
        \n /desprinde - Raspunde la un mesaj pentru a-l desprinde din partea de sus a ecranului.\
        \n /com [true sau false] - Activeaza sau dezactiveaza comunicarea integrala in grup.\n\
        \nPentru orice utilizator:\n\
        \n /del - Sterge un mesaj la care raspunzi. Poti sterge doar mesajele tale daca nu esti administrator.');
    }
    else if (parameter === "fun") {
        ctx.reply('Iata cateva comenzi pentru distractie!\n\
        \n /roll [dart, basket, football, bowling, slot] - Trimite un mini-joc specific acestor parametri.\
        \n /say [text] - Raspunde la un mesaj cu aceasta comanda iar robotul va raspunde la acelasi mesaj cu textul scris. Robotul va sterge mesajul care initializeaza comanda, dar tine minte ca acest mesaj inca poate fi vazut de administratori in logs.\
        \n /muteme - Incearca si o sa vezi ce se intampla!\
        \n /outme - Incearca si o sa vezi ce se intampla!');
    }
    else {
        ctx.reply('Bine ai venit în centrul de ajutor!' +
            "\nPentru a primi ajutor cu privire la un domeniu, te rog scrie comanda /help, urmata de unul dintre urmatorii parametri:" +
            "\n\n management: Gestionarea in cadrul unui supergrup." +
            "\n fun: Comenzi distractive. ");
    }
});
//? [ /roll ]
bot.command('roll', async (ctx) => {
    const parameter = parseParameter(ctx);
    if (parameter === "dart") {
        ctx.replyWithDice({
            "emoji": "🎯"
        });
    }
    else if (parameter === "basket") {
        ctx.replyWithDice({
            "emoji": "🏀"
        });
    }
    else if (parameter === "football") {
        ctx.replyWithDice({
            "emoji": "⚽"
        });
    }
    else if (parameter === "bowling") {
        ctx.replyWithDice({
            "emoji": "🎳"
        });
    }
    else if (parameter === "slot") {
        ctx.replyWithDice({
            "emoji": "🎰"
        });
    }
    else {
        ctx.replyWithDice();
    }
});
bot.catch((error, ctx) => {
    ctx.reply('Eroare!');
    const err = error;
    ctx.reply(err);
});
bot.launch();
//# sourceMappingURL=index.js.map