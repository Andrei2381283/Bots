bot.on(/(dela|deladmin) ([^]+)/i, (msg, text, text2) => {
    if(text2.substr(0,3) == '[id'){userid = +text2.split('|')[0].substr(3)}else if(text2.substr(0,2) == 'id'){userid = +text2.substr(2)}else{userid = +text2};

    if(admins.indexOf(`${msg.from_id}`) != -1 || getSettingsChat.admins.indexOf(`${msg.from_id}`) != -1 && msg.id == 0){
        
            if(getSettingsChat.admins.indexOf(userid) != -1 && userid != getSettingsChat.admins[0]){
                getSettingsChat.admins.splice(getSettingsChat.admins.indexOf(userid), 1);
                save
                send('Пользователь больше не администратор')
            } else if(userid == getSettingsChat.admins[0]){
                send('Вы не можете снять с этого пользователя права администратора');
            } else {
                send('Пользователь не является администратором')
            }
        } else {
            send('Я не администратор')
        }
    
}, {
admin:'\n!deladmin',
adminCommand:['deladmin','dela'],
adminDesc:'!deladmin <id> - Заберет у пользователя права использовать админ команды'
});