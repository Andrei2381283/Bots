checker.addCheck("welcome", function(data){
    if(data.msg.id == 0 && data.getSettingsChat.welcome && data.msg.action != undefined && !data.getSettingsChat.banned.find(z => z.id == data.msg.action.member_id)){
        if(data.msg.action.type == 'chat_invite_user' || data.msg.action.type == 'chat_invite_user_by_link'){
            api.call('users.get',{user_id: data.msg.action.member_id}, function(err, res){
                send(data.getSettingsChat.welcomeMessage.replace(/\[name\]/,'[id'+data.msg.action.member_id+'|'+res.response[0].first_name+']'));
            })
        }
    }
})

bot.on(/(welcomeMessage|welMsg) ([^]+)/i, (msg, text, text2) => {
    if(admins.indexOf(`${msg.from_id}`) != -1 || getSettingsChat.admins.indexOf(`${msg.from_id}`) != -1 && msg.id == 0){
        getSettingsChat.welcome = true;
        getSettingsChat.welcomeMessage = text2;
        save();
        send('Сообщение установлено')
    } else {
        send('Я не администратор')
    }
}, {
admin:'\n!welcomeMessage',
adminCommand:['welcomeMessage','welmsg'],
adminDesc:'!welcomeMessage <text> - Сообщение из text будет сообщаться каждый раз, когда пользователь зайдет в беседу \n\nПример: !welcomeMessage Приветсвую - Как только пользователь присоединится к беседе напишится \'Приветствую\', если добавить [name], то упомянется имя пользователя ([name] может использоваться только 1 раз)'
});