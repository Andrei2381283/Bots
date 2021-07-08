bot.on(/unban ([^]+)/i, (msg, text) => {
    if(text.split(" ")[0].substr(0,3) == '[id'){userid = +text.split(" ")[0].split('|')[0].substr(3)}else if(text.substr(0,2) == 'id'){userid = +text.split(" ")[0].substr(2)}else{userid = +text.split(" ")[0]};

    if(admins.indexOf(`${msg.from_id}`) != -1 || getSettingsChat.admins.indexOf(`${msg.from_id}`) != -1 && msg.id == 0){
        
            if(userid <= 1000000000 && userid >= 0){
                fs.readFile('chats/' + msg.peer_id + '.txt', (err, data) => {
                    var gettedInfo = JSON.parse(data);
                    if(!gettedInfo.banned.find(z => z.id == userid)){
                        send('Пользователь не забанен')
                    } else {
                        gettedInfo.banned.splice(gettedInfo.banned.indexOf(gettedInfo.banned.find(z => z.id == userid)),1)
                        fs.writeFile('chats/' + msg.peer_id + '.txt', JSON.stringify(gettedInfo) ,  (err) => {
                            if (err) throw err;
                        });
                        send('Пользователь разбанен')
                    }
                });
            } else {
                send('id должен быть циферным и больше 0 или должен быть упоминанием пользователя, и не должен принадлежать сообществу')
            }
        } else {
            send('Я не администратор')
        }
    
}, {
admin:'\n!unban',
adminCommand:['unban'],
adminDesc:'!unban <id> - Снимает бан с пользователя'
});