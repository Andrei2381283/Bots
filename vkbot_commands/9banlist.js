bot.on(/banlist/i, (msg, text) => {
    if(msg.id != 0) return;
    fs.readFile('chats/' + msg.peer_id + '.txt', (err, data) => {
        var gettedInfo = JSON.parse(data);
        var bbbbbb = '';
        var numBanUser;
        if(gettedInfo.banned[0]){
            for(var i = 0;i < gettedInfo.banned.length;i++){
                numBanUser = i + 1
                bbbbbb += numBanUser + '. [id' + gettedInfo.banned[i].id +'|' + gettedInfo.banned[i].first_name + ' ' + gettedInfo.banned[i].last_name + '] - Время бана истечет: ' + banDet(gettedInfo.banned[i].expDate) + '\n';
                if(i == (gettedInfo.banned.length - 1)){
                    send(bbbbbb);
                    bbbbbb = '';
                }
            }
        } else {
            send('Забаненых пользователей нету')
        }
    })
}, {
admin:'\n!banlist',
adminCommand:['banlist'],
adminDesc:'!banlist - Выводит список забаненых пользователей'
});