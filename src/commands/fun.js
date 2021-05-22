import { isSuperGroup, repliedMessageExists } from "../functions";
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
}
//# sourceMappingURL=fun.js.map