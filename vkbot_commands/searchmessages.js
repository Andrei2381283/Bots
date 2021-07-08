bot.on(/(searchmessages|searchms)( [^]+)/i, (msg, text1, text2) => {
    //send(text2);
    if(text2 == "") return send(bot.cmds.find((element, index, array) => {
    	if(element.d.adminCommand){
    		if(element.d.adminCommand.indexOf("welcome") != -1){
        		return element;
        	}
    	}
    }).d.adminDesc.replace(/!/g,getSettingsChat.keyCommand))
    var subcommands = text2.substr(1).split(" ");
    api.call('messages.search', {q:subcommands[0], peer_id:msg.peer_id, count:100}, function(err,data) {
    	if(data.response.count == 0) send('Не удалось найти сообщения');
    	var messages = [];
    	for(var i in data.response.items){
    		messages.push(data.response.items[i].id);
    	}
    	send(messages);
    	//api.call('messages.send', {peer_id:msg.peer_id,message:'Найдено ' + data.response.count + 'сообщений. Текущая страница: ' + (subcommands[1] || 1) + '. Всего страниц: ' + Math.ceil(data.response.count/10)});
    });
}, {
normal:'\n!searchmessages',
command:['searchmessages', 'searchms'],
desc:'!searchmessages - Поиск сообщения в этой беседе'
});