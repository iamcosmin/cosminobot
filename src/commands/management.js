import { Strings } from "../strings";
import { AdminPermission, isAllowed, isNotAdmin, isSuperGroup, repliedMessageExists, returnTimedParameter } from '../functions';
export default function management(bot) {
    //? [ /mute ]
    bot.command('mute', (ctx) => {
        isSuperGroup(ctx, async () => {
            const member = await ctx.getChatMember(ctx.from.id);
            if (isAllowed(member, AdminPermission.BAN_USERS)) {
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
            }
            else {
                ctx.reply(Strings.cannotRestrict);
            }
        });
    });
    //? [ /promote ]
    bot.command('promote', async (ctx) => {
        isSuperGroup(ctx, async () => {
            const member = await ctx.getChatMember(ctx.from.id);
            if (isAllowed(member, AdminPermission.ADD_NEW_ADMINS)) {
                repliedMessageExists(ctx, async () => {
                    const replied = await ctx.getChatMember(ctx.message.reply_to_message.from.id);
                    isNotAdmin(ctx, replied, () => {
                        const parseCommand = ctx.message.text.split(' ')[1];
                        if (parseCommand === undefined) {
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
                        }
                        else {
                            ctx.promoteChatMember(ctx.message.reply_to_message.from.id, {
                                "can_change_info": false,
                                "can_delete_messages": true,
                                "can_restrict_members": true,
                                "can_invite_users": true,
                                "can_pin_messages": true,
                                "can_manage_voice_chats": true,
                                "can_promote_members": false,
                            });
                            ctx.setChatAdministratorCustomTitle(ctx.message.reply_to_message.from.id, parseCommand);
                            ctx.reply(ctx.message.reply_to_message.from.first_name + ' a devenit admin cu numele ' + parseCommand);
                        }
                    });
                });
            }
            else {
                ctx.reply(Strings.cannotPromote);
            }
        });
    });
    //? [ /demote ]
    bot.command('demote', (ctx) => {
        isSuperGroup(ctx, async () => {
            const member = await ctx.getChatMember(ctx.from.id);
            if (isAllowed(member, AdminPermission.ADD_NEW_ADMINS)) {
                repliedMessageExists(ctx, async () => {
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
            }
            else {
                ctx.reply(Strings.cannotPromote);
            }
        });
    });
    //? [ /prinde ]
    bot.command('prinde', (ctx) => {
        isSuperGroup(ctx, () => {
            repliedMessageExists(ctx, async () => {
                const member = await ctx.getChatMember(ctx.from.id);
                if (isAllowed(member, AdminPermission.PIN_MESSAGES)) {
                    ctx.pinChatMessage(ctx.message.reply_to_message.message_id);
                }
                else {
                    ctx.reply(Strings.cannotPin);
                }
            });
        });
    });
    //? [ /desprinde ]
    bot.command('desprinde', (ctx) => {
        isSuperGroup(ctx, () => {
            repliedMessageExists(ctx, async () => {
                const member = await ctx.getChatMember(ctx.from.id);
                if (isAllowed(member, AdminPermission.PIN_MESSAGES)) {
                    ctx.unpinChatMessage(ctx.message.reply_to_message.message_id);
                }
                else {
                    ctx.reply(Strings.cannotPin);
                }
            });
        });
    });
    //? [ /com {param} ]
    bot.command('e_1', (ctx) => {
        isSuperGroup(ctx, async () => {
            const member = await ctx.getChatMember(ctx.from.id);
            if (isAllowed(member, AdminPermission.BAN_USERS)) {
                const parameter = ctx.update.message.text.split(' ')[1];
                if (parameter === "off") {
                    ctx.setChatPermissions({
                        "can_send_messages": false
                    });
                    ctx.reply(Strings.comDisabled);
                }
                else if (parameter === "on") {
                    ctx.setChatPermissions({
                        "can_send_messages": true,
                        "can_send_media_messages": true,
                        "can_send_other_messages": true,
                        "can_send_polls": true,
                        "can_add_web_page_previews": true,
                        "can_invite_users": true
                    });
                    ctx.reply(Strings.comEnabled);
                }
                else {
                    ctx.reply('Niciun parametru valid nu a fost specificat.');
                }
            }
            else {
                ctx.reply(Strings.cannotRestrict);
            }
        });
    });
    //? [ /del ]
    bot.command('del', (ctx) => {
        isSuperGroup(ctx, async () => {
            const member = await ctx.getChatMember(ctx.from.id);
            repliedMessageExists(ctx, () => {
                if (isAllowed(member, AdminPermission.DELETE_MESSAGES) || ctx.message.reply_to_message.from.id === ctx.from.id) {
                    ctx.deleteMessage(ctx.update.message.message_id);
                    ctx.deleteMessage(ctx.message.reply_to_message.message_id);
                }
                else {
                    ctx.reply(Strings.cannotDeleteOthersMessages);
                }
            });
        });
    });
    //? [ /lift ]
    bot.command('lift', ctx => {
        isSuperGroup(ctx, async () => {
            const member = await ctx.getChatMember(ctx.from.id);
            if (isAllowed(member, AdminPermission.BAN_USERS)) {
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
            }
            else {
                ctx.reply(Strings.cannotRestrict);
            }
        });
    });
    //? [ /out [ 1m, 2h ] ]
    bot.command('out', (ctx) => {
        isSuperGroup(ctx, async () => {
            const member = await ctx.getChatMember(ctx.from.id);
            if (isAllowed(member, AdminPermission.BAN_USERS)) {
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
            }
            else {
                ctx.reply(Strings.cannotRestrict);
            }
        });
    });
    //? [ /titlu "params" ]
    // Note: group name cannot have "" as it may interfere with the command parsing process.
    bot.command('titlu', (ctx) => {
        isSuperGroup(ctx, async () => {
            const member = await ctx.getChatMember(ctx.from.id);
            if (isAllowed(member, AdminPermission.CHANGE_GROUP_INFO)) {
                const newName = ctx.message.text.split("\"")[1];
                ctx.setChatTitle(newName);
                ctx.reply('Numele grupului a fost schimbat în ' + newName + '.');
            }
            else {
                ctx.reply(Strings.cannotEditGroupInfo);
            }
        });
    });
    // [ /aname "Name"]
    bot.command('aname', ctx => {
        isSuperGroup(ctx, async () => {
            const member = await ctx.getChatMember(ctx.from.id);
            if (isAllowed(member, AdminPermission.ADD_NEW_ADMINS)) {
                const parsed = ctx.message.text.split(' ')[1];
                if (member.status === 'administrator') {
                    if (parsed === undefined) {
                        ctx.reply('Nu ai dat niciun argument valid pentru a redenumi administratorul.');
                    }
                    else {
                        ctx.setChatAdministratorCustomTitle(member.user.id, parsed);
                        ctx.reply(member.user.first_name + 'are acum numele de administrator \"' + parsed + '\".');
                    }
                }
                else {
                    ctx.reply('Aceasta actiune poate fi efectuata doar pe un administrator existent. Daca doresti sa promovezi pe cineva in rolul de administrator, foloseste comanda /promote.');
                }
            }
            else {
                ctx.reply(Strings.adminPrivilege);
            }
        });
    });
}
//# sourceMappingURL=management.js.map