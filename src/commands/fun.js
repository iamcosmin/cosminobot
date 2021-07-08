import { isSuperGroup, repliedMessageExists } from "../functions";
import ytdl from "ytdl-core";
import fs from 'fs';
export function fun(bot) {
    bot.command('say', ctx => {
        isSuperGroup(ctx, () => {
            repliedMessageExists(ctx, () => {
                const arrayOfCommand = ctx.update.message.text.split(' ');
                const result = arrayOfCommand.slice(1).join(' ');
                if (result !== undefined) {
                    ctx.deleteMessage(ctx.message.message_id);
                    ctx.reply(result, {
                        "reply_to_message_id": ctx.message.reply_to_message.message_id,
                    });
                }
                else {
                    ctx.reply('Nu am observat niciun argument valid scris in comanda ta. Incearca din nou.');
                }
            });
        });
    });
    bot.command('outme', ctx => {
        isSuperGroup(ctx, async () => {
            const member = await ctx.getChatMember(ctx.from.id);
            if (member.status === "administrator" || member.status === "creator") {
                ctx.reply('Doar nu crezi ca pot da afara un admin...');
            }
            else {
                ctx.reply('Surpriza! Vei fi dat afara in 3 secunde.\nSa te intorci cand oi zice eu!');
                setTimeout(() => {
                    ctx.kickChatMember(ctx.from.id);
                }, 3000);
            }
        });
    });
    bot.command('muteme', ctx => {
        isSuperGroup(ctx, async () => {
            const member = await ctx.getChatMember(ctx.from.id);
            if (member.status === "administrator" || member.status === "creator") {
                ctx.reply('Doar nu crezi ca pot amuti un admin...');
            }
            else {
                ctx.reply('Surpriza! In 3 secunde nu vei mai putea vorbi.\nSa vorbesti cand oi zice eu!');
                setTimeout(() => {
                    ctx.restrictChatMember(ctx.from.id, {
                        "permissions": {
                            "can_send_messages": false,
                            "can_send_media_messages": false,
                            "can_send_other_messages": false,
                            "can_send_polls": false,
                            "can_add_web_page_previews": false,
                            "can_invite_users": false,
                        },
                    });
                }, 3000);
            }
        });
    });
    bot.command('dl', (ctx) => {
        const parameters = ctx.update.message.text.split(' ')[1];
        if (parameters !== undefined) {
            ytdl(parameters).pipe(fs.createWriteStream('video.mp4'));
            ctx.replyWithChatAction("upload_video");
            ctx.replyWithVideo({
                source: fs.createReadStream('video.mp4'),
            });
        }
        else {
            ctx.reply('Ataseaza un link valid catre un videoclip de pe YouTube.');
        }
    });
    //? [ /poll => Nume sondaj => ['Optiunea 1', 'Optiunea 2'] => true ]
    bot.command('poll', ctx => {
        isSuperGroup(ctx, () => {
            const args = ctx.message.text.split(' => ');
            ctx.replyWithPoll(args[1], Array.from(args[2]), {
                "is_anonymous": (args[3] === 'true')
            });
        });
    });
    //? [ /flag ]
    // Raspunde la un mesaj pentru a-l raporta administratorilor
    bot.command('flag', ctx => {
        isSuperGroup(ctx, () => {
            repliedMessageExists(ctx, () => {
                const whoReported = ctx.message.from;
                bot.telegram.sendMessage(442675953, 'Atentie! ' + whoReported.first_name + ' a cerut ajutorul in grup.\n' + 'https://t.me/extrapsc/' + ctx.message.reply_to_message.message_id);
                bot.telegram.forwardMessage(442675953, ctx.chat.id, ctx.message.reply_to_message.message_id);
                ctx.deleteMessage(ctx.message.message_id);
            });
        });
    });
}
//# sourceMappingURL=fun.js.map