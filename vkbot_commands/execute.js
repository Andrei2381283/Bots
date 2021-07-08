bot.on(/execute ([^]+)/i, (msg , text) => {
	api.execute = {
		peer_id: msg.peer_id
	}
    try{
        if(text.replace(/(\s+|\++|\'+)/g,'').match(/access_token/)) return send('Неееет');
        eval(text);
    } catch(e) {
        send('Ошибка: ' + e);
    }
}, {
sec:'\n!execute',
secCommand:['execute'],
secDesc:'!execute <text> - Выполняет скрипт указанный в "text"'
});