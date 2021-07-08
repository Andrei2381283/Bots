checker.addCheck("ban_check", function(data){
    if(iadmin && data.msg.action != undefined && (data.msg.action.type == 'chat_invite_user' || data.msg.action.type == 'chat_invite_user_by_link')){
        if(data.getSettingsChat.banned.find(z => z.id == data.msg.action.member_id) != undefined){
            api.call('utils.getServerTime',{},(err, response) => {
                if(data.getSettingsChat.banned.find(z => z.id == data.msg.action.member_id).expDate > response.response || data.getSettingsChat.banned.find(z => z.id == data.msg.action.member_id).expDate == "Forever"){
                    send('[id' + data.msg.action.member_id + '|' + data.getSettingsChat.banned.find(z => z.id == data.msg.action.member_id).first_name + '], вы забанены! Время бана истечет: ' + banDet(data.getSettingsChat.banned.find(z => z.id == data.msg.action.member_id).expDate))
                    setTimeout(function(){
                        api.call('messages.removeChatUser',{chat_id:data.getSettingsChat.chat_id,user_id:data.msg.action.member_id})
                    },150)
                }
            })
        }
    }
    api.call('utils.getServerTime',{}, (err, response) => {
        if(data.getSettingsChat.banned.find(z => z.expDate < response.response) != undefined){
            send('У пользователя @id' + data.getSettingsChat.banned.find(z => z.expDate < response.response).id + ' истекло время бана, вы можете снова пригласить его в беседу')
            data.getSettingsChat.banned.splice(data.getSettingsChat.banned.indexOf(data.getSettingsChat.banned.find(z => z.expDate < response.response)),1)
            fs.writeFile('chats/' + data.msg.peer_id + '.txt', JSON.stringify(data.getSettingsChat,null,'\t') ,  (err) => {
                if (err) throw err;
            });
        }
    })
})

bot.on(/ban ([^]+)/i, (msg, text) => {
    if(text.split(" ")[0].substr(0,3) == '[id'){userid = +text.split(" ")[0].split('|')[0].substr(3)}else if(text.substr(0,2) == 'id'){userid = +text.split(" ")[0].substr(2)}else{userid = +text.split(" ")[0]};
    var text2;
    if(text.split(" ")[1]){
        text2 = text.split(" ")[1];
    } else {
        text2 = '';
    }

    if(admins.indexOf(`${msg.from_id}`) != -1 || getSettingsChat.admins.indexOf(`${msg.from_id}`) != -1 && msg.id == 0){
        
            if(userid <= 1000000000 && userid >= 0){
                if(text2 == ''){ //Permanently
                    fs.readFile('chats/' + msg.peer_id + '.txt', (err, data) => {
                        var gettedInfo = JSON.parse(data);
                        if(gettedInfo.banned.find(z => z.id == userid) != undefined){
                            send('Пользователь уже забанен')
                        } else {
                            api.call('users.get',{user_id:userid},(err, res) => {
                                    gettedInfo.banned.push({id:userid,expDate:'Forever',first_name:res.response[0].first_name,last_name:res.response[0].last_name})
                                    fs.writeFile('chats/' + msg.peer_id + '.txt', JSON.stringify(gettedInfo) ,  (err) => {
                                        if (err) throw err;
                                    });
                                    api.call('messages.removeChatUser',{chat_id:getSettingsChat.chat_id,user_id:userid})
                                    send('Пользователь забанен навсегда')
                                })
                        }
                    });
                } else {
                    fs.readFile('chats/' + msg.peer_id + '.txt', (err, data) => {
                        var gettedInfo = JSON.parse(data);
                        if(gettedInfo.banned.find(z => z.id == userid) != undefined){
                            send('Пользователь уже забанен')
                        } else {
                            var bantime = '';
                            api.call('utils.getServerTime',{})
                                .then(response => {
                                    api.call('users.get',{user_id:userid}, (err, res) => {
                                            bantime = (+response) + (+text2);
                                            gettedInfo.banned.push({id:userid,expDate:bantime,first_name:res.response[0].first_name,last_name:res.response[0].last_name})
                                            fs.writeFile('chats/' + msg.peer_id + '.txt', JSON.stringify(gettedInfo) ,  (err) => {
                                                if (err) throw err;
                                            });
                                            var sec = +text2 ;
                                            var h = sec/3600 ^ 0 ;
                                            var m = (sec-h*3600)/60 ^ 0 ;
                                            var s = sec-h*3600-m*60 ;
                                            var time = (h<10?"0"+h:h)+" ч. "+(m<10?"0"+m:m)+" мин. "+(s<10?"0"+s:s)+" сек."
                                            api.call('messages.removeChatUser',{chat_id:getSettingsChat.chat_id,user_id:userid})
                                            send('Пользователь забанен на ' + time);
                                        })
                                })
                        }
                    });
                }
            } else {
                send('id должен быть циферным и больше 0 или должен быть упоминанием пользователя, и не должен принадлежать сообществу')
            }
        } else {
            send('Я не администратор')
        }
    
}, {
admin:'\n!ban',
adminCommand:['ban'],
adminDesc:'!ban <id> <time> - Выдаст бан пользователю на указаное время(в секундах), если пользователя пригласят, то бот его сразу же кикнет (если не указать время, то бан будет вечным)'
});