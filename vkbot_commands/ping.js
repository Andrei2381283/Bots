bot.on(/ping/i, (msg) => {
	var delay = 0;
	var inter = setInterval(function(){
		++delay;
	}, 1);
	api.call('utils.getServerTime',{}, (error, response) => {
		clearInterval(inter);
		var botDelay = "\nЗадержка ответа бота: Отключено";
		if(pingMeter.meter)botDelay ='\nЗадержка ответа бота: ' + (delay + pingMeter.delay) + ' ms';
		send('Задержка ответа vk: ' + delay + ' ms' + botDelay);
	})
}, {
sec:'\n!ping',
secCommand:['ping'],
secDesc:'!ping - Проверить скорость ответа'
});