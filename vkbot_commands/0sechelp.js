bot.on(/sechelp( [^]+|)/i, (msg , text) => {
    if(text != ""){
        try {
            send(bot.cmds.find((element, index, array) => {
                if(element.d.secCommand){
                    if(element.d.secCommand.indexOf(text.replace(/\s+/g,'').toLowerCase()) != -1){
                        return element;
                    }
                }
            }).d.secDesc.replace(/!/g,getSettingsChat.keyCommand));
        } catch(err) {
            send("Такой команды не существует");
        }
    } else {
       send(bot.cmds.map(x => x.d.sec).join(' ').replace(/!/g,getSettingsChat.keyCommand));
    }
}, {
sec:'!sechelр - Используйте !sechelp <команда> для получения информации о команде \n\nПример: !sechelp sechelp выведет информацию о команде \"!sechelp\" \n\nКоманды:\n!sechelp',
secCommand:['sechelp'],
secDesc:'!sechelр - Используйте !sechelp <команда> для получения информации о команде \n\nПример: !sechelp sechelp выведет информацию о команде \"!sechelp\"'
});