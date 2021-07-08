bot.on(/(calc|calculate)( [^]+|)/i, (msg, text, text2) => {
    if(text2 == ''){
        send('Необходимо указать пример для решения');
    } else if(!getSettingsChat.mathgame.gamestart && !getSettingsChat.mathgame.gamestartpvp && !getSettingsChat.mathgame.pvp) {
    	var b = text2.match(/(([A-Za-zа-яА-Я]+)\.([A-Za-zа-яА-Я]+)|[A-Za-zа-яА-Я]+)/g);
    	for(var i in b){
    		if(b[i].split('.')[0] == 'Math' && b[i].split('.')[1] in Math){
    			b.splice(i, 1);
    		}
    	}
    	if(b && b.length != 0) return send('Неизвестные знаки в примере');
	    var ans;
	    try {
	    	eval('ans = ' + text2.replace(/\s+/g,''));
	    } catch (err) {
	    	return send('Ошибка: ' + err);
	    }
	    send('Ответ: ' + ans);
    } else {
     send('Сейчас идет математическая игра');
    }
}, {
normal:'\n!calculate',
command:['calc', 'calculate'],
desc:'!calculate <пример> - Решает пример'
});