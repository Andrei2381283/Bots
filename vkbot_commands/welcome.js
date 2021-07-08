bot.on(/(welcome|wel)( on| off| get|)/i, (msg, text, text2) => {
    if(admins.indexOf(`${msg.from_id}`) != -1 || getSettingsChat.admins.indexOf(`${msg.from_id}`) != -1 && msg.id == 0){     
    if(text2 == "") return send(bot.cmds.find((element, index, array) => {
      if(element.d.adminCommand){
        if(element.d.adminCommand.indexOf("welcome") != -1){
          return element;
        }
      }
    }).d.adminDesc.replace(/!/g,getSettingsChat.keyCommand))
    if(text2.toLowerCase() == ' on'){
      getSettingsChat.welcome = true;
      save();
      send('Приветственное сообщение: on')
    }if(text2.toLowerCase() == ' get'){
      send(getSettingsChat.welcomeMessage);
    } else {
      getSettingsChat.welcome = false;
      save()
      send('Приветственное сообщение: off')
    }
  } else {
    send('Я не администратор')
  }  
}, {
admin:'\n!welcome',
adminCommand:['welcome','wel'],
adminDesc:'!welcome <on/off/get> - Если on, то приветственное сообщение будет сообщаться, если off, то не будет, get - возвращает приветсвенное сообщение'
});