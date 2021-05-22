import { isSuperGroup, repliedMessageExists } from "../functions";
export function fun(bot) {
    bot.command('say', ctx => {
        isSuperGroup(ctx, () => {
            repliedMessageExists(ctx, () => {
                const arrayOfCommand = ctx.update.message.text.split(' ');
                if (arrayOfCommand !== undefined) {
                    const result = arrayOfCommand.slice(1).join(' ');
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
}
//# sourceMappingURL=fun.js.map