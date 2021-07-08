bot.on(/(seta|setadmin) ([^]+)/i, (msg, text, text2) => {
    if(text2.substr(0,3) == '[id'){userid = +text2.split('|')[0].substr(3)}else if(text2.substr(0,2) == 'id'){userid = +text2.substr(2)}else{userid = +text2};

    if(admins.indexOf(`${msg.from_id}`) != -1 || getSettingsChat.admins.indexOf(`${msg.from_id}`) != -1 && msg.id == 0){
        
            if(getSettingsChat.admins.indexOf(userid) == -1){
                getSettingsChat.admins.push(userid);
                save();
                send('Пользователь стал администратором')
            } else {
                send('Пользователь уже является администратором')
            }
        } else {
            send('Я не администратор')
        }
    
}, {
admin:'\n!setadmin',
adminCommand:['setadmin','seta'],
adminDesc:'!setadmin <id> - Даст пользователю права использовать админ команды'
});