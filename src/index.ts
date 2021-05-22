import { Context, Telegraf } from 'telegraf';
import { ChatMember } from 'typegram';
const keepAlive = require('./server');
keepAlive();

//! Strings
const supergroupRequired = "Această comandă poate fi executată doar într-un supergrup."
const noPermission = "Permisiuni insuficiente."
const noRepliedMessage = "Nu ai răspuns la niciun mesaj."
const adminPrivilege = "Această comandă nu poate fi executată pe alți administratori."
const cmds = "Iată o listă de comenzi pe care o poți folosi.\n\nNotații: (a): doar pentru admini, [a, b]: argumente care pot fi folosite în comandă, any: poate fi folosita si fara argument, (r): necesita răspuns la un mesaj..\n\n\/roll [dart, basket, football, bowling, slot, any] : trimite un emoji stabilit \n\/mut [any] (a, r) : Dezactiveaza permisiunea de a vorbi a unui membru.\n\/unmut [any] (a, r) : Reactiveaza permisiunea de a vorbi a unui membru.\n\/promote [any] (a, r) : Promoveaza un membru la functia de administrator.\n\/demote [any] (a, r) : Retrogradeaza un membru de la functia de administrator.\n\/prinde [any], (a, r) : Prinde un mesaj.\n\/desprinde [any], (a, r) : Desprinde un mesaj.\n\/com [true, false], (a, r): Activeaza sau dezactiveaza comunicarea integrala in grup.\b\/del [any], (a || o, r): Sterge un mesaj. Poate fi executata de administratori pentru a sterge alte mesaje sau de membri pentru a sterge propriile lor mesaje.";

const bot = new Telegraf(process.env.TOKEN!);

//! Functions
function withChatAction(ctx: Context, result: () => void) {
    ctx.replyWithChatAction("typing");
    setTimeout(() => {
        result()
    }, 250)
}
function isSuperGroup(ctx: Context, result: () => void) {
    if (ctx.chat!.type === "supergroup") {
        result()
    } else {
        withChatAction(ctx, () => {
            ctx.reply(supergroupRequired);
        })
    }
}
function isAdmin(ctx: Context, member: ChatMember, result: () => void) {
    if (member.status === 'creator' || member.status === 'administrator') {
        result()
    } else {
        withChatAction(ctx, () => {
            ctx.reply(noPermission)
        })
    }
}
function isNotAdmin(ctx: Context, member: ChatMember, result: () => void) {
    if (!(member.status === 'creator' || member.status === 'administrator')) {
        result()
    } else {
        withChatAction(ctx, () => {
            ctx.reply(adminPrivilege)
        })
    }
}
function repliedMessageExists(ctx: any, result: () => void) {
    if (ctx.message.reply_to_message !== undefined) {
        result()
    } else {
        withChatAction(ctx, () => {
            ctx.reply(noRepliedMessage)
        })
    }
}
function returnTimedParameter(command: String) {
    const arrayOfCommand = command.split(" ")
    const timeParameter = arrayOfCommand[1]
    if (timeParameter !== undefined) {
        const isMinuted = timeParameter.endsWith('m')
        const isHoured = timeParameter.endsWith('h')
        const onlyIntegerOfTimeParameter: number = parseInt(timeParameter.substring(0, timeParameter.length - 1))
        if (isMinuted) {
            const minuteTimeInt: string = (parseInt(new Date().getTime().toFixed(0)) / 1000 + (onlyIntegerOfTimeParameter * 60)).toString();
            const minuteTimeFrame: string = onlyIntegerOfTimeParameter + (onlyIntegerOfTimeParameter === 1 ? ' minut' : ' minute')
            return [minuteTimeInt, minuteTimeFrame]
        } else if (isHoured) {
            const hourTimeInt: string = (parseInt(new Date().getTime().toFixed(0)) / 1000 + (onlyIntegerOfTimeParameter * 3600)).toString();
            const hourTimeFrame: string = onlyIntegerOfTimeParameter + (onlyIntegerOfTimeParameter === 1 ? ' oră' : ' ore')
            return [hourTimeInt, hourTimeFrame]
        } else {
            return undefined;
        }
    } else {
        return undefined;
    }
}
//! Commands
//? [ /start ]
bot.start((ctx) => {
    withChatAction(ctx, () => {
        ctx.reply('Bună, ' + ctx.from.first_name + '!. \n Poți vedea ce comenzi sunt disponibile în grup utilizând comanda /cmds.');
    })
});

//? [ /cmds ]
bot.command('cmds', (ctx) => {
    withChatAction(ctx, () => {
        ctx.reply(cmds);
    })
})

//? [ /roll ]
bot.command('roll', (ctx) => {
    const parameter = ctx.update.message.text.split(' ')[1];
    if (parameter === "dart") {
        withChatAction(ctx, () => {
            ctx.replyWithDice({
                "emoji": "🎯"
            })
        })
    } else if (parameter === "basket") {
        withChatAction(ctx, () => {
            ctx.replyWithDice({
                "emoji": "🏀"
            })
        })
    } else if (parameter === "football") {
        withChatAction(ctx, () => {
            ctx.replyWithDice({
                "emoji": "⚽"
            })
        })
    } else if (parameter === "bowling") {
        withChatAction(ctx, () => {
            ctx.replyWithDice({
                "emoji": "🎳"
            })
        })
    } else if (parameter === "slot") {
        withChatAction(ctx, () => {
            ctx.replyWithDice({
                "emoji": "🎰"
            })
        })
    } else {
        withChatAction(ctx, () => {
            ctx.replyWithDice()
        })
    }
})


//? [ /mucles ]
bot.command('mucles', (ctx) => {
    isSuperGroup(ctx, async () => {
        const member = await ctx.getChatMember(ctx.from.id);
        isAdmin(ctx, member, async () => {
            repliedMessageExists(ctx, async () => {
                const replied = await ctx.getChatMember(ctx.message.reply_to_message!.from!.id)
                isNotAdmin(ctx, replied, () => {
                    const parameters = ctx.update.message.text
                    const time = returnTimedParameter(parameters)
                    if (time !== undefined) {
                        const [timeInt, timeFrame] = time;
                        withChatAction(ctx, () => {
                            ctx.restrictChatMember(
                                ctx.message.reply_to_message!.from!.id,
                                {
                                    "permissions": {
                                        "can_send_messages": false,
                                        "can_send_media_messages": false,
                                        "can_send_other_messages": false,
                                        "can_send_polls": false,
                                        "can_add_web_page_previews": false,
                                        "can_invite_users": false,
                                    },
                                    "until_date": parseInt(timeInt),
                                },
                            )
                            ctx.reply(replied.user.first_name + ' nu mai poate vorbi pentru ' + timeFrame + '.');
                        })
                    } else {
                        ctx.restrictChatMember(
                            ctx.message.reply_to_message!.from!.id,
                            {
                                "permissions": {
                                    "can_send_messages": false,
                                    "can_send_media_messages": false,
                                    "can_send_other_messages": false,
                                    "can_send_polls": false,
                                    "can_add_web_page_previews": false,
                                    "can_invite_users": false,
                                },
                            },
                        )
                        ctx.reply(replied.user.first_name + ' nu mai poate vorbi.');
                    }
                })
            })
        })
    })
})

//? [ /promote ]
bot.command('promote', async (ctx) => {
    isSuperGroup(ctx, async () => {
        const member = await ctx.getChatMember(ctx.from.id)
        isAdmin(ctx, member, () => {
            repliedMessageExists(ctx, async () => {
                const replied = await ctx.getChatMember(ctx.message.reply_to_message!.from!.id)
                isNotAdmin(ctx, replied, () => {
                    withChatAction(ctx, () => {
                        ctx.promoteChatMember(
                            ctx.message.reply_to_message!.from!.id,
                            {
                                "can_change_info": false,
                                "can_delete_messages": true,
                                "can_restrict_members": true,
                                "can_invite_users": true,
                                "can_pin_messages": true,
                                "can_manage_voice_chats": true,
                                "can_promote_members": false,
                            },
                        );
                        ctx.reply(ctx.message.reply_to_message!.from!.first_name + ' a devenit admin.')
                    })
                })
            })
        })
    })
})

//? [ /demote ]
bot.command('demote', (ctx) => {
    isSuperGroup(ctx, async () => {
        const member = await ctx.getChatMember(ctx.from.id)
        isAdmin(ctx, member, () => {
            repliedMessageExists(ctx, async () => {
                const replied = await ctx.getChatMember(ctx.message.reply_to_message!.from!.id)
                isNotAdmin(ctx, replied, () => {
                    withChatAction(ctx, () => {
                        ctx.promoteChatMember(
                            ctx.message.reply_to_message!.from!.id,
                            {
                                "can_change_info": false,
                                "can_delete_messages": false,
                                "can_restrict_members": false,
                                "can_invite_users": false,
                                "can_pin_messages": false,
                                "can_manage_voice_chats": false,
                                "can_promote_members": false,
                            },
                        );
                        ctx.reply(ctx.message.reply_to_message!.from!.first_name + ' nu mai este admin.')
                    })
                })
            })
        })
    })
})

//? [ /prinde ]
bot.command('prinde', (ctx) => {
    isSuperGroup(ctx, () => {
        repliedMessageExists(ctx, async () => {
            const member = await ctx.getChatMember(ctx.from.id)
            isAdmin(ctx, member, () => {
                ctx.pinChatMessage(ctx.message.reply_to_message!.message_id)
            })
        })
    })
})

//? [ /desprinde ]
bot.command('desprinde', (ctx) => {
    isSuperGroup(ctx, () => {
        repliedMessageExists(ctx, async () => {
            const member = await ctx.getChatMember(ctx.from.id)
            isAdmin(ctx, member, () => {
                ctx.unpinChatMessage(ctx.message.reply_to_message!.message_id)
            })
        })
    })
})

//? [ /com {param} ]
bot.command('com', (ctx) => {
    isSuperGroup(ctx, async () => {
        const member = await ctx.getChatMember(ctx.from.id)
        isAdmin(ctx, member, () => {
            withChatAction(ctx, () => {
                const parameter = ctx.update.message.text.split(' ')[1]
                if (parameter === "false") {
                    ctx.setChatPermissions({
                        "can_send_messages": false
                    });
                    ctx.reply('Abilitatea de a comunica a fost dezactivată global.')
                } else if (parameter === "true") {
                    ctx.setChatPermissions({
                        "can_send_messages": true,
                        "can_send_media_messages": true,
                        "can_send_other_messages": true,
                        "can_send_polls": true,
                        "can_add_web_page_previews": true,
                        "can_invite_users": true
                    });
                    ctx.reply('Abilitatea de a comunica a fost activată.')
                } else {
                    ctx.reply('Niciun parametru valid nu a fost specificat.')
                }
            })
        })
    })
})


//? [ /del ]
bot.command('del', (ctx) => {
    isSuperGroup(ctx, async () => {
        const member = await ctx.getChatMember(ctx.from.id)
        repliedMessageExists(ctx, () => {
            if ((member.status === 'creator' || member.status === 'administrator') || ctx.message.reply_to_message!.from!.id === ctx.from.id) {
                ctx.deleteMessage(ctx.update.message.message_id);
                ctx.deleteMessage(ctx.message.reply_to_message!.message_id);
            } else {
                withChatAction(ctx, () => {
                    ctx.reply(noPermission)
                })
            }
        })
    })
})

//? [ /out [ 1m, 2h ] ]
bot.command('out', (ctx) => {
    isSuperGroup(ctx, async () => {
        const member = await ctx.getChatMember(ctx.from.id)
        isAdmin(ctx, member, () => {
            repliedMessageExists(ctx, async () => {
                const replied = await ctx.getChatMember(ctx.message.reply_to_message!.from!.id)
                isNotAdmin(ctx, replied, () => {
                    const time = returnTimedParameter(ctx.update.message.text)
                    if (time !== undefined) {
                        const [timeInt, timeFrame] = time;
                        withChatAction(ctx, () => {
                            ctx.kickChatMember(ctx.message.reply_to_message!.from!.id, parseInt(timeInt))
                            ctx.reply(replied.user.first_name + ' a fost dat afară din grup pentru ' + timeFrame + '.')
                        })
                    } else {
                        withChatAction(ctx, () => {
                            ctx.kickChatMember(ctx.message.reply_to_message!.from!.id)
                            ctx.reply(replied.user.first_name + ' a fost dat afară din grup permanent.')
                        })
                    }
                })
            })
        })
    })
})

//? [ /lift ]
bot.command('lift', ctx => {
    isSuperGroup(ctx, async () => {
        const member = await ctx.getChatMember(ctx.from.id);
        isAdmin(ctx, member, () => {
            repliedMessageExists(ctx, async () => {
                const replied = await ctx.getChatMember(ctx.message.reply_to_message!.from!.id)
                isNotAdmin(ctx, replied, () => {
                    withChatAction(ctx, () => {
                        ctx.restrictChatMember(
                            ctx.message.reply_to_message!.from!.id,
                            {
                                "permissions": {
                                    "can_send_messages": true,
                                    "can_send_media_messages": true,
                                    "can_send_other_messages": true,
                                    "can_send_polls": true,
                                    "can_add_web_page_previews": true,
                                    "can_invite_users": true,
                                },
                            },
                        ),
                            ctx.unbanChatMember(ctx.message.reply_to_message!.from!.id, { "only_if_banned": true })
                        ctx.reply('Drum liber! ' + replied.user.first_name + ' are toate restricțiile ridicate.');
                    })
                })
            })
        })
    })
})

bot.launch();