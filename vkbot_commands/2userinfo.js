bot.on(/(userinfo|uinfo)( [^]+|)/i, (msg, text, text2) => {
    if(text2 == ''){
        userinfo(msg.from_id);
    } else {
        if(text2.replace(/\s+/g,'').substr(0,3) == '[id'){userid = +text2.replace(/\s+/g,'').split('|')[0].substr(3)}else if(text2.replace(/\s+/g,'').substr(0,2) == 'id'){userid = +text2.replace(/\s+/g,'').substr(2)}else{userid = +text2.replace(/\s+/g,'')};
        userinfo(userid);
    }
}, {
normal:'\n!userinfo',
command:['userinfo','uinfo'],
desc:'!userinfo <id> - Показывает информацию о пользователе (если не указать id, то будет показана ваша информация)'
});