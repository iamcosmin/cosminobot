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
export function isAllowed(member, expected) {
    switch (expected) {
        case AdminPermission.CHANGE_GROUP_INFO:
            return member.can_change_info === true ? true : false;
        case AdminPermission.DELETE_MESSAGES:
            return member.can_delete_messages === true ? true : false;
        case AdminPermission.BAN_USERS:
            return member.can_restrict_members === true ? true : false;
        case AdminPermission.INVITE_USERS_VIA_LINK:
            return member.can_invite_users === true ? true : false;
        case AdminPermission.PIN_MESSAGES:
            return member.can_pin_messages === true ? true : false;
        case AdminPermission.MANAGE_VOICE_CHATS:
            return member.can_manage_voice_chats === true ? true : false;
        case AdminPermission.ADD_NEW_ADMINS:
            return member.can_promote_members === true ? true : false;
    }
    return false;
}
export var AdminPermission;
(function (AdminPermission) {
    AdminPermission[AdminPermission["CHANGE_GROUP_INFO"] = 0] = "CHANGE_GROUP_INFO";
    AdminPermission[AdminPermission["DELETE_MESSAGES"] = 1] = "DELETE_MESSAGES";
    AdminPermission[AdminPermission["BAN_USERS"] = 2] = "BAN_USERS";
    AdminPermission[AdminPermission["INVITE_USERS_VIA_LINK"] = 3] = "INVITE_USERS_VIA_LINK";
    AdminPermission[AdminPermission["PIN_MESSAGES"] = 4] = "PIN_MESSAGES";
    AdminPermission[AdminPermission["MANAGE_VOICE_CHATS"] = 5] = "MANAGE_VOICE_CHATS";
    AdminPermission[AdminPermission["ADD_NEW_ADMINS"] = 6] = "ADD_NEW_ADMINS";
    AdminPermission[AdminPermission["REMAIN_ANONYMOUS"] = 7] = "REMAIN_ANONYMOUS";
})(AdminPermission || (AdminPermission = {}));
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
// export function isAdmin(ctx: Context, member: ChatMember, result: () => void) {
//     if (member.status === 'creator' || member.status === 'administrator') {
//         result()
//     } else {
//         ctx.reply(Strings.noPermission)
//     }
// }
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