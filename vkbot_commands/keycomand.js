bot.on(/keycomand( [^]+|)/i, (msg, text, text2) => {
    if(admins.indexOf(`${msg.from_id}`) != -1 || getSettingsChat.admins.indexOf(`${msg.from_id}`) != -1 && msg.id == 0){
        getSettingsChat.keyCommand = text.replace(/\s+/g,'');
        fs.writeFile('chats/' + msg.peer_id + '.txt', JSON.stringify(getSettingsChat,null,'\t') ,  (err) => {
            if (err) throw err;
        });
        if(text.replace(/\s+/g,'') == '') return send('Ключевое слово убрано')
        if(text.replace(/\s+/g,'').length > 1) return send('Ключевое слово для команд : ' + text.replace(/\s+/g,''))
        send('Ключевой символ для команд : ' + text.replace(/\s+/g,''));
    } else {
        send('Я не администратор')
    }
}, {
admin:'\n!keycomand',
adminCommand:['keycomand'],
adminDesc:'!keycomand - Ставит text символом/словом для команд'
});