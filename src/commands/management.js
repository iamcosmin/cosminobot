import { Strings } from "../strings";
import { isAdmin, isNotAdmin, isSuperGroup, repliedMessageExists, returnTimedParameter } from '../functions';
export default function management(bot) {
    //? [ /mute ]
    bot.command('mute', (ctx) => {
        isSuperGroup(ctx, async () => {
            const member = await ctx.getChatMember(ctx.from.id);
            isAdmin(ctx, member, async () => {
                repliedMessageExists(ctx, async () => {
                    const replied = await ctx.getChatMember(ctx.message.reply_to_message.from.id);
                    isNotAdmin(ctx, replied, () => {
                        const parameters = ctx.update.message.text;
                        const time = returnTimedParameter(parameters);
                        if (time !== undefined) {
                            const [timeInt, timeFrame] = time;
                            ctx.restrictChatMember(ctx.message.reply_to_message.from.id, {
                                "permissions": {
                                    "can_send_messages": false,
                                    "can_send_media_messages": false,
                                    "can_send_other_messages": false,
                                    "can_send_polls": false,
                                    "can_add_web_page_previews": false,
                                    "can_invite_users": false,
                                },
                                "until_date": parseInt(timeInt),
                            });
                            ctx.reply(replied.user.first_name + ' nu mai poate vorbi pentru ' + timeFrame + '.');
                        }
                        else {
                            ctx.restrictChatMember(ctx.message.reply_to_message.from.id, {
                                "permissions": {
                                    "can_send_messages": false,
                                    "can_send_media_messages": false,
                                    "can_send_other_messages": false,
                                    "can_send_polls": false,
                                    "can_add_web_page_previews": false,
                                    "can_invite_users": false,
                                },
                            });
                            ctx.reply(replied.user.first_name + ' nu mai poate vorbi.');
                        }
                    });
                });
            });
        });
    });
    //? [ /promote ]
    bot.command('promote', async (ctx) => {
        isSuperGroup(ctx, async () => {
            const member = await ctx.getChatMember(ctx.from.id);
            isAdmin(ctx, member, () => {
                repliedMessageExists(ctx, async () => {
                    const replied = await ctx.getChatMember(ctx.message.reply_to_message.from.id);
                    isNotAdmin(ctx, replied, () => {
                        ctx.promoteChatMember(ctx.message.reply_to_message.from.id, {
                            "can_change_info": false,
                            "can_delete_messages": true,
                            "can_restrict_members": true,
                            "can_invite_users": true,
                            "can_pin_messages": true,
                            "can_manage_voice_chats": true,
                            "can_promote_members": false,
                        });
                        ctx.reply(ctx.message.reply_to_message.from.first_name + ' a devenit admin.');
                    });
                });
            });
        });
    });
    //? [ /demote ]
    bot.command('demote', (ctx) => {
        isSuperGroup(ctx, async () => {
            const member = await ctx.getChatMember(ctx.from.id);
            isAdmin(ctx, member, () => {
                repliedMessageExists(ctx, async () => {
                    const replied = await ctx.getChatMember(ctx.message.reply_to_message.from.id);
                    isNotAdmin(ctx, replied, () => {
                        ctx.promoteChatMember(ctx.message.reply_to_message.from.id, {
                            "can_change_info": false,
                            "can_delete_messages": false,
                            "can_restrict_members": false,
                            "can_invite_users": false,
                            "can_pin_messages": false,
                            "can_manage_voice_chats": false,
                            "can_promote_members": false,
                        });
                        ctx.reply(ctx.message.reply_to_message.from.first_name + ' nu mai este admin.');
                    });
                });
            });
        });
    });
    //? [ /prinde ]
    bot.command('prinde', (ctx) => {
        isSuperGroup(ctx, () => {
            repliedMessageExists(ctx, async () => {
                const member = await ctx.getChatMember(ctx.from.id);
                isAdmin(ctx, member, () => {
                    ctx.pinChatMessage(ctx.message.reply_to_message.message_id);
                });
            });
        });
    });
    //? [ /desprinde ]
    bot.command('desprinde', (ctx) => {
        isSuperGroup(ctx, () => {
            repliedMessageExists(ctx, async () => {
                const member = await ctx.getChatMember(ctx.from.id);
                isAdmin(ctx, member, () => {
                    ctx.unpinChatMessage(ctx.message.reply_to_message.message_id);
                });
            });
        });
    });
    //? [ /com {param} ]
    bot.command('com', (ctx) => {
        isSuperGroup(ctx, async () => {
            const member = await ctx.getChatMember(ctx.from.id);
            isAdmin(ctx, member, () => {
                const parameter = ctx.update.message.text.split(' ')[1];
                if (parameter === "false") {
                    ctx.setChatPermissions({
                        "can_send_messages": false
                    });
                    ctx.reply('Abilitatea de a comunica a fost dezactivată global.');
                }
                else if (parameter === "true") {
                    ctx.setChatPermissions({
                        "can_send_messages": true,
                        "can_send_media_messages": true,
                        "can_send_other_messages": true,
                        "can_send_polls": true,
                        "can_add_web_page_previews": true,
                        "can_invite_users": true
                    });
                    ctx.reply('Abilitatea de a comunica a fost activată.');
                }
                else {
                    ctx.reply('Niciun parametru valid nu a fost specificat.');
                }
            });
        });
    });
    //? [ /del ]
    bot.command('del', (ctx) => {
        isSuperGroup(ctx, async () => {
            const member = await ctx.getChatMember(ctx.from.id);
            repliedMessageExists(ctx, () => {
                if ((member.status === 'creator' || member.status === 'administrator') || ctx.message.reply_to_message.from.id === ctx.from.id) {
                    ctx.deleteMessage(ctx.update.message.message_id);
                    ctx.deleteMessage(ctx.message.reply_to_message.message_id);
                }
                else {
                    ctx.reply(Strings.noPermission);
                }
            });
        });
    });
    //? [ /lift ]
    bot.command('lift', ctx => {
        isSuperGroup(ctx, async () => {
            const member = await ctx.getChatMember(ctx.from.id);
            isAdmin(ctx, member, () => {
                repliedMessageExists(ctx, async () => {
                    const replied = await ctx.getChatMember(ctx.message.reply_to_message.from.id);
                    isNotAdmin(ctx, replied, () => {
                        ctx.restrictChatMember(ctx.message.reply_to_message.from.id, {
                            "permissions": {
                                "can_send_messages": true,
                                "can_send_media_messages": true,
                                "can_send_other_messages": true,
                                "can_send_polls": true,
                                "can_add_web_page_previews": true,
                                "can_invite_users": true,
                            },
                        }),
                            ctx.unbanChatMember(ctx.message.reply_to_message.from.id, { "only_if_banned": true });
                        ctx.reply('Drum liber! ' + replied.user.first_name + ' are toate restricțiile ridicate.');
                    });
                });
            });
        });
    });
    //? [ /out [ 1m, 2h ] ]
    bot.command('out', (ctx) => {
        isSuperGroup(ctx, async () => {
            const member = await ctx.getChatMember(ctx.from.id);
            isAdmin(ctx, member, () => {
                repliedMessageExists(ctx, async () => {
                    const replied = await ctx.getChatMember(ctx.message.reply_to_message.from.id);
                    isNotAdmin(ctx, replied, () => {
                        const time = returnTimedParameter(ctx.update.message.text);
                        if (time !== undefined) {
                            const [timeInt, timeFrame] = time;
                            ctx.kickChatMember(ctx.message.reply_to_message.from.id, parseInt(timeInt));
                            ctx.reply(replied.user.first_name + ' a fost dat afară din grup pentru ' + timeFrame + '.');
                        }
                        else {
                            ctx.kickChatMember(ctx.message.reply_to_message.from.id);
                            ctx.reply(replied.user.first_name + ' a fost dat afară din grup permanent.');
                        }
                    });
                });
            });
        });
    });
}
//# sourceMappingURL=management.js.map