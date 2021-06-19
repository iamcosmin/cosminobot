export default function automate(bot) {
    bot.on('new_chat_members', ctx => {
        ctx.reply('Bine ai venit, ' + ctx.from.first_name + '!' + '\n' + 'Conformează-te cu principiile grupului pentru a sta aici cât mai mult!');
        ctx.deleteMessage(ctx.message.message_id);
    });
    bot.on('poll', ctx => {
        ctx.pinChatMessage(ctx.message.message_id);
    });
    // Auto delete action#
    bot.on('left_chat_member', ctx => ctx.deleteMessage(ctx.message.message_id));
    bot.on('new_chat_title', ctx => ctx.deleteMessage(ctx.message.message_id));
    bot.on('new_chat_photo', ctx => ctx.deleteMessage(ctx.message.message_id));
    bot.on('pinned_message', ctx => ctx.deleteMessage(ctx.message.message_id));
    bot.on('voice_chat_started', ctx => ctx.deleteMessage(ctx.message.message_id));
    bot.on('voice_chat_scheduled', ctx => ctx.deleteMessage(ctx.message.message_id));
    bot.on('voice_chat_ended', ctx => ctx.deleteMessage(ctx.message.message_id));
}
//# sourceMappingURL=automatisation.js.map