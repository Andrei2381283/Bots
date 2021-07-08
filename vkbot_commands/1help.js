bot.on(/(help|помощь|справка)( [^]+|)/i, (msg , text, text2) => {
    if(text2 != ""){
        try {
            send(bot.cmds.find((element, index, array) => {
                if(element.d.command){
                    if(element.d.command.indexOf(text2.replace(/\s+/g,'').toLowerCase()) != -1){
                        return element;
                    }
                }
            }).d.desc.replace(/!/g,getSettingsChat.keyCommand));
        } catch(err) {
            send("Такой команды не существует");
        }
    } else {
        send(bot.cmds.map(x => x.d.normal).join(' ').replace(/!/g,getSettingsChat.keyCommand));
    }
}, {
normal:'!helр - Используйте !help <команда> для получения информации о команде \n\nПример: !help help выведет информацию о команде \"!help\" \n\nКоманды:\n!help',
command:['help','помощь','справка'],
desc:'!help - Используйте !help <команда> для получения информации о команде \n\nПример: !help help выведет информацию о команде \"!help\"'
});