import { Strings } from "./strings";
//! Functions
export function parseParameter(ctx) {
    const parameter = ctx.update.message.text.split(' ')[1];
    return parameter;
}
export function isSuperGroup(ctx, result) {
    if (ctx.chat.type === "supergroup") {
        result();
    }
    else {
        ctx.reply(Strings.supergroupRequired);
    }
}
export function administrative(ctx, member, replied, result) {
    if (ctx.chat.type === "supergroup") {
        if (member.status === 'creator' || member.status === 'administrator') {
            if (ctx.message.reply_to_message !== undefined) {
                if (!(replied.status === 'creator' || member.status === 'administrator')) {
                    result();
                }
                else {
                    ctx.reply(Strings.adminPrivilege);
                }
            }
            else {
                ctx.reply(Strings.noRepliedMessage);
            }
        }
        else {
            ctx.reply(Strings.noPermission);
        }
    }
    else {
        ctx.reply(Strings.supergroupRequired);
    }
}
export function isAdmin(ctx, member, result) {
    if (member.status === 'creator' || member.status === 'administrator') {
        result();
    }
    else {
        ctx.reply(Strings.noPermission);
    }
}
export function isNotAdmin(ctx, member, result) {
    if (!(member.status === 'creator' || member.status === 'administrator')) {
        result();
    }
    else {
        ctx.reply(Strings.adminPrivilege);
    }
}
export function repliedMessageExists(ctx, result) {
    if (ctx.message.reply_to_message !== undefined) {
        result();
    }
    else {
        ctx.reply(Strings.noRepliedMessage);
    }
}
export function returnTimedParameter(command) {
    const arrayOfCommand = command.split(" ");
    const timeParameter = arrayOfCommand[1];
    if (timeParameter !== undefined) {
        const isMinuted = timeParameter.endsWith('m');
        const isHoured = timeParameter.endsWith('h');
        const onlyIntegerOfTimeParameter = parseInt(timeParameter.substring(0, timeParameter.length - 1));
        if (isMinuted) {
            const minuteTimeInt = (parseInt(new Date().getTime().toFixed(0)) / 1000 + (onlyIntegerOfTimeParameter * 60)).toString();
            const minuteTimeFrame = onlyIntegerOfTimeParameter + (onlyIntegerOfTimeParameter === 1 ? ' minut' : ' minute');
            return [minuteTimeInt, minuteTimeFrame];
        }
        else if (isHoured) {
            const hourTimeInt = (parseInt(new Date().getTime().toFixed(0)) / 1000 + (onlyIntegerOfTimeParameter * 3600)).toString();
            const hourTimeFrame = onlyIntegerOfTimeParameter + (onlyIntegerOfTimeParameter === 1 ? ' oră' : ' ore');
            return [hourTimeInt, hourTimeFrame];
        }
        else {
            return undefined;
        }
    }
    else {
        return undefined;
    }
}
//# sourceMappingURL=functions.js.map