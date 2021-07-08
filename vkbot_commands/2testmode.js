bot.on(/testmode/i, (msg , text) => {
    if(testmode){
    	send('Тестовый режим выключен')
    	testmode = false
    } else {
    	send('Тестовый режим включен')
    	testmode = true
    } 
}, {
sec:'\n!testmode',
secCommand:['testmode'],
secDesc:'!testmode - Включает и выключает тестовый режим, в этом режиме бот будет воспринимать только сообщения создателя'
});