bot.on(/(ahelp|adminhelp)( [^]+|)/i, (msg , text, text2) => {
    if(text2 != ""){
        try {
            send(bot.cmds.find((element, index, array) => {
                if(element.d.adminCommand){
                    if(element.d.adminCommand.indexOf(text2.replace(/\s+/g,'').toLowerCase()) != -1){
                        return element;
                    }
                }
            }).d.adminDesc.replace(/!/g,getSettingsChat.keyCommand));
        } catch(err) {
            send("Такой команды не существует");
        }
    } else {
        send(bot.cmds.map(x => x.d.admin).join(' ').replace(/!/g,getSettingsChat.keyCommand));
    }
}, {
admin:'!adminhelр - Используйте !adminhelp <команда> для получения информации о команде \n\nПример: !adminhelp adminhelp выведет информацию о команде \"!adminhelp\" \n\nКоманды:\n!adminhelp',
adminCommand:['adminhelp','ahelp'],
adminDesc:'!adminhelp - Используйте !adminhelp <команда> для получения информации о команде \n\nПример: !adminhelp adminhelp выведет информацию о команде \"!adminhelp\"'
}); 